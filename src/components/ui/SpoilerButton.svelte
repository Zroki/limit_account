<script>
  import Button from './Button.svelte';

  export let classes = '';
  export let style = '';
  export let header = 'Развернуть';
  export let hide = true;

  function changeVisibility() {
    hide = !hide;
  }
</script>

<div class="spoiler-button-holder {classes}" {style}>
  <Button on:click={changeVisibility} style="width: 100%">{header}</Button>
  <div class="spoiler-content" class:hide >
    <slot/>
  </div>
</div>

<style>
  .hide {
    display: none;
  }
  .spoiler-content {
    width: 100%;
  }
</style>
