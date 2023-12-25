<script lang="ts">
	import Button from './Button.svelte';

	export let message: string;
	export let onComplete: () => void;
</script>

<notice>
	<h2>{message}</h2>
	<Button onClick={onComplete} text="Continue" bgColor="black" fgColor="white" />
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
	h2 {
		color: white;
		font-size: 2rem;
		font-family: 'Great Vibes';
	}
</style>
