import { NoteDuration, NotationType } from '..';
import { Notation } from './Notation.abstract';

export class RestNote extends Notation {
  public ntype = NotationType.RestNote;

  constructor(public duration: NoteDuration = NoteDuration.Quarter) {
    super();
  }

  public toJSON() {
    return {
      ntype:this.ntype,
      state:[this.duration]
    };
  }

  public toAbcString() {
    return 'z' + this.duration;
  }
}
