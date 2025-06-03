import React, { useState } from 'react';
import { Copy, Check, ArrowRight, ArrowLeft, RotateCcw, Upload } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'js-yaml';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import lightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light';
import darkStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import { toast } from '../components/ui/Toaster';
import { useThemeStore } from '../store/themeStore';
import { parseJSON } from '../utils';

SyntaxHighlighter.registerLanguage('json', json);

const YamlJsonTool: React.FC = () => {
  const { theme } = useThemeStore();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'yaml2json' | 'json2yaml'>('yaml2json');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const convertYamlToJson = (yamlStr: string): string => {
    try {
      const parsed = yaml.load(yamlStr);
      return JSON.stringify(parsed, null, indentSize);
    } catch (err) {
      throw new Error('Invalid YAML syntax');
    }
  };

  const convertJsonToYaml = (jsonStr: string): string => {
    try {
      const parsed = parseJSON(jsonStr);
      return yaml.dump(parsed, {
        indent: indentSize,
        lineWidth: -1,
        noRefs: true,
      });
    } catch (err) {
      throw new Error('Invalid JSON syntax');
    }
  };

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setError(`Please enter ${mode === 'yaml2json' ? 'YAML' : 'JSON'} to convert`);
        setOutput('');
        return;
      }

      const result = mode === 'yaml2json' ? convertYamlToJson(input) : convertJsonToYaml(input);
      setOutput(result);
      setError(null);
      toast.success(`Converted to ${mode === 'yaml2json' ? 'JSON' : 'YAML'} successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const toggleMode = () => {
    setMode(mode === 'yaml2json' ? 'json2yaml' : 'yaml2json');
    setInput(output);
    setOutput('');
    setError(null);
  };

  const getExampleInput = (): string => {
    if (mode === 'yaml2json') {
      return `# Example YAML
name: John Doe
age: 30
address:
  street: 123 Main St
  city: New York
  country: USA
hobbies:
  - reading
  - gaming
  - traveling
active: true`;
    } else {
      return `{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": [
    "reading",
    "gaming",
    "traveling"
  ],
  "active": true
}`;
    }
  };

  const loadExample = () => {
    setInput(getExampleInput());
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-nowrap">Indent Size:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="input py-1 px-2"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="8">8 spaces</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button onClick={handleConvert} className="btn-primary">
            Convert
          </button>
          <button onClick={toggleMode} className="btn-secondary">
            {mode === 'yaml2json' ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
          </button>
          <button onClick={clearAll} className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
          </button>
          <label className="btn-secondary cursor-pointer">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept=".yaml,.yml,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <button onClick={loadExample} className="btn-secondary">
          Load Example
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Input {mode === 'yaml2json' ? 'YAML' : 'JSON'}:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${mode === 'yaml2json' ? 'YAML' : 'JSON'} here...`}
            className="input font-mono h-[400px] resize-none"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">
              Output {mode === 'yaml2json' ? 'JSON' : 'YAML'}:
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>
          <div className="relative h-[400px] rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-auto">
            {error ? (
              <div className="p-4 text-error-500">{error}</div>
            ) : output ? (
              <SyntaxHighlighter
                language={mode === 'yaml2json' ? 'json' : 'yaml'}
                style={theme === 'dark' ? darkStyle : lightStyle}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                  height: '100%',
                }}
              >
                {output}
              </SyntaxHighlighter>
            ) : (
              <div className="p-4 text-gray-500 dark:text-gray-400">
                Converted {mode === 'yaml2json' ? 'JSON' : 'YAML'} will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YamlJsonTool;
