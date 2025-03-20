export const emojiDictionary: { [key: string]: string } = {
  // Emotions
  'happy': '😊',
  'sad': '😢',
  'angry': '😠',
  'love': '❤️',
  'laugh': '😂',
  'smile': '😃',
  'cry': '😭',
  'wow': '😮',
  'cool': '😎',
  'heart': '❤️',
  
  // Food
  'pizza': '🍕',
  'burger': '🍔',
  'coffee': '☕',
  'tea': '🍵',
  'cake': '🍰',
  'ice cream': '🍦',
  'sushi': '🍱',
  'pasta': '🍝',
  'salad': '🥗',
  'sandwich': '🥪',
  
  // Animals
  'cat': '🐱',
  'dog': '🐶',
  'bird': '🐦',
  'fish': '🐠',
  'lion': '🦁',
  'tiger': '🐯',
  'elephant': '🐘',
  'monkey': '🐒',
  'bear': '🐻',
  'rabbit': '🐰',
  
  // Weather
  'sun': '☀️',
  'rain': '🌧️',
  'cloud': '☁️',
  'snow': '🌨️',
  'storm': '⛈️',
  'wind': '💨',
  'hot': '🔥',
  'cold': '❄️',
  
  // Common objects
  'house': '🏠',
  'car': '🚗',
  'phone': '📱',
  'computer': '💻',
  'book': '📚',
  'pen': '✏️',
  'clock': '🕐',
  'money': '💰',
  'gift': '🎁',
  'star': '⭐',
  
  // Actions
  'run': '🏃',
  'walk': '🚶',
  'jump': '🦘',
  'dance': '💃',
  'sing': '🎤',
  'eat': '🍽️',
  'sleep': '😴',
  'work': '💼',
  'study': '📖',
  'play': '🎮',
  
  // Nature
  'tree': '🌳',
  'flower': '🌸',
  'mountain': '⛰️',
  'ocean': '🌊',
  'beach': '🏖️',
  'forest': '🌲',
  'desert': '🏜️',
  'river': '🌊',
  
  // Time
  'morning': '🌅',
  'night': '🌙',
  'day': '☀️',
  'weekend': '🎉',
  'holiday': '🎊',
  
  // Common phrases
  'good morning': '🌅',
  'good night': '🌙',
  'thank you': '🙏',
  'please': '🙏',
  'sorry': '😔',
  'welcome': '👋',
  'goodbye': '👋',
  'hello': '👋',
  'yes': '👍',
  'no': '👎',
};

export const getEmojiTranslation = (text: string): string => {
  const words = text.toLowerCase().split(' ');
  let translation = '';
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];
    
    // Check for two-word phrases first
    if (nextWord && emojiDictionary[`${word} ${nextWord}`]) {
      translation += emojiDictionary[`${word} ${nextWord}`];
      i++; // Skip the next word since we've used it
      continue;
    }
    
    // Check for single words
    if (emojiDictionary[word]) {
      translation += emojiDictionary[word];
    } else {
      // If no emoji found, keep the original word
      translation += word + ' ';
    }
  }
  
  return translation.trim();
};

export const getEmojiSuggestions = (text: string): string[] => {
  const words = text.toLowerCase().split(' ');
  const lastWord = words[words.length - 1];
  
  if (!lastWord) return [];
  
  return Object.entries(emojiDictionary)
    .filter(([word]) => word.startsWith(lastWord))
    .map(([word, emoji]) => `${word}: ${emoji}`)
    .slice(0, 5); // Limit to 5 suggestions
}; 