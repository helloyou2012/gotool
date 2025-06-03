import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

export interface JsonViewProps {
  data: any;
  name?: string;
  isRoot?: boolean;
  level?: number;
  path?: string[];
}

export interface JsonNodeProps {
  value: any;
  name?: string;
  level: number;
  path: string[];
}

export interface CopyMenuProps {
  value: any;
  path: string[];
  onClose: () => void;
  position: { x: number; y: number };
}

function CopyMenu({ value, path, onClose, position }: CopyMenuProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      setTimeout(() => {
        setCopiedItem(null);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getJsonPath = () => {
    return path.length > 0 ? path.join('.') : 'root';
  };

  const getFormattedValue = () => {
    if (typeof value === 'string') return `"${value}"`;
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return JSON.stringify(value, null, 2);
  };

  const menuItems = [
    {
      label: 'Copy Value',
      action: () => copyToClipboard(getFormattedValue(), 'value'),
      description: 'Copy the formatted value',
    },
    {
      label: 'Copy Raw Value',
      action: () => copyToClipboard(String(value), 'raw'),
      description: 'Copy the raw value without formatting',
    },
    {
      label: 'Copy Path',
      action: () => copyToClipboard(getJsonPath(), 'path'),
      description: 'Copy the JSON path to this property',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-1 min-w-48"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={String(index)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 hover:dark:bg-gray-900 flex items-center justify-between group"
            onClick={item.action}
          >
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
            {copiedItem === item.label.toLowerCase().split(' ')[1]
              ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              )
              : (
                <Copy className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
              )}
          </button>
        ))}
      </div>
    </>
  );
}

function JsonNode({ value, name, level, path }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [copyMenuPosition, setCopyMenuPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const currentPath = name ? [...path, name] : path;

  const getDataType = (val: any): string => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const getValueColor = (type: string): string => {
    switch (type) {
      case 'string':
        return 'text-red-600 dark:text-red-400';
      case 'number':
        return 'text-green-600 dark:text-green-400';
      case 'boolean':
        return 'text-blue-600 dark:text-blue-400';
      case 'null':
        return 'text-blue-500 dark:text-blue-400';
      case 'undefined':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-gray-900 dark:text-gray-100';
    }
  };

  const formatValue = (val: any, type: string): string => {
    switch (type) {
      case 'string':
        return `"${val}"`;
      case 'null':
        return 'null';
      case 'undefined':
        return 'undefined';
      default:
        return String(val);
    }
  };

  const isExpandable = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    return typeof val === 'object' || Array.isArray(val);
  };

  const getPreviewText = (val: any): string => {
    if (Array.isArray(val)) {
      return `Array(${val.length})`;
    }
    if (typeof val === 'object' && val !== null && val !== undefined) {
      try {
        const keys = Object.keys(val);
        return `{${keys.length > 0 ? `${keys.length} ${keys.length === 1 ? 'property' : 'properties'}` : ''}}`;
      } catch {
        return '{}';
      }
    }
    return '';
  };

  const getObjectEntries = (val: any): [string, any][] => {
    if (val === null || val === undefined) return [];
    try {
      return Object.entries(val);
    } catch {
      return [];
    }
  };

  const getObjectKeys = (val: any): string[] => {
    if (val === null || val === undefined) return [];
    try {
      return Object.keys(val);
    } catch {
      return [];
    }
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setCopyMenuPosition({
      x: rect.right + 5,
      y: rect.top,
    });
    setShowCopyMenu(true);
  };

  const type = getDataType(value);
  const indent = level * 20;

  // Check if the value has content
  let hasContent = false;
  if (Array.isArray(value)) {
    hasContent = value.length > 0;
  } else if (typeof value === 'object' && value !== null && value !== undefined) {
    hasContent = getObjectKeys(value).length > 0;
  }

  const renderCopyBtn = () => {
    return (
      <>
        <button
          onClick={handleCopyClick}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy options"
          style={{ visibility: isHovered ? 'visible' : 'hidden' }}
        >
          <Copy className="w-3 h-3" />
        </button>
        {showCopyMenu && (
          <CopyMenu
            value={value}
            path={currentPath}
            onClose={() => setShowCopyMenu(false)}
            position={copyMenuPosition}
          />
        )}
      </>
    );
  };

  if (!isExpandable(value)) {
    return (
      <div
        className="flex items-center py-0.5 hover:bg-blue-50 hover:dark:bg-blue-950 rounded px-1 -mx-1 group"
        style={{ paddingLeft: `${indent}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-4" />
        <div className="flex items-center flex-1">
          {name && (
            <>
              <span className="text-cyan-700 dark:text-cyan-300 font-medium">{name}</span>
              <span className="text-gray-500 mx-1">:</span>
            </>
          )}
          <span className={getValueColor(type)}>{formatValue(value, type)}</span>
        </div>
        {renderCopyBtn()}
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center py-0.5 hover:bg-blue-50 hover:dark:bg-blue-950 rounded px-1 -mx-1 cursor-pointer group"
        style={{ paddingLeft: `${indent}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          // 如果点击的是复制按钮，不触发展开/收起
          if (e.target instanceof Element && e.target.closest('button')) {
            return;
          }
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="w-4 flex items-center justify-center">
          {hasContent && (
            <span className="text-gray-400 dark:text-gray-600">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
          )}
        </div>
        <div className="flex items-center flex-1">
          {name && (
            <>
              <span className="text-cyan-700 dark:text-cyan-300 font-medium">{name}</span>
              <span className="text-gray-500 mx-1">:</span>
            </>
          )}
          <span className="text-gray-600 dark:text-gray-400">{Array.isArray(value) ? '[' : '{'}</span>
          {!isExpanded && hasContent && <span className="text-gray-400 dark:text-gray-600 text-xs ml-1">{getPreviewText(value)}</span>}
          {!isExpanded && <span className="text-gray-600 dark:text-gray-400 ml-1">{Array.isArray(value) ? ']' : '}'}</span>}
        </div>
        {renderCopyBtn()}
      </div>
      {isExpanded && hasContent && (
        <div>
          {Array.isArray(value)
            ? value.map((item, index) => (
              <JsonNode key={String(index)} value={item} name={String(index)} level={level + 1} path={currentPath} />
            ))
            : getObjectEntries(value).map(([objKey, objValue]) => (
              <JsonNode key={objKey} value={objValue} name={objKey} level={level + 1} path={currentPath} />
            ))}
          <div className="text-gray-600 dark:text-gray-400 flex" style={{ paddingLeft: `${indent}px` }}>
            <div className="w-4" />
            <div>{Array.isArray(value) ? ']' : '}'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonView({ data, name, isRoot = false, level = 0, path = [] }: JsonViewProps) {
  if (isRoot) {
    return (
      <div className="font-mono text-sm p-3">
        <JsonNode value={data} name={name} level={level} path={path} />
      </div>
    );
  }

  return <JsonNode value={data} name={name} level={level} path={path} />;
}
