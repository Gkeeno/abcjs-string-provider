export type stringsIndexChangeHandle = (iend: number, org_iend: number) => void;
export type updateAbcStringHandle = (
  staveAbcString: string
) => {
  newStaveAbcString: string;
  changesInfo?: { iend: number; org_iend: number };
};

export interface StaveCommand {
  updateAbcString: (handle: updateAbcStringHandle) => any;
  /**
   * 订阅变化并返回 取消订阅的函数
   * @returns 取消订阅函数
   */
  subscribeAbcStringIndexChange: (stringsIndexChangeHandle) => () => any;

  unsubscribeAbcStringIndexChange: () => any;
}
