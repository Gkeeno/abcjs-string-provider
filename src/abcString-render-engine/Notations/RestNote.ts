import { Notation } from './Notation.abstract';
import { NotationType } from '../Enums/NotationType';
import { NoteDuration } from '../Enums/NoteDuration';
import { NotationSerializeInfo } from '../common';

export class RestNote extends Notation {
  public ntype = NotationType.RestNote;

  constructor(public duration: NoteDuration = NoteDuration.Quarter) {
    super();
  }

  public static deserialize(seriInfo: NotationSerializeInfo) {
    return new RestNote(...seriInfo.state)
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
