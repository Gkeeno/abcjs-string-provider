import { INotation } from '../Notations/INotation';
import { NotationType } from '../Enums/NotationType';
import { stringsIndexChangeHandle } from '../types_defined';
import Vuex from 'vuex';

/**
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 * @description 采用vuex实现
 */
export class Stave {
  public get abcString(): string {
    return this._abcString;
  }
  /**
   * X:reference number
   */
  public id: number = 1;
  /**
   * T:title
   * @description
   * followed X:
   */
  public title: string = 'untitled';
  /**
   * M:meter 拍号
   */
  public meter: string = '4/4';
  /**
   * L:unit note length
   * @description
   * 目前不涉及复杂制谱的标准都用 1/16
   * 每个音符时长的步进单位 例:  C - C/2 = L; C3 - C2 =L
   */
  public unitNoteLength: string = '1/16';
  /**
   * K:key
   * @description
   * 调号、finish field. (general)
   */
  public key: string = 'C';

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
    notaion.addToStave(this);
  }
  public insertNotation(before: INotation, notaion: INotation) {
    notaion.insertToStave(before, this);
  }
  /**
   * 从字符串区间中删除符号
   * @todo
   * a.需要知道符号是否存在 b.需要知道符号是否在相应字符串区间
   * 考虑实现一个sourcemap
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

  /**
   * 添加string index的变动通知，为了保持note的 索引正确
   * @field `string index` add,del,update 操作都会引起
   * @param subHandle
   */
  public subscribeStringIndexChange(
    subHandle: stringsIndexChangeHandle
  ): () => void {
    const that = this;
    that.stringIndexChangeSubscribers.push(subHandle);
    return function() {
      const i = that.stringIndexChangeSubscribers.indexOf(subHandle);
      that.stringIndexChangeSubscribers.splice(i, 1);
    };
  }

  public triggleStringIndexChange(iend: number, iorg_end: number) {
    // dispatch to subscribers
    for (
      let index = 0;
      index < this.stringIndexChangeSubscribers.length;
      index++
    ) {
      this.stringIndexChangeSubscribers[index](iend, iorg_end);
    }
  }

  public generateAbcString() {
    let abcString = '';
    this._abcString = abcString;
    return abcString;
  }
}

// const storeOption = {
//   state: {
//     count: 0
//   },
//   mutations: {
//     increment(state) {
//       state.count++;
//     }
//   }
// };
// const store = new Vuex.Store(storeOption);

// export function rundemo() {
//   return store;
// }
