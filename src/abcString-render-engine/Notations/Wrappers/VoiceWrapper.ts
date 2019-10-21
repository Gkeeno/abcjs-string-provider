import { NotationWrapper } from "./NotationWrapper.abstract";

export class VoiceWrapper extends NotationWrapper {

    public build(): { start: any; end: any; } {
        throw new Error("Method not implemented.");
    }
}