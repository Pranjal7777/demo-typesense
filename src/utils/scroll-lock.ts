export const toggleScrollLock = (lock: boolean) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = lock ? 'hidden' : 'auto';
      document.body.style.touchAction = lock ? 'none' : 'auto';
    }
  };