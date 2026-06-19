import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { patterns } from '../data/patterns';
import { categories } from '../data/categories';
import { useAuth } from './AuthContext';
import { migrateLocalStorageProgress } from '../utils/migration';

interface ProgressState {
  completed: string[];
}

type ProgressAction =
  | { type: 'TOGGLE_COMPLETE'; payload: { patternId: string } }
  | { type: 'SET_COMPLETED'; payload: string[] };

interface ProgressContextType {
  completedPatterns: string[];
  toggleComplete: (patternId: string) => Promise<void>;
  isCompleted: (patternId: string) => boolean;
  getCategoryProgress: (categoryId: string) => { completed: number; total: number };
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const progressReducer = (state: ProgressState, action: ProgressAction): ProgressState => {
  switch (action.type) {
    case 'TOGGLE_COMPLETE': {
      const { patternId } = action.payload;
      const isCompleted = state.completed.includes(patternId);
      const newCompleted = isCompleted
        ? state.completed.filter((id) => id !== patternId)
        : [...state.completed, patternId];
      return { completed: newCompleted };
    }
    case 'SET_COMPLETED':
      return { completed: action.payload };
    default:
      return state;
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  
  const [state, dispatch] = useReducer(progressReducer, { completed: [] }, () => {
    // Initial sync load: local storage is fallback only when offline
    const saved = localStorage.getItem('completed-patterns');
    return { completed: saved ? JSON.parse(saved) : [] };
  });

  // Sync logic: Fetch progress from backend if authenticated
  const refreshProgress = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      // 1. Perform client storage migration if keys exist
      const localKey = 'completed-patterns';
      if (localStorage.getItem(localKey)) {
        await migrateLocalStorageProgress(session.access_token);
      }

      // 2. Fetch server progress state
      const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const serverProgress = await response.json(); // Array of { patternId, completed }
        const completedIds = serverProgress
          .filter((item: any) => item.completed)
          .map((item: any) => item.patternId);
        
        dispatch({ type: 'SET_COMPLETED', payload: completedIds });
      }
    } catch (error) {
      console.error('Failed to sync progress with backend server:', error);
    }
  }, [session]);

  // Sync on session mount or changes
  useEffect(() => {
    if (session?.access_token) {
      refreshProgress();
    } else {
      // Offline fallback: load from local storage if signed out
      const saved = localStorage.getItem('completed-patterns');
      dispatch({ type: 'SET_COMPLETED', payload: saved ? JSON.parse(saved) : [] });
    }
  }, [session, refreshProgress]);

  // Persist only offline progress locally
  useEffect(() => {
    if (!session) {
      localStorage.setItem('completed-patterns', JSON.stringify(state.completed));
    }
  }, [state.completed, session]);

  const toggleComplete = async (patternId: string) => {
    const nextCompleted = state.completed.includes(patternId);
    
    // Optimistically update client UI state
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { patternId } });

    if (session?.access_token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            patternId,
            completed: !nextCompleted, // toggle logic
          }),
        });

        if (!response.ok) {
          throw new Error('Server update failed');
        }
      } catch (error) {
        console.error('Backend sync failed, rolling back UI progress state:', error);
        // Rollback state on error
        dispatch({ type: 'TOGGLE_COMPLETE', payload: { patternId } });
      }
    }
  };

  const isCompleted = (patternId: string) => {
    return state.completed.includes(patternId);
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return { completed: 0, total: 0 };
    const total = category.patternIds.length;
    const completed = category.patternIds.filter((id) => state.completed.includes(id)).length;
    return { completed, total };
  };

  const getOverallProgress = () => {
    const total = patterns.length;
    const completed = state.completed.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  return (
    <ProgressContext.Provider
      value={{
        completedPatterns: state.completed,
        toggleComplete,
        isCompleted,
        getCategoryProgress,
        getOverallProgress,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
