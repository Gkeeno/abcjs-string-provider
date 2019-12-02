import { NoteKey } from '../Enums/NoteKey'
import { NoteDuration, NotationType } from '..'
import { SequenceNoteKey } from '../constant'
import { NoteAccidental } from '../Enums/NoteAccidental'
import { Notation } from './Notation.abstract'

export class Note extends Notation {
  public ntype = NotationType.Note

  constructor(
    protected key: NoteKey = NoteKey.C1,
    protected duration: NoteDuration = NoteDuration.Quarter,
    protected accidental: NoteAccidental = NoteAccidental.None,
    protected lastString = '',
    public lyrics = '',
  ) {
    super()
    
    const i_sequence = SequenceNoteKey.indexOf(key);
    if (isNaN(i_sequence)) {
      throw 'invalid rootkey.'
    }
  }

  public toAbcString() {
    return this.accidental + this.key + this.duration + this.lastString
  }

  public toJSON() {
    return {
      ntype: this.ntype,
      state: [this.key, this.duration, this.accidental, this.lastString, this.lyrics],
    }
  }

  public pitchUp() {
    const note_pitchUp = tryPitchUpKey(this.key, 1)
    if (this.key === note_pitchUp) {
      return
    }

    this.key = note_pitchUp
    this.updateInStave()
  }

  public pitchDown() {
    const note_pitchDown = tryPitchDownKey(this.key, 1)
    if (this.key === note_pitchDown) {
      return
    }
    
    this.key = note_pitchDown
    this.updateInStave()
  }

  public setEndSpacing() {
    this.lastString = ' '
    this.updateInStave()
  }
  /**
   * 添加符号：升降，重升/降，自然
   */
  public setAccidential(accidentalType: NoteAccidental) {
    this.accidental = accidentalType
    this.updateInStave()
  }
}

function tryPitchUpKey(key: NoteKey, interval: number) {
  const i_sequence = SequenceNoteKey.indexOf(key)
  if (i_sequence === -1) {
    console.warn('key is invalid .')
    return key 
  } else if (i_sequence === SequenceNoteKey.length - 1) {
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
  if (i_sequence === -1) {
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
