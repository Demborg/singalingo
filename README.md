# Singalingo

I want to build a "duolingo meets singstar" app for a hackathon here at work to learn a bit more about musical notation and potentially increase my own pitch accuracy.

## The idea is to do something like this:
* We display a short phrase of music
* We optionally play that short phrase
* The user tries to sing the phrase
* We run fft on the microphone of the device to see if the major frequency of the voice hits the tones

## Proposed tech stack
* I want to host this as a website primarily targeted for mobile
* I want this to run as much as possible in the frontend, ideally only being served a midi file or something from a backend and then running fft and creating the music notation on device. However there  might be a flask backend service where we can ofboard hard work to
* I would like to build the frontend in svelte

## Partial goals
* We can listen to the microphone and run fft on that
* We can take the maxima of the fft spectrum and present that as a note in western notation.
* We can play midi in the browser
* We can render midi as notes in western notation to the front end
* We can classify if a single note is correctly sung

## Things i need:
* A js fft library for listening to the mic in the browser
* A js music library for visualizing and or playing the midi
* A way of translating frequncy to note

## Questions
* Do you think this project makes sense?
* Do you have some proposals for good tools to use?
* Is something ill defined or in need of clarification?
* What do you think the major hurdles will be?

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
