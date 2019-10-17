import { INotation } from './INotation';
import { Stave } from '../Stave/Stave';
import { NoteDuration } from '..';
import { StaveCommand } from '../types_defined';
import { Notation } from './Notation.abstract';

export class RestNote extends Notation {
  constructor(public duration: NoteDuration = NoteDuration.Quarter) {
    super();
  }

  public toAbcString() {
    return 'z' + this.duration;
  }
}
