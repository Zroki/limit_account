<script>
  import { onMount } from "svelte";


  export let overlayClickClose = false;
  export let visible = false;

  export let width = 'auto';
  export let height = 'auto';

  export let border = 'none';

  export let padding = '20px';

  export let wordBreak = 'normal';

  export let style = '';

  let modal;

  function turnVisibility(event) {
    if (event.target !== event.currentTarget) {
      return false;
    }
    visible = !visible;
  }

  onMount(() => {
    document.body.insertAdjacentElement('afterbegin', modal);
  })
</script>

<div bind:this={modal} class:hide={!visible} class="certit-modal">
  <div class="overlay" on:click={ overlayClickClose ? turnVisibility : null } class:clicable={overlayClickClose}>
    <div class="main-window" >
      <div class="header">
        <slot name="header"/>
      </div>
      <div class="content" style="
        width: {width};
        height: {height};
        border: {border};
        padding: {padding};
        word-break: {wordBreak};
        {style}
      ">
        <slot />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</div>

<style>
  .certit-modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 99999999;
    top: 0;
    left: 0;
  }

  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, .5);
  }

  .main-window {
    min-width: 100px;
    min-height: 100px;
    background-color: white;
    border-radius: 6px;
    cursor: initial;
    overflow: initial;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }

  .clicable {
    cursor: pointer;
  }

  .hide {
    display: none;
  }

  .header {
    margin-top: 10px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    max-width: 90vw;
  }

  .footer {
    margin-bottom: 10px;
  }
</style>
