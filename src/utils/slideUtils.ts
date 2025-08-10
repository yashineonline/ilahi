import { ref } from 'vue';

export function useSlideControls(slides: any) {
  const slideCount = ref(1);

  const increaseStanzaCount = () => {
    if (slideCount.value < slides.value.length) slideCount.value++;
  };

  const decreaseStanzaCount = () => {
    if (slideCount.value > 1) slideCount.value--;
  };

  return { slideCount, increaseStanzaCount, decreaseStanzaCount };
}