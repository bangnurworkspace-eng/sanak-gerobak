/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let currentAnimationFrame: number | null = null;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function stopCurrentAnimation() {
  if (currentAnimationFrame !== null) {
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = null;
  }
}

/**
 * Smoothly scrolls window to a specific Y coordinate using requestAnimationFrame
 * with a cubic-bezier easing curve for consistent 60/120fps smoothness.
 */
export function smoothScrollTo(targetY: number, duration = 700): void {
  stopCurrentAnimation();

  const startY = window.scrollY || window.pageYOffset;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const clampedTargetY = Math.min(Math.max(0, targetY), maxScroll);
  const distance = clampedTargetY - startY;

  if (Math.abs(distance) < 2) {
    window.scrollTo(0, clampedTargetY);
    return;
  }

  let startTime: number | null = null;

  const cancelOnUserInput = () => {
    stopCurrentAnimation();
    window.removeEventListener('wheel', cancelOnUserInput);
    window.removeEventListener('touchmove', cancelOnUserInput);
  };

  window.addEventListener('wheel', cancelOnUserInput, { passive: true, once: true });
  window.addEventListener('touchmove', cancelOnUserInput, { passive: true, once: true });

  const step = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      currentAnimationFrame = requestAnimationFrame(step);
    } else {
      currentAnimationFrame = null;
      window.removeEventListener('wheel', cancelOnUserInput);
      window.removeEventListener('touchmove', cancelOnUserInput);
    }
  };

  currentAnimationFrame = requestAnimationFrame(step);
}

/**
 * Smoothly scrolls to a target section ID, accounting for the fixed navbar height.
 */
export function smoothScrollToSection(sectionId: string, navbarOffset = 80): void {
  const cleanId = sectionId.replace(/^#/, '');
  if (!cleanId || cleanId === 'beranda') {
    if (window.location.hash !== '#beranda') {
      window.history.pushState(null, '', '#beranda');
    }
    smoothScrollTo(0, 700);
    return;
  }

  const element = document.getElementById(cleanId);
  if (!element) return;

  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  const targetY = Math.max(0, elementTop - navbarOffset);

  if (window.location.hash !== `#${cleanId}`) {
    window.history.pushState(null, '', `#${cleanId}`);
  }

  smoothScrollTo(targetY, 750);
}
