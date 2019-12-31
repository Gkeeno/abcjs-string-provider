import { StaveBase } from './StaveBase'
import { INotation } from '..'
import { InfoField } from '../Notations/InfoField'
import { InfoFiledType } from '../Enums/InfoFieldType'

/**
 * @description
 */
export class Stave extends StaveBase {
  constructor() {
    super()
  }

  public init(dataraw: string = '[]') {
    var data = JSON.parse(dataraw)

    if (this.abcString) {
      return
    }

    if (data.length) {
      for (const nState of data) {
        const notation = this.deserializeNotation(nState)
        this.trySetStaveFieldFrom(notation)
        this.addNotation(notation)
      }
    } else {
      const headers = [
        this.id,
        this.title,
        this.composer,
        this.tempo,
        this.metre,
        this.unitNoteLength,
        this.key,
      ]
      for (const notation of this.notations.concat(headers)) {
        this.addNotation(notation)
      }
    }
    return this
  }
  public save() {
    return JSON.stringify(this.notations)
  }

}

;(window as any).Stave = Stave
