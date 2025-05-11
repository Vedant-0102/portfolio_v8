
import React, { useState, useEffect } from 'react';
import { Bold, Italic, Underline, List, Save } from 'lucide-react';

export const Notepad = () => {
  const [text, setText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);
  
  // Load text from localStorage on mount
  useEffect(() => {
    const savedText = localStorage.getItem('win11-notepad-text');
    const savedFormatting = localStorage.getItem('win11-notepad-formatting');
    
    if (savedText) {
      setText(savedText);
    }
    
    if (savedFormatting) {
      try {
        const formatting = JSON.parse(savedFormatting);
        setFormattedText(formatting.formattedText || '');
        setIsBold(formatting.isBold || false);
        setIsItalic(formatting.isItalic || false);
        setIsUnderline(formatting.isUnderline || false);
        setIsList(formatting.isList || false);
      } catch (error) {
        console.error('Error parsing saved formatting:', error);
      }
    }
  }, []);
  
  // Save text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('win11-notepad-text', text);
    
    const formatting = {
      formattedText,
      isBold,
      isItalic,
      isUnderline,
      isList
    };
    
    localStorage.setItem('win11-notepad-formatting', JSON.stringify(formatting));
  }, [text, formattedText, isBold, isItalic, isUnderline, isList]);

  // Format text based on active formatting options
  useEffect(() => {
    let formatted = text;
    
    if (isList) {
      formatted = formatted.split('\n').map((line, i) => 
        line.trim() ? `• ${line}` : line
      ).join('\n');
    }
    
    setFormattedText(formatted);
  }, [text, isBold, isItalic, isUnderline, isList]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const toggleBold = () => {
    setIsBold(!isBold);
  };
  
  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };
  
  const toggleUnderline = () => {
    setIsUnderline(!isUnderline);
  };
  
  const toggleList = () => {
    setIsList(!isList);
  };
  
  const downloadTextFile = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `notepad-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Notepad</h2>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded ${isBold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={toggleBold}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            className={`p-2 rounded ${isItalic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={toggleItalic}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            className={`p-2 rounded ${isUnderline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={toggleUnderline}
            title="Underline"
          >
            <Underline size={18} />
          </button>
          <button
            className={`p-2 rounded ${isList ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={toggleList}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={downloadTextFile}
            title="Save as Text File"
          >
            <Save size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <textarea 
          className={`flex-1 p-3 rounded-lg bg-white/80 border border-gray-200/50 focus:outline-none resize-none
            ${isBold ? 'font-bold' : ''}
            ${isItalic ? 'italic' : ''}
            ${isUnderline ? 'underline' : ''}
          `}
          value={text}
          onChange={handleChange}
          placeholder="Start typing..."
          style={{ 
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none'
          }}
        />
      </div>
    </div>
  );
};
