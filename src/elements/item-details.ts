import { ItemData } from '../interfaces';
import { Item } from './items';

const details: { [key in Item]: ItemData } = {
  [Item.BAUXITE]: {
    title: 'Bauxite',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/1/11/Bauxite.png/revision/latest?cb=20190626181514',
  },
  [Item.CATERIUM_ORE]: {
    title: 'Caterium ore',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/e/e3/Caterium_Ore.png/revision/latest?cb=20200311143321',
  },
  [Item.COAL]: {
    title: 'Coal',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/a/a7/Coal.png/revision/latest?cb=20200311143443',
  },
  [Item.COMPACTED_COAL]: {
    title: 'Compacted coal',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/52/Compacted_Coal.png/revision/latest?cb=20200211190506',
  },
  [Item.COPPER_ORE]: {
    title: 'Copper ore',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/7/78/Copper_Ore.png/revision/latest?cb=20200602231508',
  },
  [Item.IRON_INGOT]: {
    title: 'Iron ingot',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/0/0a/Iron_Ingot.png/revision/latest?cb=20200320134453',
  },
  [Item.IRON_ORE]: {
    title: 'Iron ore',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/8/87/Iron_Ore.png/revision/latest?cb=20200602231757',
  },
  [Item.IRON_PLATE]: {
    title: 'Iron plate',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/51/Iron_Plate.png/revision/latest?cb=20200320134231',
  },
  [Item.LIMESTONE]: {
    title: 'Limestone',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/4/4e/Limestone.png/revision/latest?cb=20200602231912',
  },
  [Item.OIL]: {
    title: 'Crude oil',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/6/60/Crude_Oil.png/revision/latest?cb=20200311140831',
  },
  [Item.PETROLEUM_COKE]: {
    title: 'Petroleum coke',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/5c/Petroleum_Coke.png/revision/latest?cb=20200217201103',
  },
  [Item.PLASTIC]: {
    title: 'Plastic',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/0/0b/Plastic.png/revision/latest?cb=20190428013736',
  },
  [Item.RAW_QUARTZ]: {
    title: 'Raw quartz',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/7/76/Raw_Quartz.png/revision/latest?cb=20200602232050',
  },
  [Item.REINFORCED_IRON_PLATE]: {
    title: 'Reinforced iron plate',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/2/29/Reinforced_Iron_Plate.png/revision/latest?cb=20200311142656',
  },
  [Item.ROD]: {
    title: 'Rod',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/5f/Iron_Rod.png/revision/latest?cb=20200320134343',
  },
  [Item.RUBBER]: {
    title: 'Rubber',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/8/8e/Rubber.png/revision/latest?cb=20190428013543',
  },
  [Item.SCREW]: {
    title: 'Screw',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/5/59/Screw.png/revision/latest?cb=20200311142745',
  },
  [Item.STEEL_BEAM]: {
    title: 'Steel beam',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/6/6f/Steel_Beam.png/revision/latest?cb=20190318005147',
  },
  [Item.STEEL_INGOT]: {
    title: 'Steel ingot',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/b/bd/Steel_Ingot.png/revision/latest?cb=20190428014007',
  },
  [Item.SULFUR_ORE]: {
    title: 'Sulfur',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/1/1d/Sulfur.png/revision/latest?cb=20190430193341',
  },
  [Item.URANIUM]: {
    title: 'Uranium',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/3/31/Uranium.png/revision/latest?cb=20200311144056',
  },
  [Item.WATER]: {
    title: 'Water',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/9/9d/Water.png/revision/latest?cb=20200218024456',
  },
  [Item.WIRE]: {
    title: 'Wire',
    img: 'https://static.wikia.nocookie.net/satisfactory_gamepedia_en/images/7/77/Wire.png/revision/latest?cb=20200311155702',
  },
};

export default details;
