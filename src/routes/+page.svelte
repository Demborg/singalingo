<script>
	import AudioAnalyzer from '$lib/AudioAnalyzer.svelte';
</script>

<svelte:head>
	<title>Singalingo</title>
</svelte:head>

<main>
	<h1>Singalingo</h1>
	<AudioAnalyzer />
</main>

<style>
	@font-face {
		font-family: 'Great Vibes';
		src: url('/fonts/GreatVibes-Regular.ttf')
	}
	@font-face {
		font-family: 'Roboto Slab';
		src: url('/fonts/RobotoSlab-Regular.ttf')
	}

	main {
		text-align: center;
		font-family: 'Roboto Slab';
	}
	h1 {
		font-size: 3rem;
		font-family: 'Great Vibes';
	}
</style>
