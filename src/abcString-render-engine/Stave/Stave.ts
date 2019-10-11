import { INotation } from '../Notations/INotation'

type stringsIndexChangehandle = (istart: number, length: number) => void

/**
 * a. 添加的任何 Notation 都可能引起 abcstring 变化  
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 */
export class Stave {
	private abcString: string = ""
	/**
	 * X:reference number
	 */
	public id: number = 1
	/**
	 * T:title
	 * @description
	 * followed X:
	 */
	public title: string = "untitled"
	/**
	 * M:meter 拍号
	 */
	public meter: string = "4/4"
	/**
	 * L:unit note length
	 * @description
	 * 每个音符时长的步进单位 例:  C - C/2 = L; C3 - C2 =L
	 */
	public unitNoteLength: string = "1/8"
	/**
	 * K:key
	 * @description
	 * 调号、finish field. (general)
	 */
	public key: string = "C"

	private notations: INotation[] = []

	private stringIndexChangeSubscribers: stringsIndexChangehandle[] = []

	constructor() {}

	getNotation(ichar_start: number, ichar_end: number):any {
		return this.notations.find(x => x.ibegin === ichar_start && x.iend === ichar_end);
	}

	addNotation(notaion: INotation) {
		notaion.addToStave(this);
	}
	insertNotation(after: INotation, notaion: INotation) {
		notaion.insertToStave(after, this);
	}
	/**
	 * 从字符串区间中删除符号
	 * @todo
	 * a.需要知道符号是否存在 b.需要知道符号是否在相应字符串区间
	 * 考虑实现一个sourcemap
	 */
	deleteNotationString(ichar_start: number, ichar_end: number) {}
	deleteNotation(notaion: INotation) {
		let iRemove = this.notations.indexOf(notaion)
		if (iRemove == -1) {
			console.warn("不存在将删除的notation")
			return
		}
		this.notations.splice(iRemove, 0)
	}

	/**
	 * 添加string index的变动通知，为了保持note的 索引正确  
	 * @field `string index` add,del,update 操作都会引起
	 * @param subHandle 
	 */
	subscribeStringIndexChange(subHandle: stringsIndexChangehandle): () => void {
		const that = this
		that.stringIndexChangeSubscribers.push(subHandle)
		return function() {
			let i = that.stringIndexChangeSubscribers.indexOf(subHandle)
			that.stringIndexChangeSubscribers.splice(i, 1)
		}
	}

	generateAbcString() {}
}
