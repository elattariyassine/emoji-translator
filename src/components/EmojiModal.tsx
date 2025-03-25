'use client';

import { useState, useEffect } from 'react';
import { emojiDictionary } from '@/lib/emojiDictionary';

interface EmojiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmojiModal({ isOpen, onClose }: EmojiModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmojis, setFilteredEmojis] = useState<[string, string][]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const entries = Object.entries(emojiDictionary);
    if (searchTerm) {
      const filtered = entries.filter(([word]) => 
        word.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmojis(filtered);
    } else {
      setFilteredEmojis(entries);
    }
  }, [searchTerm]);

  const handleCopy = async (word: string) => {
    await navigator.clipboard.writeText(word);
    setToastMessage(`Copied "${word}" to clipboard!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Emoji Dictionary</h2>
              <button
                  onClick={onClose}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors flex items-center gap-2"
              >
                <span className="text-sm text-gray-500">ESC</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                  type="text"
                  placeholder="Search emojis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                  autoFocus
              />
              <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-180px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6">
              {filteredEmojis.map(([word, emoji]) => (
                  <button
                      key={word}
                      onClick={() => handleCopy(word)}
                      className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
                  >
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{word}</span>
                  </button>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Click any emoji to copy its word to clipboard
              </p>
              <a
                  href="https://github.com/elattariyassine/emoji-translator/blob/main/src/lib/emojiDictionary.ts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 group"
              >
                <span>Add new emoji</span>
                <svg
                    className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
          <div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up">
            {toastMessage}
          </div>
      )}
    </>
  );
} 
