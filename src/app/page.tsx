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
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/elattariyassine/emoji-translator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="GitHub Profile"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
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
              Transform your text into emojis! Try typing something like &#34;I love pizza&#34; or &#34;happy cat&#34;
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-primary-500 transition-all duration-200 resize-none bg-white text-gray-800 placeholder-gray-400"
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type something like 'I love pizza'..."
                  />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 ? (
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
                ) : inputText && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">No suggestions found</p>
                      <a
                        href="https://github.com/elattariyassine/emoji-translator/blob/main/src/lib/emojiDictionary.ts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 group"
                      >
                        <span>Add this emoji</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
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
