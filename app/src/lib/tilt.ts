export function tiltRotation(
  pointerX: number,
  pointerY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  maxDeg = 6
): { rotateX: number; rotateY: number } {
  const px = (pointerX - rect.left) / rect.width - 0.5
  const py = (pointerY - rect.top) / rect.height - 0.5
  // Add 0 to normalize a possible -0 result (e.g. negating an exact-center
  // py of 0) to +0, since vitest's toEqual distinguishes -0 from 0 and a
  // CSS rotation of -0deg vs 0deg is meaningless anyway.
  return { rotateX: -py * maxDeg * 2 + 0, rotateY: px * maxDeg * 2 + 0 }
}
