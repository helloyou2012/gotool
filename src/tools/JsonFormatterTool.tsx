import React, { useState } from 'react';
import { Copy, Check, Trash2, Upload } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { jsonrepair } from 'jsonrepair';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import lightStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light';
import darkStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import { toast } from '../components/ui/Toaster';
import { useThemeStore } from '../store/themeStore';

SyntaxHighlighter.registerLanguage('json', json);

const JsonFormatterTool: React.FC = () => {
  const { theme } = useThemeStore();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setError('Please enter some JSON to format');
        setOutput('');
        return;
      }

      const parsedJson = JSON.parse(jsonrepair(input));
      const formatted = JSON.stringify(parsedJson, null, indentSize);
      setOutput(formatted);
      setError(null);
      toast.success('JSON formatted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
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

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setError('Please enter some JSON to minify');
        setOutput('');
        return;
      }

      const parsedJson = JSON.parse(input);
      const minified = JSON.stringify(parsedJson);
      setOutput(minified);
      setError(null);
      toast.success('JSON minified successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Indent Size:</label>
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
          <button onClick={formatJson} className="btn-primary">
            Format
          </button>
          <button onClick={minifyJson} className="btn-secondary">
            Minify
          </button>
          <button onClick={clearAll} className="btn-secondary">
            <Trash2 className="h-4 w-4" />
          </button>
          <label className="btn-secondary cursor-pointer">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input JSON:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="input font-mono h-[400px] resize-none"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Formatted Output:</label>
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
                language="json"
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
                Formatted JSON will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatterTool;