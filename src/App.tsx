import { Component } from 'solid-js';

import { ItemCard } from './components/ItemCard';
import { Item } from './resolver/elements';

const App: Component = () => {
  return (
    <div style={{ display: 'flex' }}>
      <ItemCard item={Item.COAL} />
      <ItemCard item={Item.BAUXITE} />
      <ItemCard item={Item.URANIUM} />
      <ItemCard item={Item.OIL} />
      <ItemCard item={Item.REINFORCED_IRON_PLATE} />
      <ItemCard item={Item.COMPACTED_COAL} />
    </div>
  );
};

export default App;
