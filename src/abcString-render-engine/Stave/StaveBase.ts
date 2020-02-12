import { INotation } from '../Notations/INotation'
import { NotationType } from '../Enums/NotationType'
import { StringsIndexChangeHandle, StaveCommand, UpdateAbcStringHandle } from '../common'
import { InfoField } from '../Notations/InfoField'
import { InfoFiledType } from '../Enums/InfoFieldType'
import { Note } from '../Notations/Note'
import { BarLine } from '../Notations/BarLine'
import { RestNote } from '../Notations/RestNote'
import { ChordNote } from '../Notations/ChordNote'
import { InlineInfoField } from '../Notations/InlineInfoField'
import { SlursBoundary } from '../Notations/Boundaries/SlursBoundary'
/**
 * @description
 * a. 添加的任何 Notation 及变化可能引起 abcstring 变化
 */
export abstract class StaveBase {
  public static readonly abcversion: string = 'standard:v2.1'

  public get abcString(): string {
    return this._abcString
  }
  public set abcString(v: string) {
    this._abcString = v
    this.abcstringChangeHandle(v)
  }

  public id = new InfoField(InfoFiledType.reference_number, '1')
  public title = new InfoField(InfoFiledType.title, 'untitled')
  public composer = new InfoField(InfoFiledType.composer, 'anonymous')
  public tempo = new InfoField(InfoFiledType.tempo, '60')
  public metre = new InfoField(InfoFiledType.metre, '4/4')
  public unitNoteLength = new InfoField(InfoFiledType.note_unit_length, '1/16')
  public key = new InfoField(InfoFiledType.key, 'C')

  protected _abcString: string = ''

  protected notations: INotation[] = []

  protected stringIndexChangeSubscribers: StringsIndexChangeHandle[] = []

  protected abcstringChangeHandle: (newString: string) => void = function() {}

  constructor() {}

  /**
   * @param handle 不能含有更新字符串的操作，否则会造成循环更新
   */
  public setStaveChangeHandle(handle: (s: string) => void) {
    this.abcstringChangeHandle = handle
  }

  /**
   * @param ichar_start
   * @param ichar_end abcjs中的通常会大1, 表示[,) 结尾开区间
   */
  public getNotation(ichar_start: number, ichar_end: number) {
    var queryParam = { ichar_start, ichar_end }
    return this.notations.filter(x => x.query(queryParam)).pop() // 取得最后一个
  }

  public addNotation(notation: INotation) {
    notation.addToStave(this.createOperateCommand())
  }

  public insertNotationAfter(before: INotation, notation: INotation) {
    if (before instanceof SlursBoundary) {
      if (!before.isEnding) {
        before = before.getInner()
      }
    }

    notation.insertToStaveAfter(before, this.createOperateCommand())
  }
  public insertNotationBefore(after: INotation, notation: INotation) {
    if (after instanceof SlursBoundary) {
      if (!after.isEnding) {
        after = after.getInner()
      }
    }

    notation.insertToStaveBefore(after, this.createOperateCommand())
  }

  /**
   * 从字符串区间中删除符号
   */
  public deleteNotation(notation: INotation) {
    const iRemove = this.notations.indexOf(notation)
    if (iRemove == -1) {
      console.warn('不存在将删除的notation')
      return
    }
    notation.removeInStave()
  }

  public generationLyrics() {
    // 删除原有的歌词信息
    this.notations.map((v, i) => {
      if (v instanceof InfoField && v.fieldType == InfoFiledType.words_aftertune) {
        this.deleteNotation(v)
      }
    })

    // 添加进所有的歌词信息
    let lyrics = [] // 每一行的歌词内容集
    for (let i = 0; i < this.notations.length; i++) {
      const n = this.notations[i]
      const n_next = this.notations[i + 1]

      // a.记录下每个音符的lyric 到 lyrics, 空的用占位符号替代
      if (n instanceof Note || n instanceof ChordNote) {
        lyrics.push(n.lyrics || '*')
      }

      // b. 到换行处/终点 的时候就 添加进这一行的lyrics
      const isBarlineEnd = n instanceof BarLine && n.hasNewlineInEnd
      const isLeftHandEnd = !n_next
      const isRightHandEnd =
        n_next instanceof InfoField &&
        n_next.fieldType == InfoFiledType.voice &&
        n_next.getContent() === 'PianoLeftHand'
      if (isBarlineEnd || isLeftHandEnd || isRightHandEnd) {
        var lyricWords = lyrics.join(' ')
        var lyricsInfoField = new InfoField(InfoFiledType.words_aftertune, lyricWords)
        lyrics = [] // 重新记录下一行lyrics

        // 如果结尾是小节线才添加歌词，其他情况暂不加（用作编辑完成，再添加歌词的场景）
        if (n instanceof BarLine) {
          n.hasNewlineInEnd || n.setNewlineInEnd() // 手动换行
          this.insertNotationAfter(n, lyricsInfoField)
          i++
        }
      }
    }
  }

  public save() {
    return JSON.stringify(this.notations)
  }

  protected deserializeNotation(orgState) {
    let org_n: INotation
    if (orgState.ntype == NotationType.Note) {
      org_n = new Note(...orgState.state)
    } else if (orgState.ntype == NotationType.InfoField) {
      org_n = new InfoField(...orgState.state)
    } else if (orgState.ntype == NotationType.IninlineInfoField) {
      org_n = new InlineInfoField(...orgState.state)
    } else if (orgState.ntype == NotationType.BarLine) {
      org_n = new BarLine(...orgState.state)
    } else if (orgState.ntype == NotationType.RestNote) {
      org_n = new RestNote(...orgState.state)
    } else if (orgState.ntype == NotationType.ChordNote) {
      const [notesState, ...chordState] = orgState.state
      const notes = notesState.map(noteState => new Note(...noteState.state))
      org_n = new ChordNote(notes, ...chordState)
    }
    return org_n
  }

  protected trySetStaveFieldFrom(notation: INotation) {
    if (!(notation instanceof InfoField)) return

    if (notation.fieldType == InfoFiledType.reference_number) {
      this.id = notation
    } else if (notation.fieldType == InfoFiledType.title) {
      this.title = notation
    } else if (notation.fieldType == InfoFiledType.composer) {
      this.composer = notation
    } else if (notation.fieldType == InfoFiledType.tempo) {
      this.tempo = notation
    } else if (notation.fieldType == InfoFiledType.metre) {
      this.metre = notation
    } else if (notation.fieldType == InfoFiledType.note_unit_length) {
      this.unitNoteLength = notation
    } else if (notation.fieldType == InfoFiledType.key) {
      this.key = notation
    }
  }
  /**
   * 添加string index的变动通知，为了保持note的 索引正确
   * @field `string index` add,del,update 操作都可能会引起索引变化
   * @param subHandle
   */
  protected subscribeStringIndexChange(subHandle: StringsIndexChangeHandle): () => void {
    const that = this
    that.stringIndexChangeSubscribers.push(subHandle)
    return function() {
      const i = that.stringIndexChangeSubscribers.indexOf(subHandle)
      that.stringIndexChangeSubscribers.splice(i, 1)
    }
  }

  /**
   * 分发 stringindexchange 的通知，为了保证低耦合，触发分发应该在该类执行
   * @param iend
   * @param iorg_end
   */
  protected triggleStringIndexChange(sender: object, iend: number, org_iend: number) {
    // dispatch to subscribers
    for (let index = 0; index < this.stringIndexChangeSubscribers.length; index++) {
      this.stringIndexChangeSubscribers[index](sender, { iend, org_iend })
    }
  }

  /**
   * 创建命令对象，解耦 notation 和 stave
   * @summary 添加的时候需维持 每个notation 对应一个 command，不然可能有一些奇怪的bug;
   */
  protected createOperateCommand(): StaveCommand {
    const updateAbcString = (update_abcsting: UpdateAbcStringHandle) => {
      const orgStr = this.abcString
      const { newStaveAbcString, changesInfo } = update_abcsting(orgStr)
      this.abcString = newStaveAbcString

      if (changesInfo && changesInfo.iend != changesInfo.org_iend) {
        // 删除的索引变化为 org_istar-1, 即iend - len
        this.triggleStringIndexChange(changesInfo.sender, changesInfo.iend, changesInfo.org_iend)
      }
    }

    const updateNotations = (update_notations: (narr: INotation[]) => any) => {
      this.notations = update_notations(this.notations) || this.notations
    }

    let unsubscribe
    const subscribeAbcStringIndexChange = (subhandle: StringsIndexChangeHandle) => {
      unsubscribe = this.subscribeStringIndexChange(subhandle)
      return unsubscribe
    }

    const unsubscribeAbcStringIndexChange = () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }

    return {
      updateAbcString,
      updateNotations,
      subscribeAbcStringIndexChange,
      unsubscribeAbcStringIndexChange,
    }
  }
}
