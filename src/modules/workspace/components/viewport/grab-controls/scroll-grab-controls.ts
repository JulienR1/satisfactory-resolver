import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

import { Position } from '~/modules/workspace/types';

import { useMouse } from '../hooks';
import { MouseButton } from './buttons';
import { GrabControls } from './grab-controls';

export const useScrollGrabControls = (
  grabEndCallback: (finalGrabPosition: Position) => void,
): GrabControls => {
  const { mousePosition } = useMouse();

  const [buttonDown, setButtonDown] = createSignal<boolean>(false);

  const [grabStartPosition, setGrabStartPosition] =
    createSignal<Position | null>(null);

  onMount(() => {
    window.addEventListener('mousedown', onMouseButtonDown);
    window.addEventListener('mouseup', onMouseButtonUp);
  });

  onCleanup(() => {
    window.removeEventListener('mousedown', onMouseButtonDown);
    window.removeEventListener('mouseup', onMouseButtonUp);
  });

  const onMouseButtonDown = (event: MouseEvent) => {
    if (event.button === MouseButton.MIDDLE) {
      setButtonDown(true);
    }
  };

  const onMouseButtonUp = (event: MouseEvent) => {
    if (event.button === MouseButton.MIDDLE) {
      setButtonDown(false);
    }
  };

  const isPending = () => false;

  const isGrabbing = () => buttonDown();

  createEffect(() => {
    if (isGrabbing()) {
      if (grabStartPosition() === null) {
        setGrabStartPosition(mousePosition());
      }
    } else {
      grabEndCallback(getGrabAmount());
      setGrabStartPosition(null);
    }
  });

  const getGrabAmount = () => {
    const start = grabStartPosition();
    const end = mousePosition();
    if (start && end) {
      return { x: end.x - start.x, y: end.y - start.y };
    }
    return { x: 0, y: 0 };
  };

  return {
    isPending,
    isGrabbing,
    getGrabAmount,
  };
};
