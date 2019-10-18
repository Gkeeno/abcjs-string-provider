<template>
    <div class="canvasIndex">
        <div class="left">
            <div class="box">
                <div class="text">
                    <input
                        type="text"
                        v-model="someText"
                        @keydown="monitor($event)"
                    />
                    <button
                        class="addText btn"
                        @click="addText"
                    >添加文字</button>
                </div>
                <div class="btn_group">
                    <button
                        class="btn"
                        @click="addLine"
                    >对角线</button>
                    <button
                        class="btn"
                        @click="add('arrow')"
                    >箭头</button>
                    <button
                        class="btn"
                        @click="add('collect')"
                    >收音符</button>
                </div>
                <button
                    class="save btn"
                    @click="save"
                >保存</button>
                <button
                    class="read btn"
                    @click="read"
                >读取</button>
            </div>
            <div class="setp_box">
                <input
                    type="text"
                    v-model="stepName"
                    @keydown="monitor($event)"
                >
                <button
                    class="addText btn"
                    @click="addStep"
                >添加步骤</button>
            </div>
            <div
                class="step_arr"
                v-if="stepArr.length > 0"
            >
                <p
                    class="step_arr_item"
                    :class="{'active': currentCanvasIndex === index}"
                    v-for="(item, index) in stepArr"
                    :key="index"
                    @click="changeStep(index)"
                >{{item.name}}</p>
            </div>
            <div class="music_box">
                <div id="paper1"></div>
                <!-- <canvas
                    id="c"
                    width="660"
                    height="500"
                ></canvas> -->
                <div class="setp_group">
                    <canvas
                        class="canvas"
                        :id="'c' + index"
                        v-for="(item, index) in stepArr"
                        :key="index"
                        width="660"
                        height="500"
                    ></canvas>
                </div>
            </div>
        </div>
        <div class="show_box">
            <canvas
                class="canvas"
                :id="'b' + index"
                v-if="item.showFlag"
                v-for="(item, index) in stepArr"
                :key="index"
                width="660"
                height="500"
            ></canvas>
        </div>
        <!-- <canvas
            id="b"
            width="660"
            height="500"
        ></canvas> -->
    </div>
</template>

<script lang="ts">
import { fabric } from 'fabric';
import abcjs from 'abcjs';
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
enum KeyName {
    Delete,
    Backspace,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight
}
@Component
export default class canvasIndex extends Vue {
    public _canvas;
    public checked: Boolean = false;
    public someText: string = '';
    public jsonData: string = '';
    public selectObj;
    public panning: Boolean;
    public abcstring: string = `X: 24
T:Clouds Thicken
C:Paul Rosen
S:
M:6/8
L:1/8
Q:3/8=116
R:Creepy Jig
K:Em
|:"Em"EEE E2G|"C7"_B2A G2F|"Em"EEE E2G|"C7"_B2A "B7"=B3|"Em"EEE E2G|
"C7"_B2A G2F|"Em (Am7)"GFE "D (Bm7)"F2D|1"Em"E3-E3:|2"Em"E3-E2B|:"Em"e2e gfe|
"G"g2ab3|"Em"gfeg2e|"D"fedB2A|"Em"e2e gfe|"G"g2ab3|"Em"gfe"D"f2d|"Em"e3-e3:|`;
    public stepName: string = '';
    public stepArr: Array<object> = [];
    public currentCanvasIndex: number = 0;
    public currentShowIndex: number = 0;

    constructor() {
        super();
        window.document.onkeydown = e => this.keypressHandle(e);
    }
    public mounted() {
        const _this = this;
        const tuneObjectArray = abcjs.renderAbc('paper1', this.abcstring, {
            responsive: 'resize',
            staffwidth: 600,
            add_classes: true
        });
        fabric.Object.prototype.noScaleCache = false;
        // const canvas = (this._canvas = new fabric.Canvas('c'));
        // canvas.selection = false;
        // create a rectangle object
        // const rect = new fabric.Rect({
        //     id: 1,
        //     left: 150,
        //     top: 200,
        //     originX: 'left',
        //     originY: 'top',
        //     width: 150,
        //     height: 60,
        //     angle: -10,
        //     fill: 'rgba(255,0,0,0.5)',
        //     transparentCorners: false,
        //     borderColor: 'blue',
        //     allowTouchScrolling: false
        // });
        // const path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
        // path.set({ left: 320, top: 220, fill: 'red' });
        // canvas.add(path).setActiveObject(path);

        // canvas.add(rect).setActiveObject(rect);
        // canvas.on('mouse:down', options => {});
        // rect.on('moving', function(options) {
        //     // console.log(options);
        // });
        // rect.on('selected', options => {
        //   this.selectObj = rect;
        //   _this.$refs.removeBox.focus();
        // });
        // const itemArr = canvas.getObjects();
    }
    public monitor(event: Event) {
        event.cancelBubble = true;
    }
    public keypressHandle(e: KeyboardEvent) {
        if (
            e.key === KeyName[KeyName.Delete] ||
            e.key === KeyName[KeyName.Backspace]
        ) {
            e.preventDefault();
            // 删除
            this.remove();
        } else if (e.key === KeyName[KeyName.ArrowUp]) {
            var t = this._canvas.getActiveObject();
            t.bringForward();
        }
    }
    public addStep() {
        let { stepArr, stepName } = this.$data;
        if (!stepName) {
            alert('请输入');
            return;
        }
        if (stepArr.length > 0) {
            stepArr.forEach(item => {
                item['canvasObj'].discardActiveObject();
                item['canvasObj'].renderAll();
            });
        }
        stepArr = [...stepArr, { name: stepName, canvasObj: {} }];
        this.$set(this, 'stepArr', stepArr);
        this.$set(this, 'stepName', '');
        this.currentCanvasIndex = stepArr.length - 1;
        this.$nextTick(() => {
            let canvas = new fabric.Canvas(`c${stepArr.length - 1}`);
            canvas.selection = false;
            stepArr[stepArr.length - 1]['canvasObj'] = canvas;
            this.objectMoving();
        });
    }
    public changeStep(index) {
        let stepArr = this.stepArr;
        stepArr[this.currentCanvasIndex]['canvasObj'].discardActiveObject();
        stepArr[this.currentCanvasIndex]['canvasObj'].renderAll();
        this.$nextTick(() => {
            this.currentCanvasIndex = index;
            let canvasList: any = document.getElementsByClassName(
                'canvas-container'
            );
            for (let i = 0; i < canvasList.length; i++) {
                canvasList[i].classList.remove('active');
            }
            this.$nextTick(() => {
                canvasList[index].classList.add('active');
            });
        });
    }
    public addLine() {
        let { stepArr, currentCanvasIndex } = this.$data;
        if (stepArr.length === 0) {
            alert('请先添加步骤');
            return;
        }
        const line = new fabric.Line([100, 40, 10, 20], {
            fill: 'red',
            stroke: 'red',
            transparentCorners: false,
            cornerSize: 7
        });
        stepArr[currentCanvasIndex]['canvasObj'].add(line);
    }
    public add(type) {
        let { stepArr, currentCanvasIndex } = this.$data;
        if (stepArr.length === 0) {
            alert('请先添加步骤');
            return;
        }
        let imgUrl = '';
        if (type === 'arrow') {
            imgUrl = require('../../assets/canvasimg/arrow.png');
        } else {
            imgUrl = require('../../assets/canvasimg/collectNotes.png');
        }
        fabric.Image.fromURL(imgUrl, img => {
            const oImg = img.set({
                width: 400,
                height: 400,
                originX: 'left',
                originY: 'top',
                left: 20,
                top: 20,
                scaleX: 1,
                scaleY: 1,
                transparentCorners: false,
                centeredScaling: true,
                cornerSize: 7,
                cornerColor: '#ff7200'
            });
            oImg.scaleToWidth(40);
            oImg.scaleToHeight(40);
            stepArr[currentCanvasIndex]['canvasObj'].add(oImg);
        });
    }
    public addText() {
        let { stepArr, currentCanvasIndex } = this.$data;
        if (stepArr.length === 0) {
            alert('请先添加步骤');
            return;
        }
        if (!this.someText) {
            alert('请输入文字');
            return;
        }
        if (this.someText) {
            const text = new fabric.IText(this.someText, {
                // 绘制文本
                fontSize: 30,
                originX: 'center',
                originY: 'center',
                width: 150,
                left: 30,
                top: 40,
                fill: 'red',
                transparentCorners: false,
                cornerSize: 7
            });
            stepArr[currentCanvasIndex]['canvasObj'].add(text);
            this.someText = '';
        }
    }
    public save() {
        let stepArr = this.stepArr;
        if (stepArr.length == 0) {
            alert('请添加步骤再保存');
            return;
        }
        for (let i = 0; i < stepArr.length; i++) {
            stepArr[i]['jsonData'] = JSON.stringify(stepArr[i]['canvasObj']);
        }
        // console.log(JSON.stringify(canvas.toJSON()));
    }
    public read() {
        let { stepArr, currentShowIndex } = this.$data;
        if (stepArr.length == 0) {
            alert('请编辑再保存后再读取');
            return;
        }
        if (stepArr.length < currentShowIndex + 1) {
            alert('已读取完毕');
            return;
        }
        stepArr[currentShowIndex].showFlag = true;
        this.$set(this, 'stepArr', stepArr);
        this.$forceUpdate();
        this.$nextTick(() => {
            let canvas = new fabric.StaticCanvas(`b${currentShowIndex}`);
            canvas.loadFromJSON(stepArr[currentShowIndex].jsonData);
            this.$nextTick(() => {
                this.$set(this, 'currentShowIndex', currentShowIndex + 1);
            });
        });
        // if (this.jsonData) {
        //     const canvas = new fabric.StaticCanvas('b');
        //     // const canvas = this._canvas;
        //     console.log(canvas.loadFromJSON(this.jsonData));
        //     canvas.loadFromJSON(this.jsonData);
        //     console.log(canvas.item(1));
        // }
    }
    public remove() {
        let { stepArr, currentCanvasIndex } = this.$data;
        const el = stepArr[currentCanvasIndex]['canvasObj'].getActiveObject();
        stepArr[currentCanvasIndex]['canvasObj'].remove(el);
    }
    public objectMoving() {
        let { stepArr, currentCanvasIndex } = this.$data;
        stepArr[currentCanvasIndex]['canvasObj'].on('object:moving', e => {
            let obj = e.target;
            if (
                obj.height > obj.canvas.height ||
                obj.width > obj.canvas.width
            ) {
                return;
            }
            obj.setCoords();
            if (
                obj.getBoundingRect().top < 0 ||
                obj.getBoundingRect().left < 0
            ) {
                obj.top = Math.max(
                    obj.top,
                    obj.top - obj.getBoundingRect().top
                );
                obj.left = Math.max(
                    obj.left,
                    obj.left - obj.getBoundingRect().left
                );
            }
            if (
                obj.getBoundingRect().top + obj.getBoundingRect().height >
                    obj.canvas.height ||
                obj.getBoundingRect().left + obj.getBoundingRect().width >
                    obj.canvas.width
            ) {
                obj.top = Math.min(
                    obj.top,
                    obj.canvas.height -
                        obj.getBoundingRect().height +
                        obj.top -
                        obj.getBoundingRect().top
                );
                obj.left = Math.min(
                    obj.left,
                    obj.canvas.width -
                        obj.getBoundingRect().width +
                        obj.left -
                        obj.getBoundingRect().left
                );
            }
        });
    }
}
</script>

<style lang="less" scoped>
#c {
    border: 1px solid #ff7200;
}
#b {
    border: 1px solid blue;
    margin-left: 20px;
}
.canvasIndex {
    display: flex;
    padding-left: 30px;
    /deep/.canvas-container {
        position: absolute !important;
        top: 0;
        left: 0;
        z-index: 100;
        &.active {
            z-index: 101;
        }
    }
    .left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .setp_box {
        margin-bottom: 20px;
        .btn {
            margin-left: 10px;
        }
    }
    .step_arr {
        margin-bottom: 20px;
        display: flex;
        p {
            margin: 0 10px;
            text-decoration: underline;
            color: blue;
            cursor: pointer;
        }
        p:first-child {
            margin-left: 0;
        }
        .active {
            color: red;
        }
    }
    .show_box {
        position: relative;
        min-width: 662px;
        min-height: 500px;
        border: 1px solid #999;
        box-sizing: border-box;
        margin-left: 10px;
        .canvas {
            position: absolute !important;
            top: 0;
            left: 0;
            z-index: 100;
        }
    }
}
.box {
    display: flex;

    margin-bottom: 20px;
    .text {
        .btn {
            margin-left: 10px;
        }
    }
    .btn {
        margin-right: 10px;
    }
}
.music_box {
    position: relative;
    min-width: 662px;
    min-height: 500px;
    border: 1px solid #999;
    box-sizing: border-box;
}
</style>