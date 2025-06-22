import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image, 
  Eye, 
  EyeOff,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertAtNewLine = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    // Check if we need to add a new line before
    const needsNewLineBefore = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
    const needsNewLineAfter = afterCursor.length > 0 && !afterCursor.startsWith('\n');
    
    const prefix = needsNewLineBefore ? '\n' : '';
    const suffix = needsNewLineAfter ? '\n' : '';
    
    const newText = beforeCursor + prefix + text + suffix + afterCursor;
    onChange(newText);

    setTimeout(() => {
      const newCursorPos = start + prefix.length + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        insertText('**', '**', 'bold text');
        break;
      case 'italic':
        insertText('*', '*', 'italic text');
        break;
      case 'underline':
        insertText('<u>', '</u>', 'underlined text');
        break;
      case 'code':
        insertText('`', '`', 'code');
        break;
      case 'h1':
        insertAtNewLine('# Heading 1');
        break;
      case 'h2':
        insertAtNewLine('## Heading 2');
        break;
      case 'h3':
        insertAtNewLine('### Heading 3');
        break;
      case 'ul':
        insertAtNewLine('- List item');
        break;
      case 'ol':
        insertAtNewLine('1. List item');
        break;
      case 'quote':
        insertAtNewLine('> Quote text');
        break;
      case 'link':
        insertText('[', '](url)', 'link text');
        break;
      case 'image':
        insertText('![', '](image-url)', 'alt text');
        break;
      case 'hr':
        insertAtNewLine('---');
        break;
    }
  };

  const renderPreview = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold text-dark mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-dark mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-dark mt-8 mb-6">{line.replace('# ', '')}</h1>;
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-700 leading-relaxed ml-4 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={index} className="text-gray-700 leading-relaxed ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      
      // Quotes
      if (line.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-gray-600 my-4">{line.replace('> ', '')}</blockquote>;
      }
      
      // Horizontal rule
      if (line === '---') {
        return <hr key={index} className="my-6 border-gray-300" />;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Regular paragraphs with inline formatting
      let formattedLine = line;
      
      // Bold
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Underline
      formattedLine = formattedLine.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
      
      // Code
      formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
      
      // Links
      formattedLine = formattedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
      
      // Images
      formattedLine = formattedLine.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
      
      return (
        <p 
          key={index} 
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => formatText('italic'), title: 'Italic (Ctrl+I)' },
    { icon: Underline, action: () => formatText('underline'), title: 'Underline' },
    { icon: Code, action: () => formatText('code'), title: 'Inline Code' },
    { type: 'separator' },
    { icon: Type, action: () => formatText('h1'), title: 'Heading 1', text: 'H1' },
    { icon: Type, action: () => formatText('h2'), title: 'Heading 2', text: 'H2' },
    { icon: Type, action: () => formatText('h3'), title: 'Heading 3', text: 'H3' },
    { type: 'separator' },
    { icon: List, action: () => formatText('ul'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => formatText('ol'), title: 'Numbered List' },
    { icon: Quote, action: () => formatText('quote'), title: 'Quote' },
    { type: 'separator' },
    { icon: Link, action: () => formatText('link'), title: 'Insert Link' },
    { icon: Image, action: () => formatText('image'), title: 'Insert Image' },
    { type: 'separator' },
    { icon: isPreview ? EyeOff : Eye, action: () => setIsPreview(!isPreview), title: isPreview ? 'Edit Mode' : 'Preview Mode' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
      }
    }
  };

  return (
    <div className={`border border-gray-300 rounded-xl overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'separator') {
              return <div key={index} className="w-px h-6 bg-gray-300 mx-2" />;
            }
            
            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center min-w-[36px] h-9"
                title={button.title}
              >
                {button.text ? (
                  <span className="text-sm font-medium text-gray-700">{button.text}</span>
                ) : (
                  <Icon size={16} className="text-gray-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div className="p-6 min-h-[400px] bg-white prose prose-lg max-w-none">
            {value ? renderPreview(value) : (
              <p className="text-gray-500 italic">Nothing to preview yet. Switch to edit mode to start writing.</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full p-6 min-h-[400px] resize-none focus:outline-none focus:ring-0 border-0 font-mono text-sm leading-relaxed"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
            />
            
            {/* Format Guide */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-xs text-gray-600 max-w-xs">
              <div className="font-medium mb-2">Quick Format Guide:</div>
              <div className="space-y-1">
                <div>**bold** *italic* `code`</div>
                <div># H1 ## H2 ### H3</div>
                <div>- bullet list</div>
                <div>1. numbered list</div>
                <div>&gt; quote</div>
                <div>[link](url)</div>
                <div>![image](url)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex justify-between items-center text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>{value.length} characters</span>
          <span>{value.split(/\s+/).filter(word => word.length > 0).length} words</span>
          <span>{value.split('\n').length} lines</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded ${isPreview ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
            {isPreview ? 'Preview' : 'Edit'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;