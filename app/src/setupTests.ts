import '@testing-library/jest-dom'

// jsdom ships a native requestAnimationFrame whose callback timestamp is not
// comparable to performance.now() (confirmed via diagnostic: the two clocks
// disagree by hundreds of ms). Always install our own setTimeout-based
// polyfill in tests instead of only polyfilling when one is "missing" —
// jsdom's native one exists but is unusable for performance.now()-based
// animation timing code.
window.requestAnimationFrame = (cb: FrameRequestCallback) =>
  window.setTimeout(() => cb(performance.now()), 16)
window.cancelAnimationFrame = (id: number) => window.clearTimeout(id)
