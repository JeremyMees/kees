'use client'

import { useEffect, useState } from 'react'

interface CountProps {
  end: number
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export default function Count({
  end,
  duration = 1000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: CountProps) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      const startTime = Date.now()
      const startValue = 0

      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = startValue + (end - startValue) * easeOutQuart

        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(end)
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [end, duration, delay])

  const displayValue = count.toFixed(decimals)

  return (
    <span
      className={`inline-block transition-all duration-300 ${className}`}
      style={{
        transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
        color: isAnimating ? 'hsl(var(--primary))' : 'inherit',
      }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
