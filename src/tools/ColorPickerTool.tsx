import React, { useState, useEffect } from 'react';
import { Copy, Check, Shuffle, RefreshCw } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
}

const ColorPickerTool: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<string>('#3B82F6');
  const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#3B82F6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  // Convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'rgb(0, 0, 0)';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  // Convert hex to HSL
  const hexToHsl = (hex: string): string => {
    // Convert hex to rgb
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'hsl(0, 0%, 0%)';
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  };
  
  // Update color values when current color changes
  useEffect(() => {
    setColorValues({
      hex: currentColor,
      rgb: hexToRgb(currentColor),
      hsl: hexToHsl(currentColor),
    });
  }, [currentColor]);
  
  // Load recent colors from localStorage
  useEffect(() => {
    const savedColors = localStorage.getItem('recentColors');
    if (savedColors) {
      setRecentColors(JSON.parse(savedColors));
    }
  }, []);
  
  // Add current color to recent colors
  const addToRecentColors = (color: string) => {
    const newRecentColors = [color, ...recentColors.filter(c => c !== color)].slice(0, 10);
    setRecentColors(newRecentColors);
    localStorage.setItem('recentColors', JSON.stringify(newRecentColors));
  };
  
  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
  };
  
  // Copy color value to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(colorValues[activeFormat]);
    setCopied(true);
    toast.success('Copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    addToRecentColors(currentColor);
  };
  
  // Generate random color
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setCurrentColor(randomColor);
    addToRecentColors(randomColor);
  };
  
  return (
    <div className="space-y-8">
      {/* Main color picker */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Color preview and picker */}
        <div className="w-full md:w-1/2">
          <div 
            className="w-full h-48 rounded-lg mb-4 shadow-inner border border-gray-200 dark:border-gray-800"
            style={{ backgroundColor: currentColor }}
          ></div>
          <input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>
        
        {/* Color values and controls */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Format tabs */}
          <div className="flex border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveFormat('hex')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeFormat === 'hex' 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              HEX
            </button>
            <button
              onClick={() => setActiveFormat('rgb')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeFormat === 'rgb' 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              RGB
            </button>
            <button
              onClick={() => setActiveFormat('hsl')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeFormat === 'hsl' 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              HSL
            </button>
          </div>
          
          {/* Color value display */}
          <div className="relative">
            <input
              type="text"
              value={colorValues[activeFormat]}
              readOnly
              className="input pr-10 font-mono text-center"
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-5 w-5 text-success-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-4">
            <button 
              onClick={generateRandomColor}
              className="btn-secondary flex-1 flex items-center justify-center"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Random Color
            </button>
          </div>
        </div>
      </div>
      
      {/* Color variations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Color Variations</h3>
        <div className="grid grid-cols-5 gap-2">
          {[900, 800, 700, 600, 500, 400, 300, 200, 100, 50].map((shade) => {
            // This is a simple implementation for demo purposes
            // A proper implementation would calculate actual shades
            const opacity = shade / 1000;
            return (
              <div 
                key={shade} 
                className="rounded-md overflow-hidden"
                onClick={() => setCurrentColor(`rgba(${parseInt(currentColor.slice(1, 3), 16)}, ${parseInt(currentColor.slice(3, 5), 16)}, ${parseInt(currentColor.slice(5, 7), 16)}, ${opacity})`)}
              >
                <div 
                  className="h-12 w-full cursor-pointer"
                  style={{ 
                    backgroundColor: `rgba(${parseInt(currentColor.slice(1, 3), 16)}, ${parseInt(currentColor.slice(3, 5), 16)}, ${parseInt(currentColor.slice(5, 7), 16)}, ${opacity})` 
                  }}
                ></div>
                <div className="text-xs p-1 text-center bg-white dark:bg-gray-800">{shade}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Recent Colors</h3>
          <div className="flex flex-wrap gap-2">
            {recentColors.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-800"
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
                title={color}
              ></button>
            ))}
            <button
              className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-800 flex items-center justify-center"
              onClick={() => {
                setRecentColors([]);
                localStorage.removeItem('recentColors');
              }}
              title="Clear recent colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerTool;