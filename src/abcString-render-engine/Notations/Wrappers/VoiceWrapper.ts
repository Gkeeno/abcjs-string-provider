import { NotationWrapper } from './NotationWrapper.abstract';
import { INotation } from '../INotation';
import { Stave } from '@/abcString-render-engine/Stave/Stave';

export class VoiceWrapper extends NotationWrapper {
  public writeToStave(stave: Stave) {
    throw new Error("Method not implemented.");
  }
  get begin(): INotation {
    throw new Error("Method not implemented.");
  }
  get end(): INotation {
    throw new Error("Method not implemented.");
  }
  public build(): { begin: INotation; end: INotation } {
    throw new Error('Method not implemented.');
  }
}
