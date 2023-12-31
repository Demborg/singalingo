<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';

	export let notes: string[];
	export let currentNoteIndex: number;
	export let currentNote: string | null;

	const renderNote = (note: string, stave: boolean = true): StaveNote => {
		let result = new StaveNote({
			keys: [note],
			duration: 'q'
		});

		if (note.includes('#')) {
			result.addModifier(new Accidental('#'));
		}

		if (!stave) {
			result.setStave(new Stave(0, 0, 0));
		}

		return result;
	};

	afterUpdate(() => {
		// Create an SVG renderer and attach it to the DIV element with id="output".
		const div = document.getElementById('notes') as HTMLDivElement | null;
		if (!div) return;
		div.innerHTML = '';
		const renderer = new Renderer(div, Renderer.Backends.SVG);

		// Configure the rendering context.
		renderer.resize(500, 100);
		const context = renderer.getContext();
		context.setFont('Arial', 10);

		// Create a stave of width 400 at position 10, 40.
		const stave = new Stave(0, 0, 500);

		// Add a clef and time signature.
		stave.addClef('treble').addTimeSignature('4/4');

		let rendered_notes = notes.map((note: string) => renderNote(note));
		for (let i = 0; i < currentNoteIndex; i++) {
			rendered_notes[i].setStyle({ fillStyle: 'green' });
		}

		let rendered_current_note = notes.map((note, index) => {
			if (index === currentNoteIndex && currentNote) {
				let rendered_note = renderNote(currentNote, false);
				rendered_note.setStyle({ fillStyle: 'blue' });
				return rendered_note;
			}
			let rendered_note = renderNote(note, false);
			if (index < currentNoteIndex) {
				rendered_note.setStyle({ fillStyle: 'green' });
			}
			return rendered_note;
		});

		const voices = [
			new Voice({ num_beats: 4, beat_value: 4 }).addTickables(rendered_notes),
			new Voice({ num_beats: 4, beat_value: 4 }).addTickables(rendered_current_note)
		];

		// Format and justify the notes to 400 pixels.
		new Formatter().joinVoices(voices).format(voices, 500);

		// Render voice
		stave.setContext(context).draw();
		voices.forEach((v) => v.draw(context, stave));
		div.childNodes.forEach((child) => {
			if (child.nodeName === 'svg') {
				(child as SVGElement).setAttribute('style', '');
				(child as SVGElement).setAttribute('width', '100%');
			}
		});
	});
</script>

<div id="notes"></div>
