<template>
  <div class="min-h-screen font-nunito flex flex-col">
    <!-- Custom Snake-Sense Cursor -->
    <div class="snake-cursor pointer-events-none fixed inset-0 z-[9999] opacity-0 hidden lg:block" aria-hidden="true">
        <div v-for="i in 10" :key="i" class="cursor-dot absolute w-2 h-2 bg-brand-green/40 rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2"></div>
        <div class="cursor-main absolute w-6 h-6 border-2 border-brand-green rounded-full shadow-[0_0_20px_#22c55e] flex items-center justify-center mix-blend-difference -translate-x-1/2 -translate-y-1/2">
            <div class="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_10px_#22c55e]"></div>
        </div>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap' }
  ]
})

let cursorCleanup: (() => void) | null | undefined = null
let magneticCleanup: (() => void) | null | undefined = null

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
}

const initSnakeCursor = () => {
  const dots = document.querySelectorAll('.cursor-dot')
  const main = document.querySelector('.cursor-main')
  const snakeCursor = document.querySelector('.snake-cursor')
  
  if (!dots.length || !main || !snakeCursor) return

  gsap.set(snakeCursor, { opacity: 0 })

  const onMouseMove = (e: MouseEvent) => {
    gsap.to(snakeCursor, { opacity: 1, duration: 0.3, overwrite: 'auto' })
    gsap.to(dots, { x: e.clientX, y: e.clientY, stagger: 0.04, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
    gsap.to(main, { x: e.clientX, y: e.clientY, duration: 0, overwrite: 'auto' })
  }

  const onMouseLeave = () => gsap.to(snakeCursor, { opacity: 0, duration: 0.3, overwrite: 'auto' })
  const onMouseEnter = () => gsap.to(snakeCursor, { opacity: 1, duration: 0.3, overwrite: 'auto' })

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  document.addEventListener('mouseenter', onMouseEnter)
  
  return () => {
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
    document.removeEventListener('mouseenter', onMouseEnter)
  }
}

const initMagneticButtons = () => {
  const createMagnetic = (btn: Element) => {
    btn.addEventListener('mouseenter', () => gsap.to('.cursor-main', { scale: 3, duration: 0.3 }))
    btn.addEventListener('mousemove', (e: any) => {
      const rect = btn.getBoundingClientRect()
      gsap.to(btn, { 
        x: (e.clientX - rect.left - rect.width / 2) * 0.3, 
        y: (e.clientY - rect.top - rect.height / 2) * 0.3, 
        duration: 0.5 
      })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to('.cursor-main', { scale: 1, duration: 0.3 })
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out' })
    })
  }

  document.querySelectorAll('.btn-magnetic').forEach(createMagnetic)

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.classList.contains('btn-magnetic')) createMagnetic(node)
          node.querySelectorAll('.btn-magnetic').forEach(createMagnetic)
        }
      })
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
  return () => observer.disconnect()
}

onMounted(() => {
  if (!isTouchDevice()) {
    cursorCleanup = initSnakeCursor()
    magneticCleanup = initMagneticButtons()
  }
})

onUnmounted(() => {
  if (cursorCleanup) cursorCleanup()
  if (magneticCleanup) magneticCleanup()
})
</script>
