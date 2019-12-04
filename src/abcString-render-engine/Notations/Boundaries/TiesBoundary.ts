import { INotation } from '../INotation'
import { Notation } from '../Notation.abstract'
import { NotationType } from '../../Enums/NotationType'
import { IBoundary } from './IBoundary'
import { StaveCommand } from '../../types_defined'

/**
 * 必须俩个音符(Note)以上得才能 组成 unisons，且与关联音符(bindNote)一同插入
 * TODO: 实现装饰器(Note被装饰)模式; 或代理模式,增删改等其他功能代理子类；
 * 因为Boundary不直接提供Note方法操作
 */
export class TiesBoundary extends Notation implements IBoundary {
  public ntype = NotationType.UnisonsBoundary

  /**
   * 一组相关联的 "boundary"
   */
  public siblingBoundary: IBoundary

  /**
   * 实例成对的Unisons
   */
  public static create(beginNote: INotation) {
    const setEnding = function (endNote: INotation) {
      if (beginNote.iend >= endNote.iend) {
        console.warn(beginNote.iend, endNote.iend)
        throw '结束note位置不能大于等于开始note'
      }
      
      const begin = new TiesBoundary(beginNote, false)
      const end = new TiesBoundary(endNote, true)
      end.link(begin)
      return { addNotation: end }
    }
    return { setEnding }
  }

  /**
   * @param n_inner 将依附的`notation`: 最多只能依附一个begin和一个end,如果多重依附将会抛异常
   * @param isEnding 是否为结束边界
   */
  private constructor(public n_inner: INotation, public isEnding: boolean) {
    super()
    checkNoteBindingTies(this.n_inner, isEnding)
  }

  public toJSON() {
    return {
      ntype: this.ntype,
      state: [this.isEnding],
    }
  }

  public toAbcString() {
    return this.isEnding ? ')' : '('
  }

  public getInner(): INotation {
    return this.n_inner
  }
  /**
   * 具有boundary 的 note; 选中索引会加上前缀或后缀
   */
  public query(param) {
    // if (this.isEnding) {
    //   return this.n_inner.ibegin === param.ichar_start && this.iend === param.ichar_end
    // } else {
    //   return this.ibegin === param.ichar_start && this.n_inner.iend === param.ichar_end
    // }
    if (this.isEnding) {
      return this.iend === param.ichar_end
    } else {
      return this.ibegin === param.ichar_start
    }
  }

  public addToStave(command: StaveCommand) {
    // 为保证成对，应由ending来添加。insert同理
    if (this.isEnding) {
      this.siblingBoundary.insertToStaveBefore(this.siblingBoundary.n_inner, command)
      // this.siblingBoundary.n_inner.insertToStave(this.siblingBoundary, command)
      // this.n_inner.insertToStave(this.siblingBoundary.n_inner, command)
      super.insertToStave(this.n_inner, command)
    }
  }

  public insertToStave(before: INotation, command: StaveCommand) {
    throw 'no implement.'
  }
  public updateInStave() {
    throw 'no implement.'
  }

  public removeInStave() {
    uncheckNoteBindingTies(this.n_inner)

    super.removeInStave()
    this.removeInStave = function() {}
    // this.n_inner.removeInStave() // 不采用内联移除的方式可以 减少一些移除的bug
  }

  /**
   * Boundary互调用 ; 实现关联逻辑
   * @param sibling 被动关联的Boundary
   */
  public link(sibling: IBoundary) {
    if (this.siblingBoundary === sibling) {
      return
    }

    // combine Begin - End Method
    if (this.isEnding) {
      // 按照一定顺序删除,先begin 后 end（以修复一些bug）
      let rm_handle_end = this.removeInStave.bind(this)
      let rm_hendle_begin = sibling.removeInStave.bind(sibling)
      let removeInStave_linked = function() {
        rm_handle_end()
        rm_hendle_begin()
      }
      this.removeInStave = removeInStave_linked
      sibling.removeInStave = removeInStave_linked
    }
    this.siblingBoundary = sibling
    sibling.link(this)
  }
}

// hack：记录note被依附Unison的flag
function checkNoteBindingTies(note, isEnding: boolean) {
  if (!note.__UnisonsBoundary_innner_flag) {
    note.__UnisonsBoundary_innner_flag = {} // 实例一个对象防止解构异常
  }
  const { isBindBegin, isBindEnd } = note.__UnisonsBoundary_innner_flag
  if ((isBindBegin && !isEnding) || (isBindEnd && isEnding)) {
    throw '不能在符号上重复添加Unisons'
  }
  note.__UnisonsBoundary_innner_flag[isEnding ? 'isBindEnd' : 'isBindBegin'] = true
}

function uncheckNoteBindingTies(note) {
  note.__UnisonsBoundary_innner_flag && delete note.__UnisonsBoundary_innner_flag
}
