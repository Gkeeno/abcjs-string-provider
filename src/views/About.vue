<template>
  <div class="about">
    <div class="btn_groups">
      <button class="btn">暂存</button>
      <button class="btn">测试乐谱</button>
      <button class="btn">生成乐谱</button>
    </div>
    <div class="about_box">
      <div class="clef_box">
        <p class="headline">音符</p>
        <div class="btn_group">
          <div class="img_box" v-for="(item, index) in clefArr" :key="index">
            <img :src="item.img" alt @click="addNote(item.data)"/>
          </div>
        </div>
      </div>
      <div class="vex_box">
        <div class="input_box">
          <div class="title input_item">
            <label for="abctitle">谱名</label>
            <input type="text" id="abctitle" v-model="abcTitle" @input="updateStaveInfo"/>
          </div>
          <div class="author input_item">
            <label for="author_name">作者</label>
            <input type="text" id="author_name" v-model="author" @input="updateStaveInfo"/>
          </div>
          <div class="timeSignature input_item">
            <label for="time_signature">拍号</label>
			<select id="time_signature" v-model="timeSignature" @input="updateStaveInfo">
				<option>4/4</option>
			</select>
          </div>
          <div class="speed_input input_item">
            <label for="abc_speed">速率</label>
            <input type="text" id="abc_speed" v-model="speed" @input="updateStaveInfo"/>
          </div>
        </div>
        <div class="svg_box" ref="paper">
          <div id="paper1" class="sheet-music"></div>
        </div>
        <div class="funBtn">
          <button @click="delNote">删除</button>
        </div>
      </div>
      <div class="attribute_box">
        <p class="headline">音符属性</p>
        <div class="btn_group">
          <div class="img_box" v-for="(item, index) in symbolArr" :key="index">
            <img :src="item.img" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import abcjs from 'abcjs/midi';
import {
	Note,
	NoteKey,
	NoteDuration,
	NotaionType,
	SequenceNoteKey
} from '../abcString-render-engine';
import _ from 'lodash';
import { NoteDurationNameMap } from '../abcString-render-engine/constant';

enum KeyName {
	Delete,
	Insert,
	ArrowUp,
	ArrowDown,
	ArrowLeft,
	ArrowRight
}
const newline = `
`;

@Component
export default class About extends Vue {
	/**
	 *
	 */
	constructor() {
		super();
		window.document.onkeydown = e => this.keypressHandle(e);
	}
	updateStaveInfo(){
		let abcstringHead =[`X:1
T: ${this.abcTitle}
C: ${this.author}
Q: 1/4=${this.speed}
M: ${this.timeSignature}
L: 1/16
R: 
K: Emin
`];
		let abcstringBody = this.tunebookString.split(newline).splice(8);
console.log('before',this.tunebookString,abcstringBody)
		this.tunebookString = abcstringHead.concat(abcstringBody).join('');
		console.log('after',this.tunebookString)
	}
	public selectCharStart: number;
	public selectCharEnd: number;
	public selectCharPitch: number;
	public selectDuration: number;

	@Provide() public abcTitle = 'untitled';
	@Provide() public author = 'none';
	@Provide() public timeSignature = '4/4';
	@Provide() public speed = '60';
	@Provide() public clefArr = [
		{ data: 'Whole', img: require('../assets/image/clef1.png') },
		{ data: 'Half', img: require('../assets/image/clef2.png') },
		{ data: 'Quarter', img: require('../assets/image/clef3.png') },
		{ data: 'Quarter_dot', img: require('../assets/image/clef3_dot.png') },
		{ data: 'note4', img: require('../assets/image/clef4.png') },
		{ data: 'note5', img: require('../assets/image/clef5.png') },
		{ data: 'note6', img: require('../assets/image/clef6.png') },
		{ data: 'note7', img: require('../assets/image/clef7.png') },
		{ data: 'note8', img: require('../assets/image/clef8.png') },
		{ data: 'note9', img: require('../assets/image/clef9.png') },
		{ data: 'note10', img: require('../assets/image/clef10.png') },
		{ data: 'note11', img: require('../assets/image/clef11.png') },
		{ data: 'barline', img: require('../assets/image/barline.png') }
	];
	@Provide() public symbolArr = [
		{ data: 'symbol1', img: require('../assets/image/attribute1.png') },
		{ data: 'symbol2', img: require('../assets/image/attribute2.png') },
		{ data: 'symbol3', img: require('../assets/image/attribute3.png') },
		{ data: 'symbol4', img: require('../assets/image/attribute4.png') },
		{ data: 'symbol5', img: require('../assets/image/attribute5.png') }
		// { data: 'symbol6', img: require('../assets/image/attribute6.png') }
	];
	public get tunebookString(): string {
		return this.abcstring;
	}

	public set tunebookString(v: string) {
		this.abcstring = v;
		this.renderAbc();
	}
	
	public abcstring: string = `X:1
T: ${this.abcTitle}
C: ${this.author}
Q: 1/4=${this.speed}
M: ${this.timeSignature}
L: 1/16
R: 
K: Emin
|D1A2D3 BDAD|
`;

	public mounted() {
		this.renderAbc();
	}

	public renderAbc() {
		const that = this;
		const tuneObjectArray = abcjs.renderAbc('paper1', this.abcstring, {
			add_classes: true,
			staffwidth: 500,
			clickListener: function(abcElem, tuneNumber, classes) {
				// console.log(abcElem, tuneNumber, classes);
				that.selectCharStart = abcElem.startChar;
				that.selectCharEnd = abcElem.endChar;
				that.selectDuration = abcElem.pitches && abcElem.duration;
				that.selectCharPitch =
					abcElem.pitches && abcElem.pitches[0].pitch; // 现在每个音符默认就一个音
			}
		});
	}
	public resetSelectChars() {
		this.selectCharStart = 0;
		this.selectCharEnd = 0;
	}

	public addNote(duration: NoteDuration) {
		const note = new Note(NoteKey.C2);
		this.tunebookString += note.toAbcString();
	}

	public delNote() {
		if (this.selectCharEnd === 0) return;
		// 删除所选字符串
		var forward = this.tunebookString.substring(0, this.selectCharStart);
		var backward = this.tunebookString.substring(this.selectCharEnd);
		this.tunebookString = forward.concat(backward);

		this.resetSelectChars();
	}

	public adjustNotePitch(keysignal: KeyName) {
		if (
			this.selectCharEnd === 0 ||
			isNaN(this.selectCharPitch) ||
			isNaN(this.selectDuration)
		){
			return;
		}

		// a.在所选字符串中插入新字符串
		var forward = this.tunebookString.substring(0, this.selectCharStart);
		var backward = this.tunebookString.substring(this.selectCharEnd);
		var iInSequence = this.selectCharPitch + 7; // 选中索引和构造的音符序列 需要索引对齐

		var key = SequenceNoteKey[iInSequence];
		if (!key) return;
		const duration: NoteDuration = NoteDurationNameMap[this.selectDuration.toString()];
		if (duration == undefined) return;
		console.log(duration);
		
		const note = new Note(key,duration);

		const flag_pitchupSuccess =
			keysignal === KeyName.ArrowUp
				? note.pitchUp()
				: keysignal === KeyName.ArrowDown
				? note.pitchDown()
				: false;
		const str_update = note.toAbcString();

		if (!flag_pitchupSuccess) return;

		// b.升调成功 同步 选中索引
		// 重新选中调整的字符串 （可能会有变化）
		this.selectCharPitch =
			keysignal === KeyName.ArrowUp
				? this.selectCharPitch + 1
				: keysignal === KeyName.ArrowDown
				? this.selectCharPitch - 1
				: this.selectCharPitch;
		if (this.selectCharEnd - this.selectCharStart !== str_update.length) {
			this.selectCharEnd = this.selectCharStart + str_update.length;
		}

		this.tunebookString = forward.concat(str_update).concat(backward);
	}
	public keypressHandle(e: KeyboardEvent) {
		if (e.key === KeyName[KeyName.Delete]) {
			e.preventDefault();
			//删除
			this.delNote();
		} else if (e.key === KeyName[KeyName.ArrowUp]) {
			e.preventDefault();
			// 升高音符在音阶的一个音
			this.adjustNotePitch(KeyName.ArrowUp);
		} else if (e.key === KeyName[KeyName.ArrowDown]) {
			e.preventDefault();
			// 降低音符在音阶的一个音
			this.adjustNotePitch(KeyName.ArrowDown);
		}
	}
}
</script>

<style lang="less" scoped>
.about {
	min-height: 100vh;
	.btn_groups {
		display: flex;
		height: 40px;
		padding-left: 20px;
		.btn {
			border: none;
			margin-right: 20px;
			background: transparent;
			width: 100px;
		}
	}
	&_box {
		display: flex;
		flex-direction: row;
	}
	.btn_group {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		margin-top: 20px;
	}
	.headline {
		background: #eee;
		color: #000;
		font-size: 18px;
	}
	.clef_box {
		flex: 0.25;
		height: 100%;
		border-right: 1px solid #595959;
		min-height: 80vh;
		padding: 0 10px;
		.img_box {
			width: 100px;
			height: 100px;
			margin: 0 20px 20px 0;
			img {
				width: 100px;
				height: 100px;
				cursor: pointer;
			}
		}
	}
	.attribute_box {
		flex: 0.3;
		height: 100%;
		border-left: 1px solid #595959;
		min-height: 80vh;
		padding: 0 10px;
		.img_box {
			width: 116px;
			height: 116px;
			margin: 0 0 20px 20px;
			img {
				width: 116px;
				height: 116px;
			}
		}
	}
	.vex_box {
		flex: 0.7;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 80vh;
		.input_box {
			display: flex;
		}
		.input_item {
			margin-left: 20px;
			label {
				margin-right: 10px;
			}
		}
		.input_item:first-child {
			margin-left: 0;
		}
		.svg_box {
			margin-top: 20px;
			width: 700px;
			height: 700px;
			border: 1px solid #595959;
		}
	}
}
</style>
