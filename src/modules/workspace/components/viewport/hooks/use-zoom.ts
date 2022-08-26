import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { Keys } from '../grab-controls/keys';

export const useZoom = () => {
  const [ctrlDown, setCtrlDown] = createSignal<boolean>(false);

  onMount(() => {
    window.addEventListener('keydown', onLeftControl(true));
    window.addEventListener('keyup', onLeftControl(false));
    window.addEventListener('wheel', onWheel);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', onLeftControl(true));
    window.removeEventListener('keyup', onLeftControl(false));
    window.removeEventListener('wheel', onWheel);
  });

  const onLeftControl = (isDown: boolean) => (event: KeyboardEvent) => {
    if (event.code === Keys.LCTRL) {
      setCtrlDown(isDown);
    }
  };

  const onWheel = (event: WheelEvent) => {};
};
