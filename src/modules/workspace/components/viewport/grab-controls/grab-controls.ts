import { Position } from '~/modules/workspace/types';

export interface GrabControls {
  isPending: () => boolean;
  isGrabbing: () => boolean;
  getGrabAmount: () => Position | null;
}
