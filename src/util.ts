import { INotation, NotationType } from "./abcString-render-engine";

export namespace StaveUtil{
    export function isNoteType(notation:INotation){
        return [NotationType.Note, NotationType.ChordNote].includes(notation.ntype);
    }
}