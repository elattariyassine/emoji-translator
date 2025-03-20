export const getUrlParams = () => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return {
    text: params.get('text'),
    emoji: params.get('emoji'),
  };
};

export const generateShareUrl = (text: string, emoji: string) => {
  if (typeof window === 'undefined') return '';
  
  return `${window.location.origin}?text=${encodeURIComponent(text)}&emoji=${encodeURIComponent(emoji)}`;
}; 