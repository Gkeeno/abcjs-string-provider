<template>
  <div class="home">
    <input v-model="staveData" />
    <button @click="loadStave">加载谱子</button>
    <button @click="saveStave">保存谱子</button>

    <div class="btn_groups">
      <button class="btn" @click="playMidi">试听乐谱</button>
    </div>
    <div id="ctrl_midi"></div>

    <div class="home_box">
      <div class="clef_box">
        <p class="headline">音符</p>
        <div class="btn_group">
          <div class="img_box" v-for="(item, index) in clefArr" :key="index">
            <img :src="item.img" alt @click="addNote(item.data)" />
          </div>
          <div class="img_box" v-for="(item, index) in restArr" :key="index + 'a'">
            <img :src="item.img" alt @click="addRestNote(item.data)" />
          </div>
          <div class="img_box">
            <img src="../assets/image/ChordNote.png" alt @click="addChordNote()" />
          </div>
          <div class="img_box">
            <img src="../assets/image/barline.png" alt @click="addBarline()" />
          </div>
        </div>
        <button @click="newline">换下一行</button>
        <button @click="selectSlurs">选择俩个音符为圆滑音</button>
      </div>
      <div class="vex_box">
        <div class="input_box">
          <div class="title input_item">
            <label for="title">谱名</label>
            <input type="text" ref="title" />
          </div>
          <div class="composer input_item">
            <label for="author_name">作者</label>
            <input type="text" id="author_name" ref="composer" />
          </div>
          <div class="speed_input input_item">
            <label for="abc_speed">调号</label>
            <select id="key" ref="key">
              <option>C</option>
            </select>
          </div>
          <div class="metre input_item">
            <label for="metre">拍号</label>
            <select id="metre" ref="metre">
              <option>4/4</option>
            </select>
          </div>
          <div class="speed_input input_item">
            <label for="tempo">速率</label>
            <input type="text" id="tempo" ref="tempo" />
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
        <br />
        <button @click="toggleNoteTie">开启/关闭延音符号</button>

        <div class="btn_group">
          <div class="img_box" v-for="(item, index) in barlineTypeArr" :key="index">
            <img :src="item.img" alt @click="setBarlineType(item.data)" />
          </div>
        </div>

        <input type="number" ref="txt_barline_repeats" />
        <button @click="setBarlineRepeats">添加小节重复号</button>

        <select ref="sel_chordtype" v-model="selectedChordType">
          <optgroup label="三和弦">
            <option value="0">大三和弦</option>
            <option value="1">小三和弦</option>
            <option value="4">挂四和弦</option>
          </optgroup>

          <optgroup label="双音">
            <option value="5">三度</option>
            <option value="6">四度</option>
            <option value="7">五度</option>
          </optgroup>
        </select>
        <button @click="changeChordType">更改和弦类型</button>
        <br />
        <select ref="sel_chordtype" v-model="selectedChordDuration">
          <option value="16">全音符</option>
          <option value="12">二分音符附点</option>
          <option value="8">二分音符</option>
          <option value="6">四分音符附点</option>
          <option value="4">四分音符</option>
          <option value="2">八分音符</option>
        </select>
        <button @click="changeChordDuration">更改和弦时值</button>
        <br />
        <br />
        <input type="text" ref="txt_lyrics" />
        <button @click="addLyrics">添加歌词</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator'
import _ from 'lodash'
import abcjs from 'abcjs/midi'
import {
  Note,
  NoteKey,
  NoteDuration,
  NotationType,
  InfoField,
  Stave,
  RestNote,
  SlursBoundary,
  InfoFiledType,
  BarLine,
  NoteAccidental,
  BarlineType,
  ChordNote,
  ChordType,
  INotation,
} from '../abcString-render-engine'
import { StaveUtil } from '@/util'

enum KeyCode {
  Delete = 46,
  // Insert,
  ArrowUp = 38,
  ArrowDown = 40,
  ArrowLeft = 37,
  ArrowRight = 39,
  Backspace = 8,
  Enter = 13,
  Space = 32
}

@Component
export default class Home extends Vue {
  public staveData: string = ''
  public stave: Stave
  public selectedNotation:INotation = null
  public selectedChordType: ChordType = ChordType.Major
  public selectedChordDuration: NoteDuration = NoteDuration.Quarter

  @Provide() public clefArr = [
    { data: 'Whole', img: require('../assets/image/clef1.png') },
    { data: 'Half', img: require('../assets/image/clef2.png') },
    { data: 'Half_dot1', img: require('../assets/image/Half_dot1.png') },
    { data: 'Quarter', img: require('../assets/image/clef3.png') },
    { data: 'Quarter_dot1', img: require('../assets/image/clef3_dot.png') },
    { data: 'Eighth', img: require('../assets/image/clef4.png') },
    { data: 'Sixteenth', img: require('../assets/image/clef5.png') },
  ]
  @Provide() public restArr = [
    { data: 'Whole', img: require('../assets/image/clef6.png') },
    { data: 'Half', img: require('../assets/image/clef7.png') },
    { data: 'Quarter', img: require('../assets/image/clef8.png') },
    // { data: 'Eighth', img: require('../assets/image/clef9.png') },
    { data: 'Eighth', img: require('../assets/image/clef10.png') },
    { data: 'Sixteenth', img: require('../assets/image/clef11.png') },
  ]
  @Provide() public symbolArr = [
    { data: 'Flat', img: require('../assets/image/attribute1.png') },
    { data: 'Sharp', img: require('../assets/image/attribute2.png') },
    { data: 'Natural', img: require('../assets/image/attribute3.png') },
    { data: 'DoubleFlat', img: require('../assets/image/attribute4.png') },
    { data: 'DoubleSharp', img: require('../assets/image/attribute5.png') },
    // { data: 'symbol6', img: require('../assets/image/attribute6.png') }
  ]
  @Provide() public barlineTypeArr = [
    {
      data: 'DoubleBarline',
      img: require('../assets/image/DoubleBarline.png'),
    },
    {
      data: 'ThinThick_DoubleBarline',
      img: require('../assets/image/ThinThick_DoubleBarline.png'),
    },
    {
      data: 'ThickThin_DoubleBarline',
      img: require('../assets/image/ThickThin_DoubleBarline.png'),
    },
    {
      data: 'RepeatedSetion_Start',
      img: require('../assets/image/RepeatedSetion_Start.png'),
    },
    {
      data: 'RepeatedSetion_End',
      img: require('../assets/image/RepeatedSetion_End.png'),
    },
    {
      data: 'RepeatedSetion_StartAndEnd',
      img: require('../assets/image/RepeatedSetion_StartAndEnd.png'),
    },
  ]

  private tuneObjectArray

  private clickHook_selectUnisons: (notaion: INotation) => void = function() {}

  constructor() {
    super()
    window.document.onkeydown = e => this.keypressHandle(e)
  }

  private bindInfoFieldChangeHandle(fieldKey: string, staveField: InfoField) {
    const elem = this.$refs[fieldKey] as HTMLInputElement
    if (!elem) return

    elem.value = staveField.getContent()
    elem.addEventListener('input', event => {
      const val = (event.srcElement as HTMLInputElement).value
      staveField.setContent(val)
    })
  }

  public loadStave() {
    const stave = new Stave()
    this.stave = stave.init(this.staveData)
    this.stave.setStaveChangeHandle(this.renderAbc.bind(this))
    // 手动渲染下界面
    this.renderAbc()
    // 手动绑定上表单的值，因为v-model无法直接从对象中获取
    this.bindInfoFieldChangeHandle('title', stave.title)
    this.bindInfoFieldChangeHandle('composer', stave.composer)
    this.bindInfoFieldChangeHandle('key', stave.key)
    this.bindInfoFieldChangeHandle('metre', stave.metre)
    this.bindInfoFieldChangeHandle('tempo', stave.tempo)
    ;(window as any).stave = stave
  }

  public loadEmptyStave() {
    const stave = new Stave()
    stave.title = new InfoField(InfoFiledType.title, 'myuntitled')
    stave.composer = new InfoField(InfoFiledType.composer, 'mynone')
    stave.key = new InfoField(InfoFiledType.key, 'C')
    stave.metre = new InfoField(InfoFiledType.metre, '4/4')
    stave.tempo = new InfoField(InfoFiledType.tempo, '60')
    this.stave = stave.init()
    this.stave.addNotation(new Note(NoteKey.C3))
    this.stave.setStaveChangeHandle(this.renderAbc.bind(this))
    // 手动渲染下界面
    this.renderAbc()
    // 手动绑定上表单的值，因为v-model无法直接从对象中获取
    this.bindInfoFieldChangeHandle('title', stave.title)
    this.bindInfoFieldChangeHandle('composer', stave.composer)
    this.bindInfoFieldChangeHandle('key', stave.key)
    this.bindInfoFieldChangeHandle('metre', stave.metre)
    this.bindInfoFieldChangeHandle('tempo', stave.tempo)

    ;(window as any).stave = this.stave
  }

  public saveStave() {
    this.staveData = this.stave.save()
  }

  public mounted() {
    this.loadEmptyStave()
  }

  public renderAbc() {
    const that = this
    this.tuneObjectArray = abcjs.renderAbc('paper1', this.stave.abcString, {
      add_classes: true,
      staffwidth: 500,
      clickListener(abcElem, tuneNumber, classes) {
        const notation = that.stave.getNotation(abcElem.startChar, abcElem.endChar - 1)
        that.selectedNotation = notation;
        that.clickHook_selectUnisons(notation);

        console.log(
          that.stave.abcString.substring(abcElem.startChar, abcElem.endChar),
          abcElem.startChar,
          abcElem.endChar,
          notation,
        )
      },
    })
  }

  public addNote(duration: NoteDuration) {
    const durationValue = NoteDuration[duration] || NoteDuration.Quarter
    const note = new Note(NoteKey.C3, durationValue)

    this.selectedNotation
      ? this.stave.insertNotationAfter(this.selectedNotation, note)
      : this.stave.addNotation(note)
    this.selectedNotation = note
  }

  public addRestNote(duration: NoteDuration) {
    const durationValue = NoteDuration[duration] || NoteDuration.Quarter
    const note = new RestNote(durationValue)

    this.selectedNotation
      ? this.stave.insertNotationAfter(this.selectedNotation, note)
      : this.stave.addNotation(note)
    this.selectedNotation = note
  }

  public addChordNote() {
    const chordnote = new ChordNote(NoteKey.C3, NoteDuration.Quarter, ChordType.Major)

    this.selectedNotation
      ? this.stave.insertNotationAfter(this.selectedNotation, chordnote)
      : this.stave.addNotation(chordnote)
    this.selectedNotation = chordnote
  }

  public addBarline() {
    const barline = new BarLine()

    this.selectedNotation
      ? this.stave.insertNotationAfter(this.selectedNotation, barline)
      : this.stave.addNotation(barline)
    this.selectedNotation = barline
  }

  public delNote() {
    this.stave.deleteNotation(this.selectedNotation)
    this.selectedNotation = null
    this.stave.generationLyrics()
  }

  public breaktie() {
    this.selectedNotation &&
      StaveUtil.isNoteType(this.selectedNotation) &&
      (this.selectedNotation as Note).setEndSpacing()
  }

  public toggleNoteTie() {
    if(!this.selectedNotation) return;
    if(!StaveUtil.isNoteType(this.selectedNotation)) return;

    const note = this.selectedNotation as Note|ChordNote;
    note.setHasTieIs(!note.hasTie);
  }

  public selectSlurs() {
    const notestack: INotation[] = [] // 0begin 1end
    const defaultHandle = function() {}
    this.clickHook_selectUnisons = notation => {
      let note: INotation = null
      if (notation instanceof Note) {
        note = notation
      } else if (notation instanceof SlursBoundary) {
        note = notation.getInner()
      } else {
        return
      }

      notestack.push(note)
      if (notestack.length < 2) return
      // 添加了俩个以上

      try {
        SlursBoundary.setBeginning(notestack[0])
          .setEnding(notestack[1])
          .appendToStave(this.stave)
      } catch (error) {
        alert(error)
      } finally {
        this.clickHook_selectUnisons = defaultHandle
      }
    }
  }

  public setAccidental(accidentalName: string) {
    this.selectedNotation &&
      this.selectedNotation.ntype ==NotationType.Note &&
      (this.selectedNotation as Note).setAccidential(
        NoteAccidental[accidentalName] || NoteAccidental.None,
      )
  }

  public setBarlineType(barlineTypeName: string) {
    this.selectedNotation &&
      this.selectedNotation.ntype == NotationType.BarLine &&
      (this.selectedNotation as BarLine).setBarlineType(
        BarlineType[barlineTypeName] || BarlineType.SingleBarline,
      )
  }
  public setBarlineRepeats() {
    let txt_repeats = this.$refs.txt_barline_repeats as any

    this.selectedNotation &&
      this.selectedNotation.ntype == NotationType.BarLine &&
      (this.selectedNotation as BarLine).setRepeatsNumber(Number(txt_repeats.value))
  }

  public newline() {
    this.selectedNotation &&
      this.selectedNotation.ntype == NotationType.BarLine &&
      (this.selectedNotation as BarLine).setNewlineInEnd()
  }

  public changeChordType() {
    this.selectedNotation &&
      this.selectedNotation.ntype == NotationType.ChordNote &&
      (this.selectedNotation as ChordNote).setChordType(this.selectedChordType)
  }

  public changeChordDuration() {
    this.selectedNotation &&
      this.selectedNotation.ntype == NotationType.ChordNote &&
      (this.selectedNotation as ChordNote).setDuration(this.selectedChordDuration)
  }

  public addLyrics() {
    if (!StaveUtil.isNoteType(this.selectedNotation)) {
      return
    }

    let txt_lyrics = this.$refs.txt_lyrics as HTMLInputElement
    (this.selectedNotation as Note).lyrics = txt_lyrics.value
    // txt_lyrics.value = '';
    this.stave.generationLyrics()
  }

  public keypressHandle(e: KeyboardEvent) {
    if (!this.selectedNotation) return;

    const notation = this.selectedNotation;
    // 删除
    if (e.keyCode === KeyCode.Delete) {
      e.preventDefault();
      this.delNote();
    }
    // 音符操作
    else if (StaveUtil.isNoteType(notation)) {
      // 升高音符在音阶的一个音
      if (e.keyCode === KeyCode.ArrowUp) {
        e.preventDefault();
        (notation as Note).pitchUp();
        // 降低
      } else if (e.keyCode === KeyCode.ArrowDown) {
        e.preventDefault();
        (notation as Note).pitchDown();
        // 断开符尾
      } else if (e.keyCode === KeyCode.Space) {
        e.preventDefault();
        (notation as Note).setEndSpacing();
      }
    }
    // 小节线操作
    else if (notation.ntype == NotationType.BarLine) {
      if (e.keyCode === KeyCode.Enter) {
        e.preventDefault();
        this.newline();
      }
    }
  }

  public playMidi() {
    let elems_firstPlayed = null
    let setNoteSVGColor = function(el, colorHash) {
      if (el.getAttribute('fill') && el.getAttribute('fill').includes('#')) {
        el.setAttribute('fill', colorHash)
      }

      if (el.getAttribute('stroke') && el.getAttribute('stroke').includes('#')) {
        el.setAttribute('stroke', colorHash)
      }
    }

    let setColorAndGetResumeBeforeColor = function(event) {
      let resumeColorHandle = function() {}

      // 播放完成 最后一个 event为 null
      if (!event || !event.elements) {
        resumeColorHandle = function() {
          console.log('play complete.')
        }
        return resumeColorHandle
      }
      // 且 播放完成 后会选中第一个 note
      let note_els = event.elements[0] || []
      if (elems_firstPlayed == note_els) {
        resumeColorHandle = function() {
          console.log('play complete.')
        }
        return resumeColorHandle
      }
      elems_firstPlayed || (elems_firstPlayed = note_els)

      // 高亮
      for (const note_el of note_els) {
        setNoteSVGColor(note_el, '#3D9AFC')
      }
      // 高亮恢复
      resumeColorHandle = function() {
        for (const note_el of note_els) {
          setNoteSVGColor(note_el, '#000000')
        }
      }
      return resumeColorHandle
    }

    let resumeBeforeColor = function() {}
    abcjs.midi.setSoundFont('/')
    abcjs.renderMidi('ctrl_midi', this.stave.abcString, {
      animate: {
        listener(abcjsElement, currentEvent, context) {
          console.log(abcjsElement, currentEvent, context)

          resumeBeforeColor()
          resumeBeforeColor = setColorAndGetResumeBeforeColor(currentEvent)
        },
        target: this.tuneObjectArray[0],
        qpm: this.stave.tempo.getContent(),
      },
      // voicesOff: false,
      inlineControls: { hide: true },
    })
    abcjs.midi.startPlaying(document.querySelector('.abcjs-inline-midi'))
  }
}
</script>

<style lang="less" scoped>
.home {
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
