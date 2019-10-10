<template>
	<div class="about">
		<section>
			<h1>{{title}}</h1>
			<button @click="dotest()">dotest</button>
		</section>
	</div>
</template>


<script lang="ts">
import Vue from "vue";
import abcjs from "abcjs/midi";

export default Vue.extend({
	data: function() {
		return {
			title: "dotest"
		};
	},
	methods: {
		dotest: function() {
			console.log("isSupportsMidi", abcjs.midi.deviceSupportsMidi());
    }
	}
});
</script>