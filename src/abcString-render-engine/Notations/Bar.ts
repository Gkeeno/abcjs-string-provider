import { INotation } from './INotation';
import { Stave } from '../Stave/Stave';

export class BarLine implements INotation {
  private _ibegin: number = 0;
  get ibegin() {
    return this._ibegin;
  }

  private _iend: number = 0;
  get iend() {
    return this._iend;
  }
  /**
   *
   */
  constructor() {}

  public addToStave(stave: Stave): string {
    throw new Error('Method not implemented.');
  }
  public insertToStave(after: INotation, stave: Stave): string {
    throw new Error('Method not implemented.');
  }

  public updateInStave(): string {
    throw new Error('Method not implemented.');
  }
  public removeInStave(): string {
    throw new Error('Method not implemented.');
  }
}
