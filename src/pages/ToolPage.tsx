import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Share2, BookmarkPlus, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getToolById, getToolsByCategory } from '../data/toolsData';
import { useRecentToolsStore } from '../store/recentToolsStore';
import { toast } from '../components/ui/Toaster';
import ColorPickerTool from '../tools/ColorPickerTool';
import JsonFormatterTool from '../tools/JsonFormatterTool';
import BoxShadowTool from '../tools/BoxShadowTool';
import GradientGeneratorTool from '../tools/GradientGeneratorTool';

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { addRecentTool } = useRecentToolsStore();
  
  const tool = toolId ? getToolById(toolId) : undefined;
  
  useEffect(() => {
    if (!tool && toolId) {
      navigate('/');
      toast.error('Tool not found');
    }
  }, [tool, toolId, navigate]);
  
  useEffect(() => {
    if (tool) {
      addRecentTool(tool.id);
    }
  }, [tool, addRecentTool]);
  
  if (!tool) {
    return null;
  }
  
  const relatedTools = getToolsByCategory(tool.category)
    .filter(t => t.id !== tool.id)
    .slice(0, 3);
  
  const IconComponent = (LucideIcons as Record<string, React.FC<{ className?: string }>>)[tool.icon] || LucideIcons.Box;
  
  const renderToolComponent = () => {
    switch (toolId) {
      case 'color-picker':
        return <ColorPickerTool />;
      case 'json-formatter':
        return <JsonFormatterTool />;
      case 'box-shadow':
        return <BoxShadowTool />;
      case 'gradient-generator':
        return <GradientGeneratorTool />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Tool content coming soon</p>
          </div>
        );
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tool.title,
        text: tool.description,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-900 dark:text-gray-100">{tool.title}</span>
      </nav>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-gray-800 text-primary-500 dark:text-primary-400 mr-4">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{tool.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleShare}
            className="btn-secondary flex items-center"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
          <button className="btn-secondary flex items-center">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="p-6">
          {renderToolComponent()}
        </div>
      </div>
      
      {relatedTools.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relatedTool) => (
              <Link 
                key={relatedTool.id} 
                to={`/tools/${relatedTool.id}`} 
                className="card hover:border-primary-300 dark:hover:border-primary-700"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-md bg-primary-50 dark:bg-gray-800 text-primary-500 dark:text-primary-400 mr-3">
                      {(() => {
                        const RelatedIconComponent = (LucideIcons as Record<string, React.FC<{ className?: string }>>)[relatedTool.icon] || LucideIcons.Box;
                        return <RelatedIconComponent className="h-4 w-4" />;
                      })()}
                    </div>
                    <h3 className="font-medium">{relatedTool.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {relatedTool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPage;