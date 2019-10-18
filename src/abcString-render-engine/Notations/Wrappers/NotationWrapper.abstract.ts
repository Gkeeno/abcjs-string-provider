import { INotation } from "../INotation";
import { Stave } from '../../Stave/Stave';
import { StaveCommand } from "../../types_defined";

abstract class NotationWrapper implements INotation {
    toAbcString() {
        throw new Error("Method not implemented.");
    }
    addToStave(command: StaveCommand) {
        throw new Error("Method not implemented.");
    }
    insertToStave(before: INotation, command: StaveCommand) {
        throw new Error("Method not implemented.");
    }
    
    abstract ibegin: number;
    abstract iend: number;
    
    constructor(...notations: INotation[]) { }

    abstract updateInStave(): string;
    abstract removeInStave(): string;
}
