'use client';

import { useState, useEffect } from 'react';
import { getEmojiTranslation, getEmojiSuggestions } from '@/lib/emojiDictionary';
import { getUrlParams, generateShareUrl } from '@/lib/utils';
import EmojiModal from '@/components/EmojiModal';

export default function EmojiTranslator() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<'Mac' | 'Other'>('Other');

  useEffect(() => {
    // Set platform information
    setPlatform(navigator.platform.includes('Mac') ? 'Mac' : 'Other');
  }, []);

  useEffect(() => {
    // Check for shared translation in URL
    const params = getUrlParams();
    if (params?.text) {
      setInputText(params.text);
      if (params.emoji) {
        setTranslation(params.emoji);
      }
    }
  }, []);

  useEffect(() => {
    // Update translation when input changes
    setIsLoading(true);
    const translated = getEmojiTranslation(inputText);
    setTranslation(translated);

    // Update suggestions
    const newSuggestions = getEmojiSuggestions(inputText);
    setSuggestions(newSuggestions);
    
    // Simulate a small delay for better UX
    setTimeout(() => setIsLoading(false), 300);
  }, [inputText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShare = () => {
    const shareUrl = generateShareUrl(inputText, translation);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Emoji Translator</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white cursor-pointer text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <span>View All Emojis</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
                {platform === 'Mac' ? '⌘' : 'Ctrl'} K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-slide-up">
            <h1 className="text-5xl font-bold mb-6 text-gray-800">
              Emoji Translator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your text into emojis! Try typing something like "I love pizza" or "happy cat"
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Translation Interface */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your text
                  </label>
                  <textarea
                    id="input"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none bg-white text-gray-800 placeholder-gray-400"
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type something like 'I love pizza'..."
                  />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fade-in">
                    <p className="text-sm font-medium text-gray-700 mb-3">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="px-4 py-2 bg-white rounded-full text-sm border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 text-gray-700"
                          onClick={() => {
                            const words = inputText.split(' ');
                            words[words.length - 1] = suggestion.split(':')[0];
                            setInputText(words.join(' '));
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Translation Result */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Translation
                  </label>
                  <div className="relative">
                    <div className={`w-full px-6 py-4 bg-gray-50 rounded-xl text-3xl min-h-[120px] flex items-center border border-gray-200 text-gray-800 transition-all duration-300 ${isLoading ? 'opacity-50' : ''}`}>
                      {isLoading ? 'Translating...' : (translation || 'Your emoji translation will appear here...')}
                    </div>
                    {translation && (
                      <button
                        onClick={handleCopy}
                        className="absolute right-3 top-3 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-all duration-200 shadow-sm"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Share Button */}
                {translation && (
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 active:bg-gray-900 transition-all duration-200 shadow-md font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Translation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How it Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:border-primary-300">
                <div className="text-2xl mb-2">1️⃣</div>
                <p className="text-gray-700">Type any text in the input box</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:border-primary-300">
                <div className="text-2xl mb-2">2️⃣</div>
                <p className="text-gray-700">Watch automatic emoji translation</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:border-primary-300">
                <div className="text-2xl mb-2">3️⃣</div>
                <p className="text-gray-700">Get real-time suggestions</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:border-primary-300">
                <div className="text-2xl mb-2">4️⃣</div>
                <p className="text-gray-700">Share with friends</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EmojiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
