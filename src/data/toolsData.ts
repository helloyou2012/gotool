export interface ToolData {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  popular?: boolean;
  new?: boolean;
}

export interface CategoryData {
  id: string;
  name: string;
  description: string;
}

export const categories: CategoryData[] = [
  {
    id: 'colors',
    name: 'Color Tools',
    description: 'Tools for working with colors, palettes, and color transformations'
  },
  {
    id: 'css',
    name: 'CSS Generators',
    description: 'Generate CSS for common patterns, layouts, and effects'
  },
  {
    id: 'code',
    name: 'Code Tools',
    description: 'Tools for formatting, minifying, and validating code'
  },
  {
    id: 'converters',
    name: 'Converters',
    description: 'Convert between different formats and units'
  },
  {
    id: 'images',
    name: 'Image Tools',
    description: 'Tools for working with images and SVGs'
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    description: 'Tools to check and improve accessibility'
  }
];

export const tools: ToolData[] = [
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick and convert colors between different formats',
    category: 'colors',
    icon: 'Palette',
    popular: true
  },
  {
    id: 'color-contrast',
    title: 'Contrast Checker',
    description: 'Check color contrast for accessibility compliance',
    category: 'colors',
    icon: 'Contrast'
  },
  {
    id: 'gradient-generator',
    title: 'Gradient Generator',
    description: 'Create beautiful CSS gradients with ease',
    category: 'colors',
    icon: 'GalleryHorizontalEnd',
    popular: true
  },
  {
    id: 'color-palette',
    title: 'Color Palette Generator',
    description: 'Generate harmonious color palettes for your projects',
    category: 'colors',
    icon: 'Swatch'
  },
  {
    id: 'box-shadow',
    title: 'Box Shadow Generator',
    description: 'Create and customize CSS box shadows',
    category: 'css',
    icon: 'Square',
    popular: true
  },
  {
    id: 'flexbox',
    title: 'Flexbox Generator',
    description: 'Visual editor for CSS flexbox layouts',
    category: 'css',
    icon: 'LayoutGrid'
  },
  {
    id: 'grid-generator',
    title: 'Grid Generator',
    description: 'Visual CSS grid layout generator',
    category: 'css',
    icon: 'Grid'
  },
  {
    id: 'border-radius',
    title: 'Border Radius Generator',
    description: 'Create custom border radius values',
    category: 'css',
    icon: 'Square'
  },
  {
    id: 'animation',
    title: 'CSS Animation Generator',
    description: 'Create custom CSS animations',
    category: 'css',
    icon: 'Sparkles',
    new: true
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format and validate JSON data',
    category: 'code',
    icon: 'Braces',
    popular: true
  },
  {
    id: 'yaml-json',
    title: 'YAML to JSON Converter',
    description: 'Convert between YAML and JSON formats',
    category: 'code',
    icon: 'FileJson',
    new: true
  },
  {
    id: 'js-beautifier',
    title: 'JavaScript Beautifier',
    description: 'Format and beautify JavaScript code',
    category: 'code',
    icon: 'Code'
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter',
    description: 'Format and beautify HTML code',
    category: 'code',
    icon: 'FileCode'
  },
  {
    id: 'css-formatter',
    title: 'CSS Formatter',
    description: 'Format and beautify CSS code',
    category: 'code',
    icon: 'FileCode'
  },
  {
    id: 'minifier',
    title: 'Code Minifier',
    description: 'Minify JavaScript, CSS, and HTML',
    category: 'code',
    icon: 'Minimize',
    new: true
  },
  {
    id: 'px-to-rem',
    title: 'PX to REM Converter',
    description: 'Convert between PX and REM units',
    category: 'converters',
    icon: 'Ruler'
  },
  {
    id: 'color-converter',
    title: 'Color Format Converter',
    description: 'Convert between HEX, RGB, HSL, and more',
    category: 'converters',
    icon: 'Pipette'
  },
  {
    id: 'svg-to-jsx',
    title: 'SVG to JSX Converter',
    description: 'Convert SVG to React JSX components',
    category: 'converters',
    icon: 'Components',
    popular: true
  },
  {
    id: 'markdown-to-html',
    title: 'Markdown to HTML',
    description: 'Convert Markdown to HTML',
    category: 'converters',
    icon: 'FileText'
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress and optimize images',
    category: 'images',
    icon: 'Image'
  },
  {
    id: 'svg-editor',
    title: 'SVG Editor',
    description: 'Edit and optimize SVG files',
    category: 'images',
    icon: 'Vector'
  },
  {
    id: 'placeholder',
    title: 'Image Placeholder Generator',
    description: 'Generate placeholder images for your designs',
    category: 'images',
    icon: 'ImagePlus'
  },
  {
    id: 'color-blind',
    title: 'Color Blindness Simulator',
    description: 'Test designs for color blindness accessibility',
    category: 'accessibility',
    icon: 'Eye'
  },
  {
    id: 'contrast-checker',
    title: 'WCAG Contrast Checker',
    description: 'Check text contrast against WCAG guidelines',
    category: 'accessibility',
    icon: 'Accessibility'
  }
];

// Helper function to get tools by category
export const getToolsByCategory = (categoryId: string): ToolData[] => {
  return tools.filter(tool => tool.category === categoryId);
};

// Helper function to get popular tools
export const getPopularTools = (): ToolData[] => {
  return tools.filter(tool => tool.popular);
};

// Helper function to get new tools
export const getNewTools = (): ToolData[] => {
  return tools.filter(tool => tool.new);
};

// Helper function to get a tool by ID
export const getToolById = (id: string): ToolData | undefined => {
  return tools.find(tool => tool.id === id);
};

// Helper function to search tools
export const searchTools = (query: string): ToolData[] => {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(tool => 
    tool.title.toLowerCase().includes(lowercaseQuery) || 
    tool.description.toLowerCase().includes(lowercaseQuery)
  );
};
