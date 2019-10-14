import { Stave } from '../Stave/Stave';

export interface INotation {
  /**
   * 在 `abcstring` 中的开始位置
   * 如果这个值为0则表示尚未添加到 stave 中
   * 任何一个 `INotation` 都应该有 ibegin和iend
   * 除了谱子标头信息部分其他的都是INotation
   */
  readonly ibegin: number;
  /**
   * 在 abcstring 中的结束位置
   */
  readonly iend: number;

  addToStave(stave: Stave);
  insertToStave(before: INotation, stave: Stave);
  updateInStave();
	removeInStave();
}
