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
            <img :src="item.img" alt @click="addNote(item.data)" />
          </div>
        </div>
      </div>
      <div class="vex_box">
        <div class="input_box">
          <div class="title input_item">
            <label for="abctitle">谱名</label>
            <input type="text" id="abctitle" v-model="abcTitle" />
          </div>
          <div class="author input_item">
            <label for="author_name">作者</label>
            <input type="text" id="author_name" v-model="author" />
          </div>
          <div class="timeSignature input_item">
            <label for="time_signature">拍号</label>
            <input type="text" id="time_signature" v-model="timeSignature" />
          </div>
          <div class="speed_input input_item">
            <label for="abc_speed">速率</label>
            <input type="text" id="abc_speed" v-model="speed" />
          </div>
        </div>
        <div class="svg_box">
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

@Component
export default class About extends Vue {
	public get tunebookString(): string {
		return this.abcstring;
	}

	public set tunebookString(v: string) {
		this.abcstring = v;
		this.renderAbc();
	}
	public abcstring: string = `X:1
T: Cooley's
M: 4/8
R: reel
K: Emin
|F/2 D1A2D3 BDAD|FDAD dAFDs|
`;
	public selectCharStart:number;
	public selectCharEnd:number;

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
		{ data: 'barline', img: require('../assets/image/clef11.png') }
	];
	@Provide() public symbolArr = [
		{ data: 'symbol1', img: require('../assets/image/attribute1.png') },
		{ data: 'symbol2', img: require('../assets/image/attribute2.png') },
		{ data: 'symbol3', img: require('../assets/image/attribute3.png') },
		{ data: 'symbol4', img: require('../assets/image/attribute4.png') },
		{ data: 'symbol5', img: require('../assets/image/attribute5.png') },
		// { data: 'symbol6', img: require('../assets/image/attribute6.png') }
	];
	@Provide() public abcTitle = '';
	@Provide() public author = '';
	@Provide() public timeSignature = '';
	@Provide() public speed = '';
	public renderAbc() {
		const that = this;
		const tuneObjectArray = abcjs.renderAbc('paper1', this.abcstring, {
			add_classes: true,
			clickListener: function(abcElem, tuneNumber, classes) { 
				// console.log(abcElem, tuneNumber, classes); 
				that.selectCharStart = abcElem.startChar
				that.selectCharEnd = abcElem.endChar
			},
		});
	}
	public resetSelectChars(){
		this.selectCharStart = 0;
		this.selectCharEnd = 0;
	}

	public mounted() {
		this.renderAbc();
	}

	public addNote(duration: NoteDuration) {
		const note = new Note(NoteKey.C2);
		this.tunebookString += note.toAbcString();
		console.log('after add ', this.tunebookString);
	}

	public delNote() {
		if(this.selectCharEnd === 0) return;
		// 删除所选字符串
		var forward =  this.tunebookString.substring(0,this.selectCharStart);
		var backward = this.tunebookString.substring(this.selectCharEnd);
		this.tunebookString = forward.concat(backward);
		console.log(forward,backward);
		
		this.resetSelectChars();
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
