<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

	export let notes: string[];
	export let currentNoteIndex: number;

	const renderNote = (note: string) => {
		return new StaveNote({
			keys: [note],
			duration: 'q'
		});
	};

	afterUpdate(() => {
		// Create an SVG renderer and attach it to the DIV element with id="output".
		const div = document.getElementById('notes') as HTMLDivElement | null;
		if (!div) return;
        div.innerHTML = ''
		const renderer = new Renderer(div, Renderer.Backends.SVG);

		// Configure the rendering context.
		renderer.resize(500, 200);
		const context = renderer.getContext();
		context.setFont('Arial', 10);

		// Create a stave of width 400 at position 10, 40.
		const stave = new Stave(10, 40, 400);

		// Add a clef and time signature.
		stave.addClef('treble').addTimeSignature('4/4');


		let rendered_notes = notes.map(renderNote);
		for (let i = 0; i < currentNoteIndex; i++) {
			rendered_notes[i].setStyle({ fillStyle: 'green' });
		}

		// Create a voice in 4/4 and add above notes
		const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
		voice.addTickables(rendered_notes);

		// Format and justify the notes to 400 pixels.
		new Formatter().joinVoices([voice]).format([voice], 350);

		// Render voice
		stave.setContext(context).draw();
		voice.draw(context, stave);
	});
</script>

<html>
	<div id="notes"></div>
</html>
