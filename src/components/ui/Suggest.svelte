<script>
  /*
    items = [
      {
        id: '',
        value: ''
      }
    ]
   */

  export let disabled = false;
  export let items = [];
  export let selected = null;
  export let closeOnSelect = true;
  export let onSelect = null;
  export let placeholder = '';
  export let classes = '';
  export let style = '';

  import AmoInput from './Input.svelte';

  let opened = false;
  let container;
  let query = '';

  $: {
    if (!items) {
      items = [];
    }
  }

  $: selectedItem = items.find((item) => String(item.id) === String(selected));


  function selectItem(item) {
    selectedItem = item;
    selected = item.id;
    onSelect && onSelect(selected, selectedItem);
    if (closeOnSelect) {
      opened = false;
    }
  }

  function showList() {
    query = '';
    opened = true;
  }

  function hideList(event) {
    if (
      opened &&
      !container.contains(event.target) &&
      container !== event.target
    ) {
      opened = false;
    }
  }

  function setQuery(event) {
    query = event.target.value;
  }

  function highlight(str, query) {
    if (!query) {
      return str;
    }
    const index = str.toLowerCase().indexOf(query.toLowerCase());
    const wrapPart = str.slice(index, index + query.length);
    return str.replace(
      wrapPart,
      `<b style="font-weight:bold;">${wrapPart}</b>`
    );
  }
</script>

<svelte:body on:click="{hideList}" />

<div {style} bind:this="{container}" class="wrap {classes}">
  <AmoInput
    placeholder="{placeholder}"
    classes="suggest-input"
    on:input="{setQuery}"
    on:focus="{showList}"
    value="{selectedItem ? selectedItem.value : ''}"
    disabled="{disabled}" />
  <ul class:opened class="items-list">
    {#each items as item, index (item.id)}
      {#if !query || item.value.toLowerCase().includes(query.toLowerCase())}
        <li
          tabindex="0"
          on:click="{() => {
            selectItem(item);
          }}"
          class="item">
          {@html highlight(item.value, query)}
        </li>
      {/if}
    {/each}
  </ul>
  <div on:click="{showList}" class:opened class:disabled class="arrow"></div>
</div>

<style>
  .wrap {
    padding: 0;
    margin: 0;
    position: relative;
    display: block;
  }

  .wrap :global(.suggest-input .inp) {
    border-bottom-width: 2px;
  }

  .items-list {
    background-color: #fff;
    display: none;
    overflow: auto;
    max-height: 220px;
    min-height: 15px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #dadadb;
    border-radius: 3px;
    margin: 0;
    position: absolute;
    top: calc(100% - 2px);
    padding: 0;
    list-style: none;
  }

  .items-list.opened {
    list-style: none;
    z-index: 9999;
    display: block;
  }

  .item {
    padding: 5px 6px;
    white-space: nowrap;
  }

  .item:hover,
  .item:focus {
    cursor: pointer;
    background-color: #efefef;
  }

  .arrow {
    position: absolute;
    top: calc(50% - 5px);
    right: 12px;
    width: 6px;
    height: 6px;
    border-bottom: 1px solid #303030;
    border-right: 1px solid #303030;
    transform: rotate(45deg);
  }

  .arrow.disabled {
    opacity: 0.5;
  }

  .arrow.opened {
    display: none;
  }
</style>
