export function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
  if (e.touches.length === 2) {
    e.currentTarget.style.transform = "scale(1)";
  }
}
