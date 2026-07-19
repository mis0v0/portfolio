export function isPillActive(scrollY: number, viewportHeight: number): boolean {
  return scrollY > viewportHeight * 0.6
}

export function computeScrollProgress(scrollY: number, scrollHeight: number, clientHeight: number): number {
  const max = scrollHeight - clientHeight
  return max > 0 ? (scrollY / max) * 100 : 0
}

export interface SectionRect {
  id: string
  top: number
  bottom: number
}

export function computeActiveSection(sections: SectionRect[], threshold = 120): string {
  let current = ''
  for (const sec of sections) {
    if (sec.top <= threshold && sec.bottom > threshold) current = sec.id
  }
  return current
}

// The straddle check above can never match the last section on the page:
// once scrolled as far as the browser allows, there may not be enough
// remaining scroll room to push that section's top above the threshold
// line, even though it's the section actually filling the viewport. Treat
// "within `epsilon` px of the bottom of the document" as its own signal so
// the nav can force the last link active instead of showing none active.
export function isScrolledToBottom(
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number,
  epsilon = 2
): boolean {
  return scrollY + viewportHeight >= scrollHeight - epsilon
}
