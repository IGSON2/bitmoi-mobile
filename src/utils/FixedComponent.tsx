export function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
  if (e.touches.length === 2) {
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.style.transform = "scale(1)";
    const fixedComponents = targetElement.querySelectorAll(".fixed-component");
    fixedComponents.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.transform = "scale(1)";
      }
    });
  }
}
