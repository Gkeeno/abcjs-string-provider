import { INotation } from "../INotation";
import { Stave } from '../../Stave/Stave';
import { StaveCommand } from "../../types_defined";
import { NotationType } from '@/abcString-render-engine/Enums/NotationType';

abstract class NotationWrapper implements INotation {
    ntype: NotationType;
    query(param: any): boolean {
        throw new Error("Method not implemented.");
    }
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
