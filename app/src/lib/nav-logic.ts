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
