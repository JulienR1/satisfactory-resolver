import { Component, For } from 'solid-js';

import { ItemCard } from './components';
import { Workspace } from './modules/workspace';
import { ItemKeys } from './resolver/elements';

const App: Component = () => {
  return (
    <Workspace>
      <For each={ItemKeys}>{item => <ItemCard item={item} />}</For>
    </Workspace>
  );
};

export default App;
