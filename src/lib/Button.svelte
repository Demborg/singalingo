<script lang="ts">
    export let onClick: () => void;
    export let text: string;
</script>

<button on:click={onClick}>{text}</button>

<style>
    button {
        font-family: 'Roboto Slab';
        border-radius: 0%;
        background-color: white;
        border: 2px solid black;
    }
    button:hover {
        background-color: black;
        color: white;
    }
</style>