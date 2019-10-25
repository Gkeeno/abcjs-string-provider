import { INotation } from '../Notations/INotation';
import { NotationType } from '../Enums/NotationType';
import {
  StringsIndexChangeHandle,
  StaveCommand,
  UpdateAbcStringHandle
} from '../types_defined';
import { InfoField } from '../Notations/InfoField';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { Note } from '../Notations/Note';
import { BarLine } from '../Notations/BarLine';
import { RestNote } from '../Notations/RestNote';
import { InlineInfoField } from '../Notations/InlineInfoField';

/**
 *
 * @description
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 */
export class StaveDoubleTrack {
  public static readonly abcversion: string = 'standard:v2.1';

  public get abcString(): string {
    return this._abcString;
  }
  public set abcString(v: string) {
    this._abcString = v;
    this.abcstringChangeHandle(v);
  }
  
  public id = new InfoField(InfoFiledType.reference_number, '1');
  public title = new InfoField(InfoFiledType.title, 'untitled');
  public composer = new InfoField(InfoFiledType.composer, 'anonymous');
  public tempo = new InfoField(InfoFiledType.tempo, '60');
  public metre = new InfoField(InfoFiledType.metre, '4/4');
  public unitNoteLength = new InfoField(InfoFiledType.note_unit_length, '1/16');
  public key = new InfoField(InfoFiledType.key, 'C');

  public spacingStaves = new InfoField(InfoFiledType.spacing_staves,'{(PianoRightHand) (PianoLeftHand)}');
  public rightHandHeader = new InfoField(InfoFiledType.voice,'PianoRightHand clef=treble');
  public leftHandHeader = new InfoField(InfoFiledType.voice,'PianoLeftHand clef=bass');
  public rightHand = new InlineInfoField(InfoFiledType.voice,'PianoRightHand');
  public leftHand = new InlineInfoField(InfoFiledType.voice,'PianoLeftHand');

  private _abcString: string = '';

  private notations: INotation[] = [];

  private stringIndexChangeSubscribers: StringsIndexChangeHandle[] = [];

  constructor() {}

  /**
   * @param handle 不能含有更新字符串的操作，否则会造成循环更新
   */
  public setStaveChangeHandle(handle: (s: string) => void) {
    this.abcstringChangeHandle = handle;
  }
  public getSelectionInfo(): any {
    return NotationType.Note;
  }
  /**
   *
   * @param ichar_start
   * @param ichar_end abcjs中的通常会大1, 表示[,) 结尾开区间
   */
  public getNotation(ichar_start: number, ichar_end: number): any {
    var queryParam = { ichar_start, ichar_end };
    return this.notations.find(x => x.query(queryParam));
  }

  public addNotation(notaion: INotation) {
    notaion.addToStave(this.createOperateCommand());
  }

  public insertNotation(before: INotation, notaion: INotation) {
    notaion.insertToStave(before, this.createOperateCommand());
  }
  /**
   * 从字符串区间中删除符号
   */
  public deleteNotation(notation: INotation) {
    const iRemove = this.notations.indexOf(notation);
    if (iRemove == -1) {
      console.warn('不存在将删除的notation');
      return;
    }
    notation.removeInStave();
  }

  public init(data: any[] = null) {
    if (this.abcString) {
      return;
    }

    if (data) {
      for (const nState of data) {
        this.addNotation(this.deserializeNotation(nState));
      }
    } else {
      const headers = [
        this.id,
        this.title,
        this.composer,
        this.tempo,
        this.metre,
        this.unitNoteLength,
        this.spacingStaves,
        this.rightHandHeader,
        this.leftHandHeader,
        this.key,
        this.rightHand,
        this.leftHand,
      ];
      for (const notation of this.notations.concat(headers)) {
        this.addNotation(notation);
      }
    }
    return this;
  }
  public save() {
    return JSON.stringify(this.notations);
  }

  private deserializeNotation(orgState) {
    let org_n: INotation;
    if (orgState.ntype == NotationType.Note) {
      org_n = new Note(...orgState.state);
    } else if (orgState.ntype == NotationType.InfoField) {
      org_n = new InfoField(...orgState.state);
    } else if (orgState.ntype == NotationType.BarLine) {
      org_n = new BarLine(...orgState.state);
    } else if (orgState.ntype == NotationType.RestNote) {
      org_n = new RestNote(...orgState.state);
    }
    return org_n;
  }
  private abcstringChangeHandle: (newString: string) => void = function() {};

  /**
   * 添加string index的变动通知，为了保持note的 索引正确
   * @field `string index` add,del,update 操作都可能会引起索引变化
   * @param subHandle
   */
  private subscribeStringIndexChange(
    subHandle: StringsIndexChangeHandle
  ): () => void {
    const that = this;
    that.stringIndexChangeSubscribers.push(subHandle);
    return function() {
      const i = that.stringIndexChangeSubscribers.indexOf(subHandle);
      that.stringIndexChangeSubscribers.splice(i, 1);
    };
  }

  /**
   * 分发 stringindexchange 的通知，为了保证低耦合，触发分发应该在该类执行
   * @param iend
   * @param iorg_end
   */
  private triggleStringIndexChange(
    sender: object,
    iend: number,
    org_iend: number
  ) {
    // dispatch to subscribers
    for (
      let index = 0;
      index < this.stringIndexChangeSubscribers.length;
      index++
    ) {
      this.stringIndexChangeSubscribers[index](sender, { iend, org_iend });
    }
  }

  private createOperateCommand(): StaveCommand {
    const updateAbcString = (update_abcsting: UpdateAbcStringHandle) => {
      const orgStr = this.abcString;
      const { newStaveAbcString, changesInfo } = update_abcsting(orgStr);
      this.abcString = newStaveAbcString;

      if (changesInfo && changesInfo.iend != changesInfo.org_iend) {
        // 删除的索引变化为 org_istar-1, 即iend - len
        this.triggleStringIndexChange(
          changesInfo.sender,
          changesInfo.iend,
          changesInfo.org_iend
        );
      }
    };

    const updateNotations = (update_notations: (narr: INotation[]) => any) => {
      this.notations = update_notations(this.notations) || this.notations;
    };

    let unsubscribe;
    const subscribeAbcStringIndexChange = (
      subhandle: StringsIndexChangeHandle
    ) => {
      unsubscribe = this.subscribeStringIndexChange(subhandle);
      return unsubscribe;
    };

    const unsubscribeAbcStringIndexChange = () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

    return {
      updateAbcString,
      updateNotations,
      subscribeAbcStringIndexChange,
      unsubscribeAbcStringIndexChange
    };
  }
}