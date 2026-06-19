import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Renders the header with hamburger hook */}
      <Header onMenuClick={toggleSidebar} />

      <div className={styles.body}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main id="main-content" className={styles.main}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
