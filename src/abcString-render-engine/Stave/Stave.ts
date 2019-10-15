import { INotation } from '../Notations/INotation';
import { NotationType } from '../Enums/NotationType';
import {
  stringsIndexChangeHandle,
  StaveCommand,
  updateAbcStringHandle
} from '../types_defined';
import { InfoField } from '../Notations/InfoField';
import Vuex from 'vuex';
import { InfoFiledType } from '../Enums/InfoFieldType';

/**
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 * @description 采用vuex实现(todo)
 */
export class Stave {
  public get abcString(): string {
    return this._abcString;
  }
  /**
   * X:reference number
   */
  public id: InfoField = new InfoField(InfoFiledType.reference_number, '1');
  /**
   * T:title
   * @description
   * followed X:
   */
  public title: InfoField = new InfoField(InfoFiledType.title, 'untitled');
  /**
   * M:meter 拍号
   */
  public meter: InfoField = new InfoField(InfoFiledType.metre, '4/4');
  /**
   * L:unit note length
   * @description
   * 目前不涉及复杂制谱的标准都用 1/16
   * 每个音符时长的步进单位 例:  C - C/2 = L; C3 - C2 =L
   */
  public unitNoteLength: InfoField = new InfoField(
    InfoFiledType.note_unit_length,
    '1/16'
  );
  /**
   * K:key
   * @description
   * 调号、finish field. (general)
   */
  public key: InfoField = new InfoField(InfoFiledType.key, 'C');

  private _abcString: string = '';

  private notations: INotation[] = [];

  private stringIndexChangeSubscribers: stringsIndexChangeHandle[] = [];

  constructor() {}

  public getSelectionInfo(): any {
    return NotationType.Note;
  }
  public getNotation(ichar_start: number, ichar_end: number): any {
    return this.notations.find(
      x => x.ibegin === ichar_start && x.iend === ichar_end
    );
  }

  public addNotation(notaion: INotation) {
    notaion.addToStave(this.createUpdateCommand());
    this.notations.push(notaion);
  }
  public insertNotation(before: INotation, notaion: INotation) {
    notaion.insertToStave(before, this.createUpdateCommand());
    this.notations.push(notaion);
  }
  /**
   * 从字符串区间中删除符号
   * @todo
   * a.需要知道符号是否存在 b.需要知道符号是否在相应字符串区间
   */
  public deleteNotation(notation: INotation) {
    const iRemove = this.notations.indexOf(notation);
    if (iRemove == -1) {
      console.warn('不存在将删除的notation');
      return;
    }
    this.notations.splice(iRemove, 1)[0];
    notation.removeInStave();
  }

  public init() {
    if (!this._abcString) {
      const headers = [
        this.id,
        this.title,
        this.meter,
        this.unitNoteLength,
        this.key
      ];

      for (const notation of this.notations.concat(headers)) {
        this.addNotation(notation);
      }
    }
    return this;
  }

  /**
   * 添加string index的变动通知，为了保持note的 索引正确
   * @field `string index` add,del,update 操作都可能会引起索引变化
   * @param subHandle
   */
  private subscribeStringIndexChange(
    subHandle: stringsIndexChangeHandle
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
  private triggleStringIndexChange(iend: number, org_iend: number) {
    // dispatch to subscribers
    for (
      let index = 0;
      index < this.stringIndexChangeSubscribers.length;
      index++
    ) {
      this.stringIndexChangeSubscribers[index](iend, org_iend);
    }
  }

  private createUpdateCommand(): StaveCommand {
    const updateAbcString = (update: updateAbcStringHandle) => {
      const orgStr = this._abcString;
      const { newStaveAbcString, changesInfo } = update(orgStr);
      this._abcString = newStaveAbcString;

      if (changesInfo && changesInfo.iend != changesInfo.org_iend) {
        this.triggleStringIndexChange(changesInfo.iend, changesInfo.org_iend);
      }
    };

    let unsubscribe;
    const subscribeAbcStringIndexChange = (
      subhandle: stringsIndexChangeHandle
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
      subscribeAbcStringIndexChange,
      unsubscribeAbcStringIndexChange
    };
  }
}
