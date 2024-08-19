import { ref } from 'vue'

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