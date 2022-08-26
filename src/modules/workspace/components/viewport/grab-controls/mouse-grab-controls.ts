import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

import { Position } from '~/modules/workspace/types';

import { useMouse } from '../hooks';
import { MouseButton } from './buttons';
import { GrabControls } from './grab-controls';
import { Keys } from './keys';

export const useMouseGrabControls = (
  grabEndCallback: (finalGrabPosition: Position) => void,
): GrabControls => {
  const { mousePosition } = useMouse();

  const [buttonDown, setButtonDown] = createSignal<boolean>(false);
  const [ctrlDown, setCtrlDown] = createSignal<boolean>(false);

  const [grabStartPosition, setGrabStartPosition] =
    createSignal<Position | null>(null);

  onMount(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  });

  onCleanup(() => {
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  });

  const onMouseDown = (event: MouseEvent) => {
    if (event.button === MouseButton.LEFT) {
      setButtonDown(true);
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    if (event.button === MouseButton.LEFT) {
      setButtonDown(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === Keys.LCTRL) {
      setCtrlDown(true);
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.code === Keys.LCTRL) {
      setCtrlDown(false);
    }
  };

  const isPending = () => ctrlDown() && !buttonDown();

  const isGrabbing = () => ctrlDown() && buttonDown();

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
