export function heroParallaxProgress(scrollY: number, heroHeight: number): number {
  if (heroHeight <= 0) return 0
  return Math.min(Math.max(scrollY / heroHeight, 0), 1)
}

export function heroParallaxStyle(progress: number): { opacity: number; scale: number } {
  return { opacity: 1 - progress, scale: 1 - progress * 0.04 }
}

export function magneticOffset(
  pointerX: number,
  pointerY: number,
  centerX: number,
  centerY: number,
  strength = 0.35
): { x: number; y: number } {
  return { x: (pointerX - centerX) * strength, y: (pointerY - centerY) * strength }
}
