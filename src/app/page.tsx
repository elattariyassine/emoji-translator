'use client';

import { useState, useEffect } from 'react';
import { getEmojiTranslation, getEmojiSuggestions } from '@/lib/emojiDictionary';
import { getUrlParams, generateShareUrl } from '@/lib/utils';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

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
    const translated = getEmojiTranslation(inputText);
    setTranslation(translated);

    // Update suggestions
    const newSuggestions = getEmojiSuggestions(inputText);
    setSuggestions(newSuggestions);
  }, [inputText]);

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
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emoji Translator
          </h1>
          <p className="text-xl text-gray-600">
            Transform your text into emojis! Try typing something like "I love pizza" or "happy cat"
          </p>
        </div>

        {/* Translation Interface */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your text
              </label>
              <textarea
                id="input"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type something like 'I love pizza'..."
              />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200 hover:bg-purple-50"
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

            {/* Translation Result */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Translation
              </label>
              <div className="relative">
                <div className="w-full px-4 py-2 bg-gray-50 rounded-md text-2xl min-h-[60px] flex items-center">
                  {translation || 'Your emoji translation will appear here...'}
                </div>
                {translation && (
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-2 px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
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
                className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                Share Translation
              </button>
            )}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it Works</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              1. Type any text in the input box above
            </p>
            <p className="text-gray-600">
              2. Watch as your text is automatically translated into emojis
            </p>
            <p className="text-gray-600">
              3. Get real-time suggestions as you type
            </p>
            <p className="text-gray-600">
              4. Copy your translation or share it with friends
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
