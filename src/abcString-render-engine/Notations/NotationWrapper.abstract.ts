import { INotation } from "./INotation";
import { Stave } from '../Stave/Stave';

abstract class NotationWrapper implements INotation {
    
    abstract ibegin: number;
    abstract iend: number;
    
    constructor(...notations: INotation[]) { }

    abstract addToStave(stave: Stave): string;
    abstract insertToStave(after: INotation, stave: Stave): string;
    
    abstract updateInStave(): string;
    abstract removeInStave(): string;
}
