import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ToolData } from '../../data/toolsData';

interface ToolCardProps {
  tool: ToolData;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as Record<string, React.FC<{ className?: string }>>)[tool.icon] || LucideIcons.Box;
  
  return (
    <Link to={`/tools/${tool.id}`} className="card group">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-gray-800 text-primary-500 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-gray-700 transition-colors">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="flex space-x-2">
            {tool.popular && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-300">
                Popular
              </span>
            )}
            {tool.new && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-50 dark:bg-gray-800 text-accent-700 dark:text-accent-300">
                New
              </span>
            )}
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {tool.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {tool.description}
        </p>
      </div>
    </Link>
  );
};

export default ToolCard;