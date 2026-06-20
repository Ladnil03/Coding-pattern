export interface MigrationPayload {
  patternId: string;
  completed: boolean;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Migrates local storage progress to the remote database upon user authentication.
 * It reads completed pattern list and performs bulk synchronization.
 */
export async function migrateLocalStorageProgress(accessToken: string): Promise<{ success: boolean; migratedCount: number }> {
  const localKey = 'completed-patterns';
  const saved = localStorage.getItem(localKey);
  
  if (!saved) {
    return { success: true, migratedCount: 0 };
  }

  let completedIds: string[] = [];
  try {
    completedIds = JSON.parse(saved);
  } catch (error) {
    console.error('Failed to parse local storage progress data:', error);
    return { success: false, migratedCount: 0 };
  }

  if (completedIds.length === 0) {
    return { success: true, migratedCount: 0 };
  }

  // Map simple string array to bulk migration payload
  const migrationPayload: MigrationPayload[] = completedIds.map((patternId) => ({
    patternId,
    completed: true,
    updatedAt: new Date().toISOString(), // Use migration execution time
  }));

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress/migrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ progress: migrationPayload }),
    });

    if (!response.ok) {
      throw new Error(`Sync request failed with status code ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      // Clean up localStorage to prevent subsequent duplicate migration runs
      localStorage.removeItem(localKey);
      return { success: true, migratedCount: migrationPayload.length };
    }

    return { success: false, migratedCount: 0 };
  } catch (error) {
    console.error('Error executing progress migration:', error);
    return { success: false, migratedCount: 0 };
  }
}
