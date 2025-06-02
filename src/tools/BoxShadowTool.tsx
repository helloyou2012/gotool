import React, { useState } from 'react';
import { Copy, Check, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

const BoxShadowTool: React.FC = () => {
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: '1',
      offsetX: 0,
      offsetY: 4,
      blur: 8,
      spread: 0,
      color: '#00000020',
      inset: false,
    },
  ]);
  const [copied, setCopied] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(8);

  const generateBoxShadow = () => {
    return shadows
      .map(
        (shadow) =>
          `${shadow.inset ? 'inset ' : ''}${shadow.offsetX}px ${shadow.offsetY}px ${
            shadow.blur
          }px ${shadow.spread}px ${shadow.color}`
      )
      .join(', ');
  };

  const addShadow = () => {
    setShadows([
      ...shadows,
      {
        id: Math.random().toString(36).substr(2, 9),
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: '#00000020',
        inset: false,
      },
    ]);
  };

  const removeShadow = (id: string) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter((shadow) => shadow.id !== id));
    } else {
      toast.error('You must have at least one shadow layer');
    }
  };

  const updateShadow = (id: string, field: keyof Shadow, value: number | string | boolean) => {
    setShadows(
      shadows.map((shadow) =>
        shadow.id === id ? { ...shadow, [field]: value } : shadow
      )
    );
  };

  const copyToClipboard = () => {
    const css = `box-shadow: ${generateBoxShadow()};`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success('CSS copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetShadows = () => {
    setShadows([
      {
        id: '1',
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: '#00000020',
        inset: false,
      },
    ]);
    setBackgroundColor('#ffffff');
    setBorderRadius(8);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Shadow Layers</h3>
            <div className="flex space-x-2">
              <button onClick={addShadow} className="btn-secondary">
                <Plus className="h-4 w-4" />
              </button>
              <button onClick={resetShadows} className="btn-secondary">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {shadows.map((shadow) => (
              <div
                key={shadow.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Layer {shadows.indexOf(shadow) + 1}</span>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Offset X</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.offsetX}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'offsetX', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={shadow.offsetX}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'offsetX', parseInt(e.target.value))
                      }
                      className="input mt-2 w-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Offset Y</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.offsetY}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'offsetY', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={shadow.offsetY}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'offsetY', parseInt(e.target.value))
                      }
                      className="input mt-2 w-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Blur</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadow.blur}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'blur', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={shadow.blur}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'blur', parseInt(e.target.value))
                      }
                      className="input mt-2 w-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Spread</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.spread}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'spread', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      value={shadow.spread}
                      onChange={(e) =>
                        updateShadow(shadow.id, 'spread', parseInt(e.target.value))
                      }
                      className="input mt-2 w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <input
                      type="color"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                      className="w-20 h-8 rounded cursor-pointer"
                    />
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">Inset</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-20 h-8 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Border Radius</label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="input mt-2 w-20"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="aspect-square rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
            <div
              className="w-48 h-48"
              style={{
                backgroundColor,
                borderRadius: `${borderRadius}px`,
                boxShadow: generateBoxShadow(),
              }}
            ></div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Generated CSS:</label>
              <button
                onClick={copyToClipboard}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copied ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-sm">
              box-shadow: {generateBoxShadow()};
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxShadowTool;