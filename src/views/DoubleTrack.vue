<template>
  <div class="doubleTrack">
    <input v-model="staveData" />
    <button @click="loadStave">加载谱子</button>
    <button @click="saveStave">保存谱子</button>

    <div class="btn_groups">
      <button class="btn" @click="playMidi">试听乐谱</button>
    </div>
    <div id="ctrl_midi"></div>

    <div class="doubleTrack_box">
      <div class="clef_box">
        <p class="headline">音符</p>
        <div class="btn_group">
          <div class="img_box" v-for="(item, index) in clefArr" :key="index">
            <img :src="item.img" alt @click="addNote(item.data)" />
          </div>
          <div class="img_box" v-for="(item, index) in restArr" :key="index+'a'">
            <img :src="item.img" alt @click="addRestNote(item.data)" />
          </div>
          <div class="img_box">
            <img src="../assets/image/barline.png" alt @click="addBarline()" />
          </div>
        </div>
        <button @click="newline">换下一行</button>
        <button @click="addUnisons">添加合音</button>
      </div>
      <div class="vex_box">
        <div class="input_box">
          <div class="title input_item">
            <label for="title">谱名</label>
            <input type="text" id="title" v-model="title" ref="title" />
          </div>
          <div class="composer input_item">
            <label for="author_name">作者</label>
            <input type="text" id="author_name" v-model="composer" ref="composer" />
          </div>
          <div class="speed_input input_item">
            <label for="abc_speed">调号</label>
            <select id="key" v-model="key" ref="key">
              <option>C</option>
            </select>
          </div>
          <div class="metre input_item">
            <label for="metre">拍号</label>
            <select id="metre" v-model="metre" ref="metre">
              <option>4/4</option>
            </select>
          </div>
          <div class="speed_input input_item">
            <label for="tempo">速率</label>
            <input type="text" id="tempo" v-model="tempo" ref="tempo" />
          </div>

          <div class="curEditTrack_input input_item">
            <label for="curEditTrack">默认插入轨道</label>
            <select
              id="curEditTrack"
              ref="curEditTrack"
              @change="changeEditTrack($event)"
            >
              <option>右手</option>
              <option>左手</option>
            </select>
          </div>
        </div>
        <div class="svg_box" ref="paper">
          <div id="paper1" class="sheet-music"></div>
        </div>
        <div class="funBtn">
          <button @click="delNote">删除音符</button>
        </div>
      </div>
      <div class="attribute_box">
        <p class="headline">音符属性</p>
        <div class="btn_group">
          <div class="img_box" v-for="(item, index) in symbolArr" :key="index">
            <img :src="item.img" alt @click="setAccidental(item.data)" />
          </div>
        </div>
        <button @click="breaktie">断开符尾</button>
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
	NotationType,
	InfoField,
	Stave,
	RestNote,
	UnisonsBoundary,
	InfoFiledType,
	BarLine,
	NoteAccidental
} from '../abcString-render-engine';

import _ from 'lodash';
import { StringIndexChangeEventArgs } from '../abcString-render-engine/types_defined';
import { StaveDoubleTrack } from '../abcString-render-engine/Stave/DoubleTrackStave';

enum KeyName {
	Delete,
	Insert,
	ArrowUp,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	Backspace,
	Enter
}
enum SelectNotationType {
	unkown,
	note = 'note',
	bar = 'bar',
	treble = 'treble',
	rest = 'rest'
}

@Component
export default class DoubleTrack extends Vue {
	public get title(): string {
		return this.$title && this.$title.getContent();
	}
	public set title(v: string) {
		this.$data.$title.setContent(v);
	}

	public get composer(): string {
		return this.$composer && this.$data.$composer.getContent();
	}
	public set composer(v: string) {
		this.$data.$composer.setContent(v);
	}

	public get key(): string {
		return this.$key && this.$key.getContent();
	}
	public set key(v: string) {
		this.$data.$key.setContent(v);
	}

	public get metre(): string {
		return this.$metre && this.$metre.getContent();
	}
	public set metre(v: string) {
		this.$data.$metre.setContent(v);
	}

	public get tempo(): string {
		return this.$tempo && this.$tempo.getContent();
	}
	public set tempo(v: string) {
		this.$data.$tempo.setContent(v);
	}

	public staveData: string = '';
	public stave: StaveDoubleTrack;
	public selectedNotation: { type: SelectNotationType; value } = null;
	public curEditTrack: '左手' | '右手' = '右手';

	@Provide() public clefArr = [
		{ data: 'Whole', img: require('../assets/image/clef1.png') },
		{ data: 'Half', img: require('../assets/image/clef2.png') },
		{ data: 'Quarter', img: require('../assets/image/clef3.png') },
		{ data: 'Quarter_dot1', img: require('../assets/image/clef3_dot.png') },
		{ data: 'Eighth', img: require('../assets/image/clef4.png') },
		{ data: 'Sixteenth', img: require('../assets/image/clef5.png') }
	];
	@Provide() public restArr = [
		{ data: 'Whole', img: require('../assets/image/clef6.png') },
		{ data: 'Half', img: require('../assets/image/clef7.png') },
		{ data: 'Quarter', img: require('../assets/image/clef8.png') },
		// { data: 'Eighth', img: require('../assets/image/clef9.png') },
		{ data: 'Eighth', img: require('../assets/image/clef10.png') },
		{ data: 'Sixteenth', img: require('../assets/image/clef11.png') }
	];
	@Provide() public symbolArr = [
		{ data: 'Flat', img: require('../assets/image/attribute1.png') },
		{ data: 'Sharp', img: require('../assets/image/attribute2.png') },
		{ data: 'Natural', img: require('../assets/image/attribute3.png') },
		{ data: 'DoubleFlat', img: require('../assets/image/attribute4.png') },
		{ data: 'DoubleSharp', img: require('../assets/image/attribute5.png') }
		// { data: 'symbol6', img: require('../assets/image/attribute6.png') }
	];

	private $title = new InfoField(InfoFiledType.title, 'untitled1');

	private $composer = new InfoField(InfoFiledType.composer, 'none1');

	private $key = new InfoField(InfoFiledType.key, 'C');

	private $metre = new InfoField(InfoFiledType.metre, '4/4');

	private $tempo = new InfoField(InfoFiledType.tempo, '60');

	private tuneObjectArray;

	constructor() {
		super();
		window.document.onkeydown = e => this.keypressHandle(e);
	}
	public loadStave() {
		const stave = new StaveDoubleTrack();
		stave.title = this.$data.$title;
		stave.composer = this.$data.$composer;
		stave.key = this.$data.$key;
		stave.metre = this.$data.$metre;
		stave.tempo = this.$data.$tempo;
		this.stave = stave.init(JSON.parse(this.staveData));

		(window as any).stave = stave;
		this.stave.setStaveChangeHandle(this.renderAbc.bind(this));
		// 手动渲染下界面
		this.renderAbc();
		// 手动绑定上表单的值，因为v-model无法直接从对象中获取
		(this.$refs.title as any).value = stave.title.getContent();
		(this.$refs.composer as any).value = stave.composer.getContent();
		(this.$refs.key as any).value = stave.key.getContent();
		(this.$refs.metre as any).value = stave.metre.getContent();
		(this.$refs.tempo as any).value = stave.tempo.getContent();
	}
	public saveStave() {
		this.staveData = this.stave.save();
	}

	public mounted() {
		const stave = new StaveDoubleTrack();
		stave.title = this.$data.$title;
		stave.composer = this.$data.$composer;
		stave.key = this.$data.$key;
		stave.metre = this.$data.$metre;
		stave.tempo = this.$data.$tempo;
		this.stave = stave.init();
		this.stave.insertNotation(this.stave.rightHand, new Note(NoteKey.C4));

		(window as any).stave = stave;
		this.stave.setStaveChangeHandle(this.renderAbc.bind(this));
		// 手动渲染下界面
		this.renderAbc();
		// 手动绑定上表单的值，因为v-model无法直接从对象中获取
		(this.$refs.title as any).value = stave.title.getContent();
		(this.$refs.composer as any).value = stave.composer.getContent();
		(this.$refs.key as any).value = stave.key.getContent();
		(this.$refs.metre as any).value = stave.metre.getContent();
		(this.$refs.tempo as any).value = stave.tempo.getContent();
		(this.$refs.curEditTrack as HTMLSelectElement).value = this.curEditTrack;
		this.selectedNotation = {
			type: SelectNotationType.note,
			value:
				this.curEditTrack === '右手'
					? this.stave.rightHand
					: this.stave.leftHand
		};
	}

	public renderAbc() {
		const that = this;
		this.tuneObjectArray = abcjs.renderAbc('paper1', this.stave.abcString, {
			add_classes: true,
			staffwidth: 500,
			clickListener(abcElem, tuneNumber, classes) {
				const notation = that.stave.getNotation(
					abcElem.startChar,
					abcElem.endChar - 1
				);

				!notation
					? (that.selectedNotation = null)
					: (that.selectedNotation = {
							type:
								(abcElem.rest && SelectNotationType.rest) ||
								abcElem.el_type ||
								abcElem.type ||
								SelectNotationType.unkown,
							value: notation
					  });

				console.log(
					that.stave.abcString.substring(
						abcElem.startChar,
						abcElem.endChar
					),
					abcElem.startChar,
					abcElem.endChar,
					that.selectedNotation && that.selectedNotation.value
				);
			}
		});
	}

	public changeEditTrack(e: Event) {
		var sender = e.target as HTMLSelectElement;
		this.curEditTrack = sender.value as '左手' | '右手';
		if (this.curEditTrack == '左手') {
			this.selectedNotation = {
				type: SelectNotationType.note,
				value: this.stave.leftHand
			};
		} else if (this.curEditTrack == '右手') {
			this.selectedNotation = {
				type: SelectNotationType.note,
				value: this.stave.rightHand
			};
		}
	}

	public addNote(duration: NoteDuration) {
		const durationValue = NoteDuration[duration] || NoteDuration.Quarter;
		const note = new Note(NoteKey.C2, durationValue);

		this.selectedNotation
			? this.stave.insertNotation(this.selectedNotation.value, note)
			: this.stave.addNotation(note);
		this.selectedNotation = { type: SelectNotationType.note, value: note };
	}
	public addRestNote(duration: NoteDuration) {
		const durationValue = NoteDuration[duration] || NoteDuration.Quarter;
		const note = new RestNote(durationValue);

		this.selectedNotation
			? this.stave.insertNotation(this.selectedNotation.value, note)
			: this.stave.addNotation(note);
		this.selectedNotation = { type: SelectNotationType.note, value: note };
	}
	public addBarline() {
		const barline = new BarLine();

		this.selectedNotation
			? this.stave.insertNotation(this.selectedNotation.value, barline)
			: this.stave.addNotation(barline);
		this.selectedNotation = {
			type: SelectNotationType.bar,
			value: barline
		};
	}

	public delNote() {
		this.stave.deleteNotation(this.selectedNotation.value);
		this.selectedNotation = null;
	}
	public breaktie() {
		this.selectedNotation &&
			this.selectedNotation.type == SelectNotationType.note &&
			(this.selectedNotation.value as Note).setEndSpacing();
	}

	public addUnisons() {
		var boundaryS = new UnisonsBoundary(
			new Note(NoteKey.C3, NoteDuration.Quarter),
			false
		);
		var boundaryE = new UnisonsBoundary(
			new Note(NoteKey.C3, NoteDuration.Quarter),
			true
		);
		boundaryS.link(boundaryE);

		if (
			this.selectedNotation &&
			this.selectedNotation.type == SelectNotationType.note
		) {
			this.stave.insertNotation(this.selectedNotation.value, boundaryS);
			this.stave.insertNotation(boundaryS.bindNote, boundaryE);
		} else {
			this.stave.addNotation(boundaryS);
			this.stave.insertNotation(boundaryS.bindNote, boundaryE);
		}
	}

	public setAccidental(accidentalName: string) {
		this.selectedNotation &&
			this.selectedNotation.type == SelectNotationType.note &&
			(this.selectedNotation.value as Note).setAccidential(
				NoteAccidental[accidentalName] || NoteAccidental.None
			);
	}

	public newline() {
		this.selectedNotation &&
			this.selectedNotation.type == SelectNotationType.bar &&
			(this.selectedNotation.value as BarLine).setNewlineInEnd();
	}

	public keypressHandle(e: KeyboardEvent) {
		if (!this.selectedNotation) {
			return;
		}

		if (e.key === KeyName[KeyName.Delete]) {
			e.preventDefault();
			// 删除
			this.delNote();
		} else if (this.selectedNotation.type == SelectNotationType.note) {
			// 音符操作
			if (e.key === KeyName[KeyName.ArrowUp]) {
				e.preventDefault();
				(this.selectedNotation.value as Note).pitchUp(); // 升高音符在音阶的一个音
			} else if (e.key === KeyName[KeyName.ArrowDown]) {
				e.preventDefault();
				(this.selectedNotation.value as Note).pitchDown();
			}
		} else if (this.selectedNotation.type == SelectNotationType.bar) {
			// 小节线操作
			if (e.key === KeyName[KeyName.Enter]) {
				this.newline();
			}
		}
	}

	public playMidi() {
		let resumeBeforeColor = function() {};
		abcjs.midi.setSoundFont('./');
		abcjs.renderMidi('ctrl_midi', this.stave.abcString, {
			animate: {
				listener(abcjsElement, currentEvent, context) {
					console.log(abcjsElement, currentEvent, context);
					resumeBeforeColor();
					currentEvent &&
						currentEvent.elements[0][0].setAttribute(
							'fill',
							'#000FFF'
						);
					resumeBeforeColor = (function(event) {
						return function() {
							event.elements[0][0].setAttribute(
								'fill',
								'#000000'
							);
						};
					})(currentEvent);
				},
				target: this.tuneObjectArray[0],
				qpm: this.tempo
			},
			// voicesOff: false,
			inlineControls: { hide: true }
		});
		abcjs.midi.startPlaying(document.querySelector('.abcjs-inline-midi'));
	}
}
</script>

<style lang="less" scoped>
.doubleTrack {
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
