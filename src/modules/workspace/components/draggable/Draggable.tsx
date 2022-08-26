import './draggable.scss';

import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  ParentProps,
} from 'solid-js';

import { Position } from '../../types';
import { MouseButton } from '../viewport/grab-controls/buttons';
import { WorkspaceItem } from '../workspace-item';

export const Draggable: Component<ParentProps> = props => {
  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const [fixedPosition, setFixedPosition] = createSignal<Position>({
    x: 0,
    y: 0,
  });

  const [startDragPosition, setStartDragPosition] =
    createSignal<Position | null>(null);
  const [dragOffset, setDragOffset] = createSignal<Position | null>(null);

  const onMousePress = (isDown: boolean) => (event: MouseEvent) => {
    if (event.button === MouseButton.LEFT) {
      event.stopPropagation();
      setIsDragging(isDown);

      if (isDown) {
        setStartDragPosition({ x: event.clientX, y: event.clientY });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMousePress(false));
      } else {
        setStartDragPosition(null);
        window.removeEventListener('mousemove', onMouseMove);
      }
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    const mousePosition = { x: event.clientX, y: event.clientY };
    const offset = {
      x: mousePosition.x - (startDragPosition()?.x ?? 0),
      y: mousePosition.y - (startDragPosition()?.y ?? 0),
    };
    setDragOffset(offset);
  };

  onCleanup(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMousePress(false));
  });

  createEffect(() => {
    if (!isDragging()) {
      const offset = dragOffset();
      if (offset !== null) {
        setFixedPosition(previousPosition => ({
          x: previousPosition.x + offset.x,
          y: previousPosition.y + offset.y,
        }));
        setDragOffset(null);
      }
    }
  });

  return (
    <WorkspaceItem position={fixedPosition()}>
      <div
        onDragStart={e => e.preventDefault()}
        onMouseDown={onMousePress(true)}
        onMouseUp={onMousePress(false)}
        class="draggable"
        classList={{ 'draggable--dragging': isDragging() }}
        style={
          isDragging()
            ? `--x-drag:${dragOffset()?.x ?? 0}px; --y-drag:${
                dragOffset()?.y ?? 0
              }px;`
            : ''
        }>
        <div class="draggable__content">{props.children}</div>
        <div class="draggable__handles"></div>
      </div>
    </WorkspaceItem>
  );
};
