<script lang="ts">
	export let message: string;
	export let onComplete: () => void;
</script>

<notice>
	<h2>{message}</h2>
	<button on:click={onComplete}>Continue</button>
</notice>

<style>
	notice {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(1rem);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
