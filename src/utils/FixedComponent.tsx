export function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
  if (e.touches.length === 2) {
    e.preventDefault();
    // const targetElement = e.currentTarget as HTMLElement;
    // targetElement.style.transform = "scale(1)";
  }
}
