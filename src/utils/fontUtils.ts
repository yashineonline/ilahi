import { ref } from 'vue';

export function useFontSize() {
  const fontSize = ref(parseInt(localStorage.getItem('fontSize') || '16'));

  const updateFontSize = (event: Event) => {
    const newSize = parseInt((event.target as HTMLInputElement).value);
    fontSize.value = newSize;
    localStorage.setItem('fontSize', newSize.toString());
  };

  const increaseFontSize = () => {
    if (fontSize.value < 132) {
      fontSize.value += 2;
      localStorage.setItem('fontSize', fontSize.value.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize.value > 12) {
      fontSize.value -= 2;
      localStorage.setItem('fontSize', fontSize.value.toString());
    }
  };

  return { fontSize, updateFontSize, increaseFontSize, decreaseFontSize };
}