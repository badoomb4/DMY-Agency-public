export function createVisibilityObserver(
  element: HTMLElement,
  onVisible: () => void,
  onHidden: () => void,
): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) onVisible();
      else onHidden();
    },
    { threshold: 0.3 },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
