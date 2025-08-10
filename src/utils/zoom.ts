import { computed, ref } from 'vue'

export function useZoom(initialSize = 16, minSize = 12) {
  const fontSize = ref(initialSize)

  const increaseFont = () => {
    fontSize.value += 2
  }

  const decreaseFont = () => {
    fontSize.value = Math.max(minSize, fontSize.value - 2)
  }

  return {
    fontSize,
    increaseFont,
    decreaseFont
  }
}

export function useSlides(stanzas: () => string[][]) {
  const currentSlideIndex = ref(0)
  const slideCount = ref(1)
  const previousSlideCount = ref(1)

  const slides = computed(() => {
    const data = stanzas()
    return Array.isArray(data) ? data.map(s => s.join('<br>')) : []
  })

  const showingFull = computed(() => slideCount.value === slides.value.length)
  const slidesToShow = computed(() => slides.value.slice(currentSlideIndex.value, currentSlideIndex.value + slideCount.value))

  function prev() { currentSlideIndex.value = Math.max(0, currentSlideIndex.value - slideCount.value) }
  function next() { currentSlideIndex.value = Math.min(slides.value.length - slideCount.value, currentSlideIndex.value + slideCount.value) }
  function toggleFull() {
    if (!showingFull.value) {
      previousSlideCount.value = slideCount.value
      slideCount.value = slides.value.length
      currentSlideIndex.value = 0
    } else {
      slideCount.value = previousSlideCount.value || 1
      currentSlideIndex.value = 0
    }
  }

  function reset() {
    currentSlideIndex.value = 0
    slideCount.value = 1
    previousSlideCount.value = 1
  }

  return { currentSlideIndex, slideCount, previousSlideCount, slides, slidesToShow, showingFull, prev, next, toggleFull, reset }
}

export function useSlideFontSize(initialSize = 16) {
  const fontSize = ref(initialSize)
  
  function increase() {
    if (fontSize.value < 132) fontSize.value += 2
  }
  
  function decrease() {
    if (fontSize.value > 12) fontSize.value -= 2
  }
  
  return { fontSize, increase, decrease }
}