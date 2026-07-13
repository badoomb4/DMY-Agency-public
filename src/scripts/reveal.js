// Observer unique pour tous les [data-reveal] : pose data-in puis unobserve
// (latch — pas de re-masquage au scroll inverse).
const els = document.querySelectorAll("[data-reveal]");

if (!("IntersectionObserver" in window)) {
  for (const el of els) el.setAttribute("data-in", "");
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -60px 0px", threshold: 0.15 },
  );
  for (const el of els) io.observe(el);
}
