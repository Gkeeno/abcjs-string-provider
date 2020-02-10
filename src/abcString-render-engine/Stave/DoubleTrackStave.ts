import { InfoField } from '../Notations/InfoField';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { InlineInfoField } from '../Notations/InlineInfoField';
import { StaveBase } from './StaveBase';
import { INotation } from '../Notations/INotation';

/**
 *
 * @description
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 */
export class StaveDoubleTrack extends StaveBase {
  public spacingStaves = new InfoField(
    InfoFiledType.spacing_staves,
    '{(PianoRightHand) (PianoLeftHand)}'
  );
  public rightHandHeader = new InfoField(
    InfoFiledType.voice,
    'PianoRightHand clef=treble'
  );
  public leftHandHeader = new InfoField(
    InfoFiledType.voice,
    'PianoLeftHand clef=bass'
  );
  public rightHand = new InlineInfoField(InfoFiledType.voice, 'PianoRightHand');
  public leftHand = new InlineInfoField(InfoFiledType.voice, 'PianoLeftHand');

  constructor() {
    super();
  }

  protected trySetStaveFieldFrom(notation:INotation) {
    super.trySetStaveFieldFrom(notation);
    if (!(notation instanceof InfoField)) return;

    if (notation.fieldType == InfoFiledType.voice) {
      if (notation instanceof InlineInfoField) {
        notation.getContent() == "PianoRightHand" && (this.rightHand = notation);
        notation.getContent() == "PianoLeftHand" && (this.leftHand = notation);
      } else {
        notation.getContent() == "PianoRightHand" && (this.rightHandHeader = notation);
        notation.getContent() == "PianoLeftHand" && (this.leftHandHeader = notation);
      }
    }
  }

  public init(dataraw: string = '[]') {
    var data = JSON.parse(dataraw);

    if (this.abcString) {
      return;
    }

    if (data.length) {
      for (const nState of data) {
        const notation = this.deserializeNotation(nState)
        this.trySetStaveFieldFrom(notation)
        this.addNotation(notation);
      }
    } else {
      const headers = [
        this.id,
        this.title,
        this.composer,
        this.tempo,
        this.metre,
        this.unitNoteLength,
        this.spacingStaves,
        this.rightHandHeader,
        this.leftHandHeader,
        this.key,
        this.rightHand,
        this.leftHand
      ];
      for (const notation of this.notations.concat(headers)) {
        this.addNotation(notation);
      }
    }
    return this;
  }
  
  public save() {
    return JSON.stringify(this.notations);
  }

  
}
