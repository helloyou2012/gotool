import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, 
  SunMedium, Moon, 
  ChevronDown, Laptop 
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { categories } from '../../data/toolsData';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Escape to close search
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Laptop className="h-6 w-6 text-primary-500" />
            <span className="font-semibold text-lg">DevToolkit</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center space-x-1 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/?category=${category.id}`}
                      className="block px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Search className="h-4 w-4" />
              <span>Search tools</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400">
                ⌘K
              </kbd>
            </button>
          </nav>
          
          {/* Theme and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-1 flex">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-1 rounded ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                  <SunMedium className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                  <Moon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="container-custom py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tool Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/?category=${category.id}`}
                  className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Search 
                className="h-5 w-5 text-gray-500" 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              />
              <span className="text-sm">Search tools</span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-1 flex">
              <button
                onClick={() => setTheme('light')}
                className={`p-1 rounded ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <SunMedium className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh]">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Search results would go here */}
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Type to search for tools
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;