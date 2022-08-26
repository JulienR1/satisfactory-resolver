import './workspace.scss';

import { children, Component, For, ParentProps } from 'solid-js';

import { Draggable } from './components';
import { Viewport } from './components/viewport';
import { WORKSPACE_HEIGHT, WORKSPACE_WIDTH } from './constants';
import { toArray } from './utils';

export const Workspace: Component<ParentProps> = props => {
  const memo = children(() => props.children);

  const getChildren = () => {
    const memoizedChildren = memo();
    return toArray(memoizedChildren);
  };

  return (
    <Viewport>
      <div
        class="workspace"
        style={`--width:${WORKSPACE_WIDTH}px; --height:${WORKSPACE_HEIGHT}px;`}>
        <For each={getChildren()}>
          {child => <Draggable>{child}</Draggable>}
        </For>
      </div>
    </Viewport>
  );
};
