import { ref } from 'vue'

const toasts = ref<Array<{ id: number, message: string, type: 'success' | 'error' | 'info' }>>([])
let toastId = 0

export function useToast() {
  function show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) toasts.value.splice(index, 1)
    }, duration)
  }
  
  return { toasts, show }
}