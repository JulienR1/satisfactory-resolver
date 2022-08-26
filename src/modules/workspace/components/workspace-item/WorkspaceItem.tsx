import './workspace-item.scss';

import { Component, createEffect, createSignal, ParentProps } from 'solid-js';

import { WORKSPACE_HEIGHT, WORKSPACE_WIDTH } from '../../constants';
import { Position } from '../../types';
import { clampPositionToWorkspace } from '../../utils';

interface IProps extends ParentProps {
  position?: Position;
}

export const WorkspaceItem: Component<IProps> = props => {
  const [position, setPosition] = createSignal<Position>({ x: 0, y: 0 });

  const relativePosition = (): Position => ({
    x: (100 * position().x) / WORKSPACE_WIDTH,
    y: (100 * position().y) / WORKSPACE_HEIGHT,
  });

  createEffect(() => {
    if (props.position) {
      const clampedPosition = clampPositionToWorkspace(props.position);
      setPosition(clampedPosition);
    }
  });

  return (
    <div
      class="workspaceItem"
      style={`--x:${relativePosition().x}%; --y:${relativePosition().y}%;`}>
      {props.children}
    </div>
  );
};
