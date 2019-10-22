import { INotation } from '../INotation';
import { Stave } from '../../Stave/Stave';
import { StaveCommand } from '../../types_defined';
import { NotationType } from '@/abcString-render-engine/Enums/NotationType';

/**
 * 一个包装器,表示一组需要包裹的符号, 主要用作联动前后有关的一组 start end符号
 * @useage new 一个包装器, 实例则产生start 和 end 并添加,且需要要选中start插入音符
 * 在 start 后插入到wrapper内,end插入到wrapper外
 * `反序列化`的时候就根据 start, end还原一个包装器 (同时实例一个wrapper)
 * 在边界附近的音符 相应匹配索引规则会变
 */
export abstract class NotationWrapper {
  abstract get begin(): INotation;
  abstract get end(): INotation;

  constructor(/**some attribute */) {}

  /**
   * @returns `start`,`end`
   */
  public abstract writeToStave(stave:Stave);
}
