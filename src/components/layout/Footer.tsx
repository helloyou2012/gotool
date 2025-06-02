import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Laptop } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Laptop className="h-6 w-6 text-primary-500" />
              <span className="font-semibold text-lg">DevToolkit</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              A comprehensive collection of tools for frontend developers to streamline their workflow.
            </p>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/?category=colors" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Color Tools
                  </Link>
                </li>
                <li>
                  <Link to="/?category=css" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    CSS Generators
                  </Link>
                </li>
                <li>
                  <Link to="/?category=code" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Code Formatters
                  </Link>
                </li>
                <li>
                  <Link to="/?category=converters" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Converters
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} DevToolkit. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;