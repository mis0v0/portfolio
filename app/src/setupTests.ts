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

// jsdom has no IntersectionObserver at all (not even a broken native one).
// motion's `whileInView` needs the constructor to exist or it throws on
// mount. A no-op stub is enough: we're not testing "did it scroll into
// view" behavior (jsdom has no real layout), only that these components
// render without crashing.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver
