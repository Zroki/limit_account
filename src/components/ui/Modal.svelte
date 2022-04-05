<script>
  export let open;
  export let overlayClasses = '';
  export let containerClasses = '';

  export let style = '';

  export let width = 'auto';
  export let height = 'auto';

  export let contentWidth = 'auto'
  export let contentHeight = 'auto'

  export let varticalIndent = '2em'
  export let horisontalIndent = '2em'

  export let minWidth = '30%';
  export let minHeight = '30%';

  export let padding = '15px';

  export let overlayColor = 'rgba(255, 255, 255, .6)';

  export let containerColor = '#fff';

  export let containerBorder = '1px solid #d3d6d7';

  export let containerShadow = '0 14px 24px 1px rgba(0, 0, 0, 0.1)';

  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  let portal;

  function dispatchClose() {
    dispatch('close');
  }

  function replaceTo(node) {}

  onMount(() => {
    document.body.appendChild(portal);
    return () => {
      if (portal.remove && portal.parent) {
        portal.remove();
      }
    };
  });
</script>

<div class:open bind:this="{portal}" class="portal">
  <div
    style="background-color: {overlayColor};"
    class="modal-overlay custom-scroll {overlayClasses}">
    <div
      style="width: {width};height: {height};border:{containerBorder};background-color:{containerColor};max-width:
      calc(100% - {horisontalIndent});max-height: calc(100% - {varticalIndent});min-width:
      {minWidth};min-height: {minHeight};padding: {padding};box-shadow: {containerShadow};
      {style}"
      class="modal-container {containerClasses}">
      <slot name="header" />
      <div
        style="width: {contentWidth};height: {contentHeight};"
        class="modal-content">
        <slot />
      </div>
      <slot name="footer" />
    </div>
  </div>
</div>

<style>
  .portal {
    display: none;
  }
  .portal.open {
    display: block;
  }
  .modal-overlay {
    box-sizing: border-box;
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-container {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .modal-content {
    flex: 1;
    cursor: default;
    overflow: auto;
  }
</style>
