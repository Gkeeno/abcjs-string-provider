import { InfoFiledType } from '../Enums/InfoFieldType';
import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';
import { NotationType, InfoField } from '..';

export class InlineInfoField extends InfoField {
  ntype = NotationType.IninlineInfoField;

  public toAbcString() {
    return `[${this.fieldType + this.content}]`;
  }
}
