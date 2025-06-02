import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import ToolCard from '../components/ui/ToolCard';
import { categories, tools, getToolsByCategory, getPopularTools, getNewTools, searchTools } from '../data/toolsData';
import { useRecentToolsStore } from '../store/recentToolsStore';

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { recentTools } = useRecentToolsStore();
  
  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    setActiveCategory(category);
  }, [location.search]);
  
  // Update URL when category changes
  const handleCategoryChange = (categoryId: string | null) => {
    if (categoryId) {
      navigate(`/?category=${categoryId}`);
    } else {
      navigate('/');
    }
    setActiveCategory(categoryId);
  };
  
  // Filter tools based on search query and active category
  const filteredTools = searchQuery 
    ? searchTools(searchQuery)
    : activeCategory 
      ? getToolsByCategory(activeCategory)
      : tools;
  
  // Get recent tools data
  const recentToolsData = tools.filter(tool => 
    recentTools.includes(tool.id)
  );
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="py-8 md:py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Frontend Developer Tools
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            A collection of essential tools to make frontend development faster and easier
          </p>
          
          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/70" />
            </div>
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section>
        <div className="flex overflow-x-auto pb-2 space-x-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === null
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}
          >
            All Tools
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>
      
      {/* Recent Tools Section */}
      {recentToolsData.length > 0 && !activeCategory && !searchQuery && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recently Used</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentToolsData.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
      
      {/* Popular Tools Section */}
      {!activeCategory && !searchQuery && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Popular Tools</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPopularTools().map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
      
      {/* New Tools Section */}
      {!activeCategory && !searchQuery && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Tools</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getNewTools().map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
      
      {/* Tools Section (filtered by category or search) */}
      {(activeCategory || searchQuery) && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {activeCategory ? 
                `${categories.find(c => c.id === activeCategory)?.name} Tools` : 
                'Search Results'}
            </h2>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No tools found. Try a different search term.</p>
            </div>
          )}
        </section>
      )}
      
      {/* All Categories */}
      {!activeCategory && !searchQuery && (
        <section>
          <h2 className="text-xl font-semibold mb-4">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="card hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer"
                onClick={() => handleCategoryChange(category.id)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {category.description}
                  </p>
                  <span className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
                    View tools <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;