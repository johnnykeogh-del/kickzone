'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  fallback?: string
}

export default function SafeImage({ src, alt, className, fallback = '⚽' }: Props) {
  const [error, setError] = useState(false)
  if (error) return <span className="flex items-center justify-center w-full h-full text-2xl">{fallback}</span>
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />
}
