import { INotation } from './Notations/INotation';
import { NotationType } from '.';

export type StringIndexChangeEventArgs = {iend: number, org_iend: number}
export type StringsIndexChangeHandle = (sender:object,e :StringIndexChangeEventArgs) => void;
export type UpdateAbcStringHandle = (
  staveAbcString: string
) => {
  newStaveAbcString: string;
  changesInfo?: { iend: number; org_iend: number,sender:object};
};

export interface StaveCommand {
  updateAbcString: (handle: UpdateAbcStringHandle) => any;
  updateNotations: (handle:(narr:INotation[]) => any) => any;
  /**
   * 订阅变化并返回 取消订阅的函数
   * @returns 取消订阅函数
   */
  subscribeAbcStringIndexChange: (stringsIndexChangeHandle:StringsIndexChangeHandle) => () => any;

  unsubscribeAbcStringIndexChange: () => any;

}

export type NotationSerializeInfo = { ntype: NotationType, state:any[]}
