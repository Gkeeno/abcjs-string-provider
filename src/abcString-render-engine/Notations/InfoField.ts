import { InfoFiledType } from '../Enums/InfoFieldType';
import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';

export class InfoField extends Notation {
  constructor(private fieldType: InfoFiledType, private content: string = '') {
    super();
  }

  public setContent(setter: (string) => string): InfoField;
  public setContent(setter: string): InfoField;
  public setContent(setter: string | ((str: string) => string)): InfoField {
    if (typeof setter === 'string') {
      setter as string;
      this.content = setter;
    } else if (typeof setter === 'function') {
      setter as Function;
      this.content = setter(this.content);
    }

    super.updateInStave();
    return this;
  }

  public getContent() {
    return this.content;
  }
  public toAbcString() {
    return this.fieldType + this.content + NewLine;
  }
}
