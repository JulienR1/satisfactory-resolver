import { WORKSPACE_HEIGHT, WORKSPACE_WIDTH } from './constants';
import { Position } from './types';

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const clampPositionToWorkspace = (position: Position): Position => {
  return {
    x: clamp(position.x, 0, WORKSPACE_WIDTH),
    y: clamp(position.y, 0, WORKSPACE_HEIGHT),
  };
};

export const toArray = <T>(element: T | T[]): T[] => {
  return Array.isArray(element) ? element : [element];
};
