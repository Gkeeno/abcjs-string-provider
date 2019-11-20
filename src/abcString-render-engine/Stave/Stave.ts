import { INotation } from '../Notations/INotation';
import { NotationType } from '../Enums/NotationType';
import {
  StringsIndexChangeHandle,
  StaveCommand,
  UpdateAbcStringHandle
} from '../types_defined';
import { InfoField } from '../Notations/InfoField';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { Note } from '../Notations/Note';
import { BarLine } from '../Notations/BarLine';
import { RestNote } from '../Notations/RestNote';
import { StaveBase } from './StaveBase';

/**
 * @description
 */
export class Stave extends StaveBase {

  constructor() { super();}

  public init(dataraw: string = '[]') {
    var data = JSON.parse(dataraw);

    if (this.abcString) {
      return;
    }

    if (data.length) {
      for (const nState of data) {
        this.addNotation(this.deserializeNotation(nState));
      }
    } else {
      const headers = [
        this.id,
        this.title,
        this.composer,
        this.tempo,
        this.metre,
        this.unitNoteLength,
        this.key
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

(window as any).Stave = Stave;
