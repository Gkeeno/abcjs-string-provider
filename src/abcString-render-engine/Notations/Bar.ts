import { INotation } from './INotation';
import { StaveCommand } from '../types_defined';
import { NewLine } from '../utils';


export class BarLine implements INotation {
  addToStave(command:StaveCommand) {
    throw new Error("Method not implemented.");
  }
  insertToStave(before: INotation, command: StaveCommand) {
    throw new Error("Method not implemented.");
  }
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


  public updateInStave(): string {
    throw new Error('Method not implemented.');
  }
  public removeInStave(): string {
    throw new Error('Method not implemented.');
  }
}
