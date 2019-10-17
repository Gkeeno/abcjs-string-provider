<template>
    <div class="canvasIndex">
        <canvas
            id="c"
            width="800"
            height="800"
        ></canvas>
        <div class="box">
            <div class="btn_group">
                <button
                    class="btn"
                    @click="add('arrow')"
                >箭头</button>
                <button
                    class="btn"
                    @click="add('collect')"
                >收音符</button>
            </div>
            <div class="text">
                <input
                    type="text"
                    v-model="someText"
                />
                <button
                    class="addText"
                    @click="addText"
                >添加文字</button>
            </div>
            <button
                class="save"
                @click="save"
            >保存</button>
            <button
                class="read"
                @click="read"
            >读取</button>
        </div>
        <canvas
            id="b"
            width="600"
            height="600"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { fabric } from 'fabric';
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
enum KeyName {
    Delete,
    Backspace
}
@Component
export default class canvasIndex extends Vue {
    public _canvas;
    public checked: Boolean = false;
    public someText: string = '';
    public jsonData: string = '';
    public selectId: number = 0;
    public selectObj;

    constructor() {
        super();
        window.document.onkeydown = e => this.keypressHandle(e);
    }
    public mounted() {
        const _this = this;
        fabric.Object.prototype.noScaleCache = false;
        /*
	strokeUniform works better without scalingCache
	Objects in group are not scaled directly, so stroke uniform will not have effect.
*/

        const canvas = (this._canvas = new fabric.Canvas('c'));

        // create a rectangle object
        const rect = new fabric.Rect({
            id: 1,
            left: 150,
            top: 200,
            originX: 'left',
            originY: 'top',
            width: 150,
            height: 60,
            angle: -10,
            fill: 'rgba(255,0,0,0.5)',
            transparentCorners: false,
            borderColor: 'blue',
            allowTouchScrolling: false
        });
        const path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
        path.set({ left: 320, top: 220, fill: 'red' });
        canvas.add(path).setActiveObject(path);

        canvas.add(rect).setActiveObject(rect);
        // canvas.on('mouse:down', options => {});
        // rect.on('moving', function(options) {
        //     // console.log(options);
        // });
        // rect.on('selected', options => {
        //   this.selectObj = rect;
        //   _this.$refs.removeBox.focus();
        // });
        const itemArr = canvas.getObjects();
        itemArr.forEach(item => {
            item.on('selected', options => {
                this.selectObj = item;
            });
        });
    }
    public updated() {
        const itemArr = this._canvas.getObjects();
        console.log(itemArr);
        itemArr.forEach(item => {
            item.on('selected', options => {
                this.selectObj = item;
            });
        });
    }
    public keypressHandle(e: KeyboardEvent) {
        if (
            e.key === KeyName[KeyName.Delete] ||
            e.key === KeyName[KeyName.Backspace]
        ) {
            e.preventDefault();
            // 删除
            this.remove();
        }
    }
    public add(type) {
        let imgUrl = '';
        if (type === 'arrow') {
            imgUrl = require('../../assets/canvasimg/arrow.png');
        } else {
            imgUrl = require('../../assets/canvasimg/collectNotes.png');
        }
        fabric.Image.fromURL(imgUrl, img => {
            const oImg = img
                .set({
                    width: 400,
                    height: 400,
                    originX: 'left',
                    originY: 'top',
                    left: 20,
                    top: 20
                })
                .scale(0.25);
            this._canvas.add(oImg);
        });
    }
    public addText() {
        if (this.someText) {
            const text = new fabric.IText(this.someText, {
                // 绘制文本
                fontSize: 30,
                originX: 'center',
                originY: 'center',
                width: 150,
                left: 30,
                top: 40,
                fill: '#D81B60'
            });
            this._canvas.add(text).setActiveObject(text);
            this.someText = '';
        }
    }
    public save() {
        const canvas = this._canvas;
        this.jsonData = JSON.stringify(canvas.toJSON());
        // console.log(JSON.stringify(canvas.toJSON()));
    }
    public read() {
        if (this.jsonData) {
            const canvas = new fabric.StaticCanvas('b');
            // const canvas = this._canvas;
            console.log(canvas.loadFromJSON(this.jsonData));
            canvas.loadFromJSON(this.jsonData);
            console.log(canvas.item(1));
        }
    }
    public remove() {
        this._canvas.remove(this.selectObj);
    }
}
</script>

<style lang="less" scoped>
#c {
    border: 1px solid #ff7200;
}
#b {
    border: 1px solid blue;
}
.canvasIndex {
    display: flex;
}
</style>