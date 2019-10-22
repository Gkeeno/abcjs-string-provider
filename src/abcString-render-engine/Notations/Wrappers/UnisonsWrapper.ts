import { NotationWrapper } from './NotationWrapper.abstract';
import { INotation } from '../INotation';
import { Notation } from '../Notation.abstract';
import { NotationType } from '@/abcString-render-engine/Enums/NotationType';
import { Stave } from '@/abcString-render-engine/Stave/Stave';

export class UnisonsWrapper extends NotationWrapper {
  get begin(): INotation {
    return this._begin;
  }
  get end(): INotation {
    return this._end;
  }

  private _notations: INotation[] = [];
  private _begin: INotation;
  private _end: INotation;

  constructor(middleNote: INotation) {
    super();
    this._begin = new UnisonsBoundary(middleNote);
    this._end = new UnisonsBoundary(middleNote, true);
    this._notations.push(middleNote);
  }

  public writeToStave(stave: Stave) {
    throw new Error('Method not implemented.');
  }
}

export class UnisonsBoundary extends Notation {
  public ntype = NotationType.UnisonsBoundary;
  public wrapper: NotationWrapper;
  public nearNoteOrgQueryHandle;
  public nearNoteOrgInsertHandle;
  /**
   *
   * @param nearNote 相邻的note 因为添加了boundary 选中索引会加上前缀或后缀
   * @param isEnding
   */
  constructor(private nearNote: INotation, public isEnding: boolean = false) {
    super();

    this.nearNoteOrgQueryHandle = nearNote.query;
    const abcstr = this.toAbcString();
    if (isEnding) {
      nearNote.query = param => {
        return (
          nearNote.ibegin === param.ichar_start &&
          nearNote.iend + abcstr.length === param.ichar_end
        );
      };
    } else {
      nearNote.query = param => {
        return (
          nearNote.ibegin - abcstr.length === param.ichar_start &&
          nearNote.iend === param.ichar_end
        );
      };
    }

  }

  public toAbcString() {
    return this.isEnding ? ')' : '(';
  }
  public toJSON() {
    return {
      ntype: this.ntype,
      state: [this.isEnding]
    };
  }

  public removeInStave() {
    super.removeInStave();
    this.nearNote.query = this.nearNoteOrgQueryHandle;
  }
}
