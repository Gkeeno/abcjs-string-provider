import { NoteKey } from "./Enums/NoteKey"
import { NoteDuration } from './Enums/NoteDuration';
import { NoteAccidental } from './Enums/NoteAccidental';


export const SequenceNoteKey: NoteKey[] = [
	NoteKey.C1,
	NoteKey.D1,
	NoteKey.E1,
	NoteKey.F1,
	NoteKey.G1,
	NoteKey.A1,
	NoteKey.B1,
	NoteKey.C2, // abcElem.pitches[0].pitch == 0
	NoteKey.D2,
	NoteKey.E2,
	NoteKey.F2,
	NoteKey.G2,
	NoteKey.A2,
	NoteKey.B2,
	NoteKey.C3,
	NoteKey.D3,
	NoteKey.E3,
	NoteKey.F3,
	NoteKey.G3,
	NoteKey.A3,
	NoteKey.B3,
	NoteKey.C4,
	NoteKey.D4,
	NoteKey.E4,
	NoteKey.F4,
	NoteKey.G4,
	NoteKey.A4,
	NoteKey.B4
];


export const NoteDurationNameMap = {
	0.0625: NoteDuration.Sixteenth, // 1/16
	0.125: NoteDuration.Eighth,
	0.1875: NoteDuration.Eighth_dot1,
	0.25: NoteDuration.Quarter,
	0.375: NoteDuration.Quarter_dot1,
	0.5: NoteDuration.Half,
	1: NoteDuration.Whole,
}

export const NoteAccidentalNameMap = {
	sharp: NoteAccidental.Sharp,
	dblsharp: NoteAccidental.DoubleSharp,
	natural: NoteAccidental.Natural,
	flat:NoteAccidental.Flat,
	dblflat:NoteAccidental.DoubleFlat,
}