import { INotation } from '../INotation';

export interface IBoundary {
  siblingBoundary: IBoundary;
  bindNote: INotation;

  link(sibling: IBoundary);
}
