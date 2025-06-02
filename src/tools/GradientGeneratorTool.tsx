import React, { useState } from 'react';
import { Copy, Check, Plus, Minus, RotateCcw, Shuffle } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';

const GradientGeneratorTool: React.FC = () => {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#3B82F6', position: 0 },
    { id: '2', color: '#8B5CF6', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateGradient = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopsString})`;
      case 'radial':
        return `radial-gradient(circle at center, ${stopsString})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg at center, ${stopsString})`;
      default:
        return '';
    }
  };

  const addStop = () => {
    if (stops.length >= 5) {
      toast.error('Maximum 5 color stops allowed');
      return;
    }

    const lastPosition = stops[stops.length - 1].position;
    const newPosition = Math.min(lastPosition + 20, 100);

    setStops([
      ...stops,
      {
        id: Math.random().toString(36).substr(2, 9),
        color: '#A855F7',
        position: newPosition,
      },
    ]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) {
      toast.error('Minimum 2 color stops required');
      return;
    }
    setStops(stops.filter((stop) => stop.id !== id));
  };

  const updateStop = (id: string, field: keyof GradientStop, value: string | number) => {
    setStops(
      stops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop
      )
    );
  };

  const copyToClipboard = () => {
    const css = `background: ${generateGradient()};`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success('CSS copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetGradient = () => {
    setGradientType('linear');
    setAngle(90);
    setStops([
      { id: '1', color: '#3B82F6', position: 0 },
      { id: '2', color: '#8B5CF6', position: 100 },
    ]);
  };

  const generateRandomGradient = () => {
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    setStops(
      stops.map(stop => ({
        ...stop,
        color: randomColor(),
      }))
    );
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Gradient Settings</h3>
            <div className="flex space-x-2">
              <button onClick={generateRandomGradient} className="btn-secondary" title="Random Gradient">
                <Shuffle className="h-4 w-4" />
              </button>
              <button onClick={resetGradient} className="btn-secondary" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gradient Type</label>
              <div className="flex space-x-2">
                {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`btn flex-1 ${
                      gradientType === type
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {(gradientType === 'linear' || gradientType === 'conic') && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {gradientType === 'linear' ? 'Angle' : 'Starting Angle'}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="input w-20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">Color Stops</label>
                <button
                  onClick={addStop}
                  className="btn-secondary"
                  title="Add Color Stop"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Stop {index + 1}</span>
                    {stops.length > 2 && (
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Position</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) =>
                            updateStop(stop.id, 'position', parseInt(e.target.value))
                          }
                          className="flex-1"
                        />
                        <input
                          type="number"
                          value={stop.position}
                          onChange={(e) =>
                            updateStop(stop.id, 'position', parseInt(e.target.value))
                          }
                          className="input w-16"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div
            className="aspect-square rounded-lg"
            style={{ background: generateGradient() }}
          ></div>

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
              background: {generateGradient()};
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGeneratorTool;