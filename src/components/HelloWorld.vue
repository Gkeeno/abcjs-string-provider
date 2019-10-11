<template>
	<div class="hello">
		<h1>{{ msg }}</h1>

		<section>
			<h1>1. createStave</h1>
			<button @click="createStave()">create stave</button>
			<div id="paper1" class="sheet-music"></div>
		</section>

		<section>
			<h1 class="abcjs-cursor cursor">2. playStave</h1>
			<button @click="startPlaying()">startPlaying</button>
			<br />
			<button @click="stopPlaying()">stopPlaying</button>
			<br />
			<button @click="pausePlaying()">pausePlaying</button>
			<br />
			<button @click="restartPlaying()">restartPlaying</button>
			<div id="ctrl_midi"></div>
		</section>

		<section>
			<h1 class="abcjs-cursor cursor">3. notationRenderEngine</h1>
			do some logic here...
			<button @click="doSomeLogic()">doSomeLogic</button>
		</section>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import abcjs from "abcjs/midi";

@Component
export default class HelloWorld extends Vue {
	@Prop() private msg!: string;

tunebookString: string = `X:1
T: Cooley's
M: 4/8
R: reel
K: Emin
|F/2 D1A2D3 BDAD|FDAD dAFDs|
`;
// 	tunebookString: string = `X:1
// M:4/4
// L:1/4
// %%stretchlast .7
// Q:1/4=100
// T:Piano
// %%staves {(PianoRightHand) (PianoLeftHand)}
// V:PianoRightHand clef=treble
// V:PianoLeftHand clef=bass
// K:C
// [V: PianoRightHand] !mp!e2f2 e2d2 c2B2 A4|!>(!B2d2 g4 c6 !>)!e2|!p![G4e4] z4 A4 G4|c12 z4|[A12f12] [g4d4]|z4 !<(!B4 !<)![A8c8]|
// !mf!A4 z4 d8|B8 [G4c4] z4|f2A2 c4 f4 g4|[f12d12] e4|!<(!A4 A4 c2e2 !<)!g4|!f!e8 z8|
// [A4d4] z4 A8|BcBA G4 c4 G2B2|A2G2 A2B2 c4 B2G2|c12 z4|]
// [V: PianoLeftHand] [E,12C,12] F,4|[G,8D,8] [C,8E,8]|G,4 C,4 C,4 B,,A,,C,B,,|A,,12 z4|A,,4 B,,4 C,2D,2 B,,C,D,E,|C,2E,2 G,4 E,2F,2 G,4|
// F,4 A,4 [A,8F,8]|G,2F,2 E,2D,2 [C,4E,4] z4|[F,8A,8] [D,4A,4] z4|F,2G,2 A,2F,2 D,2F,2 C,2B,,2|C,4 F,A,D,F, E,4 z4|C,8 z8|
// F,4 E,4 F,4 A,4|[D,8G,8] E,4 z4|C,4 [C,4F,4] z4 G,4|C,12 z4|]
// `;
	tuneObjectArray: any;
	animateIsPlaying: boolean = false;

	createStave() {
		// a. create stave on "paper1"
		var tunebookString = this.tunebookString;
		var tuneObjectArray = abcjs.renderAbc("paper1", tunebookString, {
			add_classes: true
		});
		this.tuneObjectArray = tuneObjectArray;
		console.log("tuneObjectArray", tuneObjectArray);

		// b. and render midi
		abcjs.midi.setSoundFont("./");
		abcjs.renderMidi("ctrl_midi", tunebookString, {
			animate: {
				listener: function(abcjsElement, currentEvent, context) {},
				target: tuneObjectArray[0],
				qpm: 120
			}
			// voicesOff: false,
			// inlineControls: { hide: true }
		});
	}

	startPlaying() {
		// midi
		abcjs.midi.startPlaying(document.querySelector(".abcjs-inline-midi"));
		// animate (会和声音不同步，用 midi 回调替代)
		var tunes = this.tuneObjectArray;
		var elem_paper = document.querySelectorAll("#paper1")[0];
		abcjs.startAnimation(elem_paper, tunes[0], { showCursor: true });
		this.animateIsPlaying = true;
	}
	stopPlaying() {
		abcjs.midi.stopPlaying();
		// abcjs.stopAnimation();
		// this.animateIsPlaying = false;
	}
	pausePlaying() {
		abcjs.midi.startPlaying(document.querySelector(".abcjs-inline-midi"));
		// abcjs.pauseAnimation(this.animateIsPlaying);
		// this.animateIsPlaying = !this.animateIsPlaying;
	}
	restartPlaying() {
		abcjs.midi.restartPlaying();
	}

	doSomeLogic(){

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/deep/.abcjs-cursor.cursor{
	color: red;
	background: black;
}

ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	// color: #42b983;
	color: blue;
}
</style>
