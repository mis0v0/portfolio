export function spotlightPosition(
  pointerX: number,
  pointerY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>
): { sx: string; sy: string } {
  const sx = ((pointerX - rect.left) / rect.width) * 100
  const sy = ((pointerY - rect.top) / rect.height) * 100
  return { sx: `${sx}%`, sy: `${sy}%` }
}
