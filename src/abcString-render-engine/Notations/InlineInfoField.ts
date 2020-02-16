import { InfoField } from './InfoField';
import { NotationType } from '../Enums/NotationType';
import { NotationSerializeInfo } from '../common';

export class InlineInfoField extends InfoField {
  ntype = NotationType.IninlineInfoField;

  public static deserialize(seriInfo: NotationSerializeInfo) {
    return new InlineInfoField(...seriInfo.state)
  }
  
  public toAbcString() {
    return `[${this.fieldType + this.content}]`;
  }
}
