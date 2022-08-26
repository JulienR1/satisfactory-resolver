import { createEffect, createSignal } from 'solid-js';

import { Position } from '~/modules/workspace/types';

import { useMouseGrabControls, useScrollGrabControls } from '../grab-controls';
import { GrabControls } from '../grab-controls/grab-controls';

export const useGrab = (onGrabComplete: (grabAmount: Position) => void) => {
  const [selectedGrabControls, setSelectedGrabControls] =
    createSignal<GrabControls | null>(null);

  const mouseGrabControls = useMouseGrabControls(grabAmount => {
    if (selectedGrabControls() === mouseGrabControls) {
      onGrabComplete(grabAmount);
    }
  });

  const scrollGrabControls = useScrollGrabControls(grabAmount => {
    if (selectedGrabControls() === scrollGrabControls) {
      onGrabComplete(grabAmount);
    }
  });

  createEffect(() => {
    if (mouseGrabControls.isGrabbing()) {
      setSelectedGrabControls(mouseGrabControls);
    } else if (scrollGrabControls.isGrabbing()) {
      setSelectedGrabControls(scrollGrabControls);
    } else {
      setSelectedGrabControls(null);
    }
  });

  return { grabControls: selectedGrabControls };
};
