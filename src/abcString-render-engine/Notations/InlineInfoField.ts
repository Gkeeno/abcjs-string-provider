import { InfoField } from './InfoField';
import { NotationType } from '../Enums/NotationType';

export class InlineInfoField extends InfoField {
  ntype = NotationType.IninlineInfoField;

  public toAbcString() {
    return `[${this.fieldType + this.content}]`;
  }
}
