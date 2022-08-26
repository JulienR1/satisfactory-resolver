import './viewport.scss';

import { Component, createSignal, onCleanup, ParentProps } from 'solid-js';

import { WORKSPACE_HEIGHT, WORKSPACE_WIDTH } from '../../constants';
import { Position } from '../../types';
import { clamp } from '../../utils';
import { useGrab } from './hooks/use-grab';
import { Size } from './types';
import { useZoom } from './hooks/use-zoom';

export const Viewport: Component<ParentProps> = props => {
  const [offset, setOffset] = createSignal<Position>({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = createSignal<Size>({
    width: 0,
    height: 0,
  });

  useZoom();

  const { grabControls } = useGrab((grabAmount: Position) => {
    setOffset(previousOffset => ({
      x: previousOffset.x + grabAmount.x,
      y: previousOffset.y + grabAmount.y,
    }));
  });

  const pendingOffset = () => {
    const grab = grabControls();
    return grab?.isGrabbing() ? grab.getGrabAmount() : null;
  };

  const clampedOffset = () => ({
    x: clamp(
      offset().x + (pendingOffset()?.x ?? 0),
      viewportSize().width - WORKSPACE_WIDTH,
      0,
    ),
    y: clamp(
      offset().y + (pendingOffset()?.y ?? 0),
      viewportSize().height - WORKSPACE_HEIGHT,
      0,
    ),
  });

  const resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0];
    const width = entry.borderBoxSize[0].inlineSize;
    const height = entry.borderBoxSize[0].blockSize;
    setViewportSize({ width, height });
  });

  onCleanup(() => {
    resizeObserver.disconnect();
  });

  return (
    <div
      class="viewport"
      classList={{
        'viewport--grabbable': grabControls()?.isPending() ?? false,
        'viewport--grabbed': grabControls()?.isGrabbing() ?? false,
      }}
      ref={element => resizeObserver.observe(element)}>
      <div
        class="viewport__content"
        style={`--offset-x:${clampedOffset().x}px; --offset-y:${
          clampedOffset().y
        }px;`}>
        {props.children}
      </div>
    </div>
  );
};
