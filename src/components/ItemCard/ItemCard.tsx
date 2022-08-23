import './ItemCard.scss';

import { Component, mergeProps } from 'solid-js';

import { Item, itemDetails } from '~/resolver/elements';

interface IProps {
  item: Item;
  size?: number;
}

export const ItemCard: Component<IProps> = props => {
  const merged = mergeProps({ size: 100 }, props);
  const { title, img } = itemDetails[merged.item];

  return (
    <figure class="itemCard" style={`--size:${merged.size}px;`}>
      <img src={img} alt={title} class="itemCard__img" />
      <figcaption class="itemCard__caption">{title}</figcaption>
    </figure>
  );
};
