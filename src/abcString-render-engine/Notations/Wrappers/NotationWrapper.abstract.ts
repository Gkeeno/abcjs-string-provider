import { INotation } from '../INotation';
import { Stave } from '../../Stave/Stave';
import { StaveCommand } from '../../types_defined';
import { NotationType } from '@/abcString-render-engine/Enums/NotationType';


/**
 * @useage new 一个包装器, 表示一个需要包裹的符号,实例则产生start 和 end并添加,且默认在start 后插入
 * 在其中的符号后面正常添加,但是插入需要在包装器后插入才能插入到外面
 * 反序列化的时候就根据 start, end还原一个包装器
 */
export abstract class NotationWrapper {
  constructor(/**some attribute */) {}

  public abstract build(): { start: INotation; end: INotation };
}
