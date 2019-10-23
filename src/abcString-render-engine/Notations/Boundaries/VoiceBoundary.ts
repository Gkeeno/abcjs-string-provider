import { INotation } from '../INotation';
import { Stave } from '@/abcString-render-engine/Stave/Stave';
import { IBoundary } from './IBoundary';

export class VoiceBoundary implements IBoundary {
  siblingBoundary: IBoundary;
  bindNote: INotation;
  link(sibling: IBoundary) {
    throw new Error("Method not implemented.");
  }
}
