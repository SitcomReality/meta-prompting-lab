export function createEventBus() {
  const listeners = new Map();

  function on(type, handler) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(handler);
    return () => off(type, handler);
  }

  function off(type, handler) {
    const set = listeners.get(type);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) listeners.delete(type);
  }

  function emit(type, payload) {
    const set = listeners.get(type);
    if (!set) return;
    set.forEach((handler) => handler(payload));
  }

  return { on, off, emit };
}