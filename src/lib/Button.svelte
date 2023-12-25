<script lang="ts">
	export let onClick: () => void;
	export let text: string;
	export let bgColor: string = 'white';
	export let fgColor: string = 'black';
</script>

<button on:click={onClick} style="--bg-color: {bgColor}; --fg-color: {fgColor}">{text}</button>

<style>
	button {
		font-family: 'Roboto Slab';
		border-radius: 0%;
		background-color: var(--bg-color);
		color: var(--fg-color);
		border: 2px solid var(--fg-color);
	}
	button:hover {
		background-color: var(--fg-color);
		color: var(--bg-color);
		border: 2px solid var(--bg-color);
	}
</style>
