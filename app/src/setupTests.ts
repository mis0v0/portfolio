import '@testing-library/jest-dom'

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(performance.now()), 16)
  window.cancelAnimationFrame = (id: number) => window.clearTimeout(id)
}
