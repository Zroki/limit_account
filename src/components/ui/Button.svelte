<script>
  import { onMount } from 'svelte';

  export let title = '';
  export let disabled = false;
  export let classes = '';
  export let style = '';
  export let colors = {};

  const defaultColors = {
    'background-color': '#4c8bf7',
    'border-color': '#4077d6',
    'color': '#fff',
    'hover:background-color': '#4d85e6',
    'hover:border-color': '#4077d6',
    'hover:color': '#fff',
  }

  let btnElem;
  let hovered = false;

  $: {
    styleManager(hovered);
  }

  function onHover() {
    hovered = true;
  }

  function onLeave() {
    hovered = false;
  }

  let styleManager = () => {};

  onMount(() => {
    styleManager = (hovered) => {
      if (hovered) {
        btnElem.style.backgroundColor = colors['hover:background-color'] || defaultColors['hover:background-color'];
        btnElem.style.borderColor = colors['hover:border-color'] || defaultColors['hover:border-color'];
        btnElem.style.color = colors['hover:color'] || defaultColors['hover:color'];
      } else {
        btnElem.style.backgroundColor = colors['background-color'] || defaultColors['background-color'];
        btnElem.style.borderColor = colors['border-color'] || defaultColors['border-color'];
        btnElem.style.color = colors['color'] || defaultColors['color'];
      }
    }
  });
</script>

<button
  bind:this="{btnElem}"
  disabled="{disabled}"
  title="{title}"
  on:click
  on:mouseover="{onHover}"
  on:mouseout="{onLeave}"
  class="btn {classes}"
  style="{style}"
>
  <slot />
</button>

<style>
  .btn {
    box-sizing: border-box;
    font-weight: bold;
    min-width: 90px;
    cursor: pointer;
    padding: 8px;
    border: 1px solid;
    border-radius: 3px;
    font-size: 14px;
    margin: 10px 0;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .btn:active {
    transform: translateY(1px);
  }
</style>
