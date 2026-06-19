import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { Layout } from './components/Layout/Layout';
import { PatternIndex } from './components/PatternIndex/PatternIndex';

// Code split routes using dynamic imports
const LessonPage = React.lazy(() => 
  import('./components/LessonPage/LessonPage').then(module => ({ default: module.LessonPage }))
);
const ProgressDashboard = React.lazy(() => 
  import('./components/Progress/ProgressDashboard').then(module => ({ default: module.ProgressDashboard }))
);

// Fallback Loading Indicator
const RouteLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '60vh',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: '1.1rem'
  }}>
    Loading component...
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<PatternIndex />} />
                  <Route path="pattern/:id" element={<LessonPage />} />
                  <Route path="progress" element={<ProgressDashboard />} />
                  {/* Fallback route */}
                  <Route path="*" element={<PatternIndex />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
