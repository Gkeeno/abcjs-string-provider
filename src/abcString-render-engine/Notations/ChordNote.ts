import { NoteKey } from '../Enums/NoteKey'
import { SequenceNoteKey, ChordNoteIntervalMap } from '../constant'
import { NoteAccidental } from '../Enums/NoteAccidental'
import { Notation } from './Notation.abstract'
import { ChordType } from '../Enums/ChordType'
import { Note } from './Note'
import { NotationType } from '../Enums/NotationType'
import { NoteDuration } from '../Enums/NoteDuration'

/**
 * a.默认新增是大三和弦，可以改变和弦的属性去调整和弦内音符的相对属性
 * b.节奏和音符装饰(Decorations)可以标志在[xxx]周围,但是具体到音符的符号(Accidential)必须要在
 * 音符周围去实现;
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

    const i_sequence = SequenceNoteKey.indexOf(rootkey)
    if (isNaN(i_sequence)) {
      throw 'invalid rootkey.'
    }
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
    const note_pitchUp = tryPitchUpKey(this.rootkey, 1, ChordNoteIntervalMap[this.chordType])
    if (this.rootkey === note_pitchUp) {
      return
    }

    this.rootkey = note_pitchUp
    this.updateInStave()
  }

  public pitchDown() {
    const note_pitchDown = tryPitchDownKey(this.rootkey, 1)
    if (this.rootkey === note_pitchDown) {
      return
    }

    this.rootkey = note_pitchDown
    this.updateInStave()
  }

  public setEndSpacing() {
    this.lastString = ' '
    this.updateInStave()
  }

  public setDuration(duration: NoteDuration) {
    this.duration = duration
    this.updateInStave()
  }

  public setChordType(type: ChordType) {
    this.chordType = type
    this.updateInStave()
  }

  private generateChordString(rootkey: NoteKey, duration: NoteDuration, chordType: ChordType) {
    // 1. build notes
    const notes: Note[] = []
    notes.push(new Note(rootkey, duration)) // Root note. 只会会以第一个Note的时值为准

    if (chordType == ChordType.Major) {
      const third = new Note(tryPitchUpKey(rootkey, 2)) // Third note
      const fifth = new Note(tryPitchUpKey(rootkey, 4)) // Fifth note
      notes.push(third)
      notes.push(fifth)
    } else if (chordType == ChordType.Minor) {
      const third = new Note(tryPitchUpKey(rootkey, 2)) // Third note
      third.setAccidential(NoteAccidental.Flat)
      const fifth = new Note(tryPitchUpKey(rootkey, 4)) // Fifth note
      notes.push(third)
      notes.push(fifth)
    } else if (chordType == ChordType.Suspended4) {
      const third = new Note(tryPitchUpKey(rootkey, 3)) // Third note
      const fifth = new Note(tryPitchUpKey(rootkey, 4)) // Fifth note
      notes.push(third)
      notes.push(fifth)
    } else if (chordType == ChordType.Double3) {
      const second = new Note(tryPitchUpKey(rootkey, 2)) // Second note
      notes.push(second)
    } else if (chordType == ChordType.Double4) {
      const second = new Note(tryPitchUpKey(rootkey, 3)) // Second note
      notes.push(second)
    } else if (chordType == ChordType.Double5) { 
      const second = new Note(tryPitchUpKey(rootkey, 4)) // Second note
      notes.push(second)
    }

    // 2. to abcstring
    let notesStr = ''
    notes.map((note, i) => {
      notesStr += note.toAbcString()
    })
    return `[${notesStr}]`
  }
}

function tryPitchUpKey(key: NoteKey, interval: number, prelimit: number = 0) {
  const i_sequence = SequenceNoteKey.indexOf(key)
  if (isNaN(i_sequence)) {
    console.warn('key is invalid .')
    return key
  } else if (i_sequence + prelimit === SequenceNoteKey.length - 1) {
    console.warn('key is already at top.')
    return key
  }

  const key_pitchUp = SequenceNoteKey[i_sequence + interval]
  if (!key_pitchUp) {
    console.warn('can not pitch up anymore.', key + ' + ' + interval)
    return key
  }

  return key_pitchUp
}

function tryPitchDownKey(key: NoteKey, interval: number) {
  const i_sequence = SequenceNoteKey.indexOf(key)
  if (isNaN(i_sequence)) {
    console.warn('key is invalid.')
    return key
  } else if (i_sequence === 0) {
    console.warn('key is already at bottom.')
    return key
  }

  const key_pitchDown = SequenceNoteKey[i_sequence - interval]
  if (!key_pitchDown) {
    console.warn('can not pitch down anymore.', key + ' + ' + interval)
    return key
  }

  return key_pitchDown
}
