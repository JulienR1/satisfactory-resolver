import { Machine } from './machines';

const details: { [key in Machine]: string } = {
  [Machine.SMELTER]: 'Smelter',
  [Machine.ASSEMBLER]: 'Assembler',
  [Machine.BLENDER]: 'Blender',
  [Machine.CONSTRUCTOR]: 'Constructor',
  [Machine.FOUNDRY]: 'Foundry',
  [Machine.MANUFACTURER]: 'Manufacturer',
  [Machine.REFINERY]: 'Refinery',
  [Machine.MINER_MK1]: 'Miner MK1',
  [Machine.MINER_MK2]: 'Miner MK2',
  [Machine.MINER_MK3]: 'Miner MK3',
  [Machine.WATER_EXTRACTOR]: 'Water extractor',
  [Machine.NOT_IMPLEMENTED]: 'Not implemented',
};

export default details;
