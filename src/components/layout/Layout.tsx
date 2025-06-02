import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '../ui/Toaster';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-gray-700 dark:text-gray-300">
      <Header />
      <main className="flex-grow container-custom py-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;