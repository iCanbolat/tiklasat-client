import { useState, useRef, useEffect, type RefObject } from "react";

export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.root, options?.rootMargin, options?.threshold]);

  return [ref, inView];
}
