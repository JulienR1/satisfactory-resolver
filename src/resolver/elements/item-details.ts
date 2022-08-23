import { ItemData } from '../interfaces';
import { Item } from './items';

const details: { [key in Item]: ItemData } = {
  [Item.BAUXITE]: {
    title: 'Bauxite',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/1/11/Bauxite.png',
  },
  [Item.CATERIUM_ORE]: {
    title: 'Caterium ore',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/e/e3/Caterium_Ore.png',
  },
  [Item.COAL]: {
    title: 'Coal',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/a/a7/Coal.png',
  },
  [Item.COMPACTED_COAL]: {
    title: 'Compacted coal',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/52/Compacted_Coal.png',
  },
  [Item.COPPER_ORE]: {
    title: 'Copper ore',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/7/78/Copper_Ore.png',
  },
  [Item.IRON_INGOT]: {
    title: 'Iron ingot',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/0/0a/Iron_Ingot.png',
  },
  [Item.IRON_ORE]: {
    title: 'Iron ore',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/8/87/Iron_Ore.png',
  },
  [Item.IRON_PLATE]: {
    title: 'Iron plate',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/51/Iron_Plate.png',
  },
  [Item.LIMESTONE]: {
    title: 'Limestone',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/4/4e/Limestone.png',
  },
  [Item.OIL]: {
    title: 'Crude oil',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/6/60/Crude_Oil.png',
  },
  [Item.PETROLEUM_COKE]: {
    title: 'Petroleum coke',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/5c/Petroleum_Coke.png',
  },
  [Item.PLASTIC]: {
    title: 'Plastic',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/0/0b/Plastic.png',
  },
  [Item.RAW_QUARTZ]: {
    title: 'Raw quartz',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/7/76/Raw_Quartz.png',
  },
  [Item.REINFORCED_IRON_PLATE]: {
    title: 'Reinforced iron plate',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/2/29/Reinforced_Iron_Plate.png',
  },
  [Item.ROD]: {
    title: 'Rod',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/5f/Iron_Rod.png',
  },
  [Item.RUBBER]: {
    title: 'Rubber',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/8/8e/Rubber.png',
  },
  [Item.SCREW]: {
    title: 'Screw',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/59/Screw.png',
  },
  [Item.STEEL_BEAM]: {
    title: 'Steel beam',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/6/6f/Steel_Beam.png',
  },
  [Item.STEEL_INGOT]: {
    title: 'Steel ingot',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/b/bd/Steel_Ingot.png',
  },
  [Item.SULFUR_ORE]: {
    title: 'Sulfur',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/1/1d/Sulfur.png',
  },
  [Item.URANIUM]: {
    title: 'Uranium',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/3/31/Uranium.png',
  },
  [Item.WATER]: {
    title: 'Water',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/9/9d/Water.png',
  },
  [Item.WIRE]: {
    title: 'Wire',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/7/77/Wire.png',
  },
};

export default details;
