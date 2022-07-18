<template>
    <v-layout column justify-center align-center style="height: 100%; width: 100%">
        <div>
            <div class="cell">
		        <div class="pl pl-hourglass"></div>
	        </div>
            <div style="text-align: center">{{message}}</div>
        </div>
    </v-layout>
</template>

<script>
export default {
    name: 'WaitingScreen',
    props: ['message']
}
</script>

<style>
.cell {
	flex-basis: 50%;
	padding: 1.5em;
}
.pl, .pl:before, .pl:after {
	animation-duration: 2s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
}
.pl {
	margin: 0 auto 1.5em auto;
	position: relative;
	width: 5em;
	height: 5em;
}
.pl:before, .pl:after {
	background: #01579B;
	content: "";
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 50%;
	transform-origin: 50% 100%;	
	clip-path: polygon(0 0,100% 0,50% 100%);
	-webkit-clip-path: polygon(0 0,100% 0,50% 100%);
}
.pl-hourglass {
	animation-name: hourglassA;
	background: #039BE5;
	clip-path: polygon(0 0,100% 0,50% 50%,100% 100%,0 100%,50% 50%);
	-webkit-clip-path: polygon(0 0,100% 0,50% 50%,100% 100%,0 100%,50% 50%);
}
.pl-hourglass:before, .pl-hourglass:after {
	position: static;
	clip-path: none;
	-webkit-clip-path: none;
}
.pl-hourglass:before {
	animation-name: hourglassB;
}
.pl-hourglass:after {
	animation-name: hourglassC;
}
@keyframes hourglassA {
	from, 75% { transform: rotate(0) }
	to { transform: rotate(180deg) }
}
@keyframes hourglassB {
	from { transform: scaleY(1) }
	50%, to { transform: scaleY(0) }
}
@keyframes hourglassC {
	from { transform: scaleY(0) }
	50%, to { transform: scaleY(1) }
}

</style>