import { NoteKey } from '../Enums/NoteKey';
import { NoteDuration, NotationType } from '..';
import { SequenceNoteKey } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';
import { Notation } from './Notation.abstract';

/**
 * 编辑方式：以根音为基础，和单音一样的调整音高方式；
 * a.默认新增是大三和弦，可以改变和弦的属性去调整和弦内音符的相对属性
 * b.节奏和音符装饰(Decorations)可以标志在[xxx]周围,但是具体到音符的符号必须要在
 * 音符周围去实现; 可以提供基本调整和详细调整
 */
export class ChordsNote extends Notation {
  public ntype = NotationType.ChordsNote;

  private lastString: string = '';

  constructor(
    protected key: NoteKey = NoteKey.C1,
    protected duration: NoteDuration = NoteDuration.Quarter,
    protected accidental: NoteAccidental = NoteAccidental.None,
    public lyrics = ''
  ) {
    super();
  }
  
  public toAbcString() {
    return this.accidental + this.key + this.duration + this.lastString;
  }
  
  public toJSON() {
    return {
      ntype:this.ntype,
      state:[this.key,this.duration,this.accidental,this.lyrics]
    };
  }

  public pitchUp() {
    let iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === SequenceNoteKey.length - 1) {
      return;
    }

    const tempkey = SequenceNoteKey[++iorg];
    if (!tempkey) {
      return;
    }
    this.key = tempkey;

    this.updateInStave();
  }

  public pitchDown() {
    let iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === 0) {
      return false;
    }

    const tempkey = SequenceNoteKey[--iorg];
    if (!tempkey) {
      return false;
    }
    this.key = tempkey;

    this.updateInStave();
  }

  public setEndSpacing() {
    this.lastString = ' ';
    this.updateInStave();
  }
  /**
   * 添加符号：升降，重升/降，自然
   */
  public setAccidential(accidentalType: NoteAccidental) {
    this.accidental = accidentalType;
    this.updateInStave();
  }

}