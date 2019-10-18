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
  /**
   * 订阅变化并返回 取消订阅的函数
   * @returns 取消订阅函数
   */
  subscribeAbcStringIndexChange: (stringsIndexChangeHandle) => () => any;

  unsubscribeAbcStringIndexChange: () => any;
}

