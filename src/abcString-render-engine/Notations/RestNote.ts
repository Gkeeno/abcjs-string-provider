import { INotation } from './INotation';
import { Stave } from '../Stave/Stave';
import { NoteDuration } from '..';
import { StaveCommand } from '../types_defined';

export class RestNote implements INotation {
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    return this._iend;
  }
  private _ibegin: number = 0;
  private _iend: number = 0;

  /**
   *
   */
  constructor(public duration: NoteDuration = NoteDuration.Quarter) {}
  public addToStave(command: StaveCommand) {
    throw new Error('Method not implemented.');
  }
  public insertToStave(before: INotation, command: StaveCommand) {
    throw new Error('Method not implemented.');
  }

  /**
   * 将"符号"写入"谱子"
   * 订阅"谱子"相关的变化，自己的变化也将通知到"谱子"
   */
  public updateInStave(): string {
    throw new Error('Method not implemented.');
  }
  public removeInStave(): string {
    throw new Error('Method not implemented.');
  }

  public toAbcString() {
    return 'z' + this.duration;
  }
}
