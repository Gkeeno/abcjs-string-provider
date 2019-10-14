import { INotation } from './INotation';
import { Stave } from '../Stave/Stave';
import { NoteDuration } from '..';

export class RestNote implements INotation {
  private _ibegin: number = 0;
  private _iend: number = 0;
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    return this._iend;
  }

  /**
   *
   */
  constructor(public duration: NoteDuration = NoteDuration.Quarter) { }
  
  /**
   * 将"符号"写入"谱子"
   * 订阅"谱子"相关的变化，自己的变化也将通知到"谱子"
   */
  public addToStave(stave: Stave): string {
    throw new Error('Method not implemented.');
  }
  public insertToStave(after: INotation, stave: Stave): string {
    throw new Error('Method not implemented.');
  }
  public updateInStave(): string {
    throw new Error("Method not implemented.");
  }
  public removeInStave(): string {
    throw new Error("Method not implemented.");
  }

  public toAbcString() {
    return 'z' + this.duration;
  }
}
