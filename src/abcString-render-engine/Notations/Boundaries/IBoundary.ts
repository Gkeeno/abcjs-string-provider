import { INotation } from '../INotation'
import { NotationType } from '../../Enums/NotationType'

export interface IBoundary extends INotation {
  siblingBoundary: IBoundary
  n_inner: INotation

  link(sibling: IBoundary)
  getInner(): INotation
}
