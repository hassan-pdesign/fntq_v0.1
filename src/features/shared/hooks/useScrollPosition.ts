import { useState, useEffect } from 'react'

interface UseScrollPositionOptions {
  key: string
  dependencyArray?: any[]
}

export function useScrollPosition({ key, dependencyArray = [] }: UseScrollPositionOptions) {
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false)

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem(key, window.scrollY.toString())
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [key])
  
  // Restore scroll position
  useEffect(() => {
    if (!hasRestoredScroll) {
      const savedScrollPosition = localStorage.getItem(key)
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition)
        window.scrollTo(0, scrollY)
        setHasRestoredScroll(true)
      }
    }
  }, [key, hasRestoredScroll, ...dependencyArray])

  const clearScrollPosition = () => {
    localStorage.removeItem(key)
    setHasRestoredScroll(false)
  }

  return {
    hasRestoredScroll,
    clearScrollPosition
  }
} 