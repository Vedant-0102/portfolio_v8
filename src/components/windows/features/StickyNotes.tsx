import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: string;
}

export const StickyNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#FFEB3B');

  const colors = [
    { name: 'Yellow', value: '#FFEB3B' },
    { name: 'Blue', value: '#90CAF9' },
    { name: 'Green', value: '#A5D6A7' },
    { name: 'Pink', value: '#F8BBD0' },
    { name: 'Purple', value: '#CE93D8' },
    { name: 'Orange', value: '#FFCC80' },
  ];

  // Load notes from localStorage on component mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('win11-sticky-notes');
        console.log("Saved notes from localStorage:", savedNotes); // Log saved notes
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
            console.log("Notes loaded from localStorage:", parsedNotes);
          } else {
            console.error("Saved notes is not an array:", parsedNotes);
            setNotes([]);
          }
        }
      } catch (error) {
        console.error("Error loading saved notes:", error);
        setNotes([]);
      }
    };

    loadNotes();
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      try {
        localStorage.setItem('win11-sticky-notes', JSON.stringify(notes));
        console.log("Notes saved to localStorage:", notes);
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    }
  }, [notes]);

  const handleAddNote = () => {
    if (currentNote.trim() === '') return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: currentNote,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setCurrentNote('');
    toast.success('Note added successfully!');
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    toast.success('Note deleted successfully!');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey && currentNote.trim() !== '') {
      handleAddNote();
    }
  };

  return (
    <div className="p-4 h-full">
      <h2 className="text-2xl font-semibold mb-4">Sticky Notes</h2>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">My Notes</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {notes.map(note => (
              <div
                key={note.id}
                className="rounded-lg p-4 shadow-sm relative"
                style={{ backgroundColor: note.color }}
              >
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
                <p className="text-sm whitespace-pre-wrap break-words">
                  {note.content}
                </p>
                <p className="text-xs mt-4 text-gray-600">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No notes yet. Create your first note!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-4">
          <div className="space-y-4">
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>

            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-40 p-4 rounded-lg border"
              placeholder="Write your note here... (Ctrl+Enter to save)"
              style={{ backgroundColor: selectedColor + '80' }}
            ></textarea>

            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Tip: Press Ctrl+Enter to quickly save a note</p>
              <button
                onClick={handleAddNote}
                className="flex items-center px-4 py-2 bg-win-blue text-white rounded hover:bg-win-blue-dark"
                disabled={currentNote.trim() === ''}
              >
                <Plus size={16} className="mr-1" />
                Add Note
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
