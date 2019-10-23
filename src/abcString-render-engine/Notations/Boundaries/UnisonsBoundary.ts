import { INotation } from '../INotation';
import { Notation } from '../Notation.abstract';
import { NotationType } from '@/abcString-render-engine/Enums/NotationType';
import { IBoundary } from './IBoundary';
import { StaveCommand } from '@/abcString-render-engine/types_defined';

// export class UnisonsWrapper extends NotationWrapper {
//   public begin: INotation;
//   public end: INotation;

//   constructor(beginNote: INotation, endNote: INotation) {
//     super();
//     this.begin = new UnisonsBoundary(beginNote);
//     this.end = new UnisonsBoundary(endNote, true);
//   }

//   public writeToStave(stave: Stave) {
//     throw new Error('Method not implemented.');
//   }
// }

/**
 * 必须俩个音符(Note)以上得才能 组成 unisons，且与关联音符(bindNote)一同插入
 */
export class UnisonsBoundary extends Notation implements IBoundary {
  public ntype = NotationType.UnisonsBoundary;
  public siblingBoundary: IBoundary = null;

  /**
   * @param nearNote 相邻的note 因为添加了boundary 选中索引会加上前缀或后缀
   * @param isEnding
   */
  constructor(public bindNote: INotation, public isEnding: boolean = false) {
    super();
    // this.decorateNote(bindNote);
  }

  /**
   * 每个boundary绑定一个Note, 相应的拓展一些Note的功能:
   * a.联动删除 note及bundary
   */
  // public decorateNote(bindNote: INotation) {
  //   const org_removeInStave = bindNote.removeInStave;
  //   bindNote.removeInStave = () => {
  //     this.siblingBoundary && this.siblingBoundary.bindNote.removeInStave();
  //     this.siblingBoundary &&
  //       ((this.siblingBoundary as any) as UnisonsBoundary).removeInStave();
  //     org_removeInStave();
  //     this.removeInStave();
  //   };
  // }

  public addToStave(commond: StaveCommand) {
    if (this.isEnding) {
      this.bindNote.addToStave(commond);
      super.insertToStave(this.bindNote, commond);
    } else {
      super.addToStave(commond);
      this.bindNote.insertToStave(this, commond);
    }
  }
  public query(param) {
    if (this.isEnding) {
      return (
        this.bindNote.ibegin === param.ichar_start &&
        this.iend === param.ichar_end
      );
    } else {
      return (
        this.ibegin === param.ichar_start &&
        this.bindNote.iend === param.ichar_end
      );
    }
  }

  public insertToStave(before: INotation, commond: StaveCommand) {
    if (this.isEnding) {
      this.bindNote.insertToStave(before, commond);
      super.insertToStave(this.bindNote, commond);
    } else {
      super.insertToStave(before, commond);
      this.bindNote.insertToStave(this, commond);
    }
  }
  public removeInStave() {
    super.removeInStave();
    this.removeInStave = function() {};
    this.bindNote.removeInStave();

    this.siblingBoundary &&
      ((this.siblingBoundary as any) as UnisonsBoundary).removeInStave();
  }

  public link(sibling: IBoundary) {
    if (this.siblingBoundary === sibling) {
      return;
    }

    this.siblingBoundary = sibling;
    sibling.link(this);
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
}
