import { createSignal, onCleanup, onMount } from 'solid-js';

import { Position } from '~/modules/workspace/types';

export const useMouse = () => {
  const [mousePosition, setMousePosition] = createSignal<Position>({
    x: 0,
    y: 0,
  });

  onMount(() => {
    window.addEventListener('mousemove', trackMouse);
  });

  onCleanup(() => {
    window.removeEventListener('mousemove', trackMouse);
  });

  const trackMouse = (event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return { mousePosition };
};
