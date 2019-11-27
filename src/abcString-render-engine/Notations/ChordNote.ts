import { NoteKey } from '../Enums/NoteKey'
import { NoteDuration, NotationType } from '..'
import { SequenceNoteKey } from '../constant'
import { NoteAccidental } from '../Enums/NoteAccidental'
import { Notation } from './Notation.abstract'
import { ChordType } from '../Enums/ChordType'

/**
 * 编辑方式：以根音为基础，和单音一样的调整音高方式；
 * a.默认新增是大三和弦，可以改变和弦的属性去调整和弦内音符的相对属性
 * b.节奏和音符装饰(Decorations)可以标志在[xxx]周围,但是具体到音符的符号(Accidential)必须要在
 * 音符周围去实现;
 * c.提供基本调整和详细调整
 */
export class ChordNote extends Notation {
  public ntype = NotationType.ChordNote

  constructor(
    protected rootkey: NoteKey = NoteKey.C1,
    protected duration: NoteDuration = NoteDuration.Quarter,
    protected chordType: ChordType = ChordType.Major,
    protected lastString = '',
    public lyrics = '',
  ) {
    super()
  }

  public toAbcString() {
    return this.generateChordString(this.rootkey, this.duration, this.chordType) + this.lastString
  }

  public toJSON() {
    return {
      ntype: this.ntype,
      state: [this.rootkey, this.duration, this.chordType, this.lastString, this.lyrics],
    }
  }

  public pitchUp() {
    let iorg = SequenceNoteKey.indexOf(this.rootkey) + 13 // 根音预留出最大的十三和弦
    if (iorg >= SequenceNoteKey.length - 1) {
      // already top
      return
    }

    const key_pitchUp = SequenceNoteKey[++iorg]
    if (!key_pitchUp) {
      // already top
      return
    }
    this.rootkey = key_pitchUp

    this.updateInStave()
  }

  public pitchDown() {
    let iorg = SequenceNoteKey.indexOf(this.rootkey)
    if (iorg === 0) {
      // already bottom
      return false
    }

    const key_pitchDown = SequenceNoteKey[--iorg]
    if (!key_pitchDown) {
      // already bottom
      return false
    }
    this.rootkey = key_pitchDown

    this.updateInStave()
  }

  public setEndSpacing() {
    this.lastString = ' '
    this.updateInStave()
  }

  private generateChordString(rootkey: NoteKey, duration: NoteDuration, chordType: ChordType) {
    return ''
  }
}
