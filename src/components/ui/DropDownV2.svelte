<script>
  // grouped = true
  /* items =
          [
            {
              id: '',
              value: '',
              items: [
                {
                  id: '',
                  value: '',
                }
              ],
            }
          ]
  */

  // grouped = false
  /* items =
          [
            {
              id: '',
              value: ''
            }
          ]
  */

  // grouped = true
  // selected = { groupId: [ id, id, id ], }

  // grouped = false
  // selected = [ id, id, id ]

  import AmoCheckbox from './Checkbox.svelte';

  export let disabled = false;
  export let items = [];
  export let grouped = false;
  export let onSelect = null;
  export let opened = false;
  export let selected;

  if (!selected) {
    if (grouped) {
      selected = {};
      Object.values(items).forEach((group) => (selected[group.id] = []));
    } else {
      selected = [];
    }
  }

  // Добавляем недостающие группы и удаляем лишние
  if (grouped) {
    Object.values(items).forEach((group) => {
      if (!(group.id in selected)) {
        selected[group.id] = [];
      }
    });
    Object.keys(selected).forEach((group) => {
      if (!items.find((item) => item.id == group)) {
        delete selected[group];
      }
    });
  }

  $: {
    if (!items) {
      items = [];
    }
  }
  $: {
    if (!selected) {
      selected = grouped ? {} : [];
    }
  }

  let suggestContainer;
  let groupsById = {};

  if (grouped) {
    items.forEach((group) => {
      groupsById[group.id] = [...group.items];
    });
  }

  let allSelected = false;
  let someSelected = false;

  function isAllSelected() {
    if (grouped) {
      Object.keys(groupsById).forEach(group => {
        if (!groupsById[group].every(item => selected[group].includes(item))) {
          allSelected = false;
        }
      });
    } else {
      allSelected = items.every(item => selected.includes(item.id));
    }
  }

  function isSomeSelected() {
    if (grouped) {
      someSelected = false;

      Object.keys(groupsById).forEach(group => {
        if (groupsById[group].some(item => selected[group].includes(item.id))) {
          someSelected = true;
        }
      });
    } else {
      someSelected = items.some(item => selected.includes(item.id));
    }
  }

  function setSelected({ target }, item, group) {
    const checked = target.checked;

    if (grouped) {
      if (checked) {
        // Если группа передана, значит это объект группы
        if (group) {
          selected[group.id] = [...selected[group.id], item.id];
          if (selected[group.id].length === groupsById[group.id].length) {
            items = [...items];
          }
        } else {
          selected[item.id] = [...groupsById[item.id].map((gItem) => gItem.id)];
          items = [...items];
        }
      } else {
        if (group) {
          selected[group.id] = selected[group.id].filter(
            (gItem) => gItem !== item.id
          );
          items = [...items];
        } else {
          selected[item.id] = [];
          items = [...items];
        }
      }
    } else {
      if (checked) {
        selected = [...selected, item.id];
      } else {
        selected = selected.filter((sItem) => sItem !== item.id);
      }
    }
    isAllSelected();
    isSomeSelected();
    onSelect && onSelect(selected, item, checked, group?.id);
  }

  function selectAll({ target }) {
    let checked = target.checked;

    if (grouped) {
      if (checked) {
        Object.keys(groupsById).forEach((group) => {
          selected[group] = groupsById[group].map((gItem) => gItem.id);
        });
        items = [...items];
      } else {
        Object.keys(groupsById).forEach((group) => {
          selected[group] = [];
        });
        items = [...items];
      }
      someSelected = true;
      allSelected = true;
    } else {
      if (checked) {
        selected = items.map(item => item.id);
        items = [...items];
      } else {
        selected = [];
        items = [...items];
      }
      someSelected = false;
      allSelected = false;
    }
    onSelect && onSelect(selected, null, checked);
  }

  function isChecked(item, group) {
    if (grouped) {
      if (group) {
        return selected[group.id].includes(item.id);
      } else {
        // Все итемы принадлежащие этой группе выбраны
        return groupsById[item.id].every((gItem) =>
          selected[item.id].includes(gItem.id)
        );
      }
    } else {
      return selected.includes(item.id);
    }
  }

  function selectedCount() {
    let count = 0;

    if (grouped) {
      Object.keys(selected).forEach(group => count += selected[group].length);
    } else {
      count = selected.length;
    }

    return count;
  }

  function showList() {
    if (!disabled) {
      opened = !opened;
    }
  }

  function clickOutside({ target }) {
    if (!target.childElementCount && !target.parentElement) {
      return false;
    }
    if (!suggestContainer.contains(target) && target !== suggestContainer) {
      opened = false;
    }
  }

  function stopOpening(event) {
    if (suggestContainer.contains(event.target)) {
      event.stopPropagation();
    }
  }

  isAllSelected();
  isSomeSelected();
</script>

<svelte:body on:click="{clickOutside}" />

<div
  bind:this="{suggestContainer}"
  class:disabled
  class:opened
  class="wrap"
  on:click="{showList}"
>
  <ul class="list">
    <li class="item item-first">
      <div on:click="{stopOpening}" class="select-all">
        <AmoCheckbox
          disabled="{disabled}"
          on:change="{selectAll}"
          minus="{someSelected && !allSelected}"
          checked="{allSelected}"
        />
      </div>

      <div class="selected">
        {#if !opened && allSelected}
          <div>Все</div>
        {:else if !opened && !allSelected && someSelected}
          <div>Выбрано: {selectedCount()}</div>
        {:else}
          <div>Все</div>
        {/if}
      </div>
    </li>
  </ul>

  <div class="list_main" class:opened_list="{opened}">
    <ul class="list">
      {#each items as item, index (item.id)}
        <li class="item">
          <AmoCheckbox
            on:change="{(event) => {
              setSelected(event, item);
            }}"
            checked="{selected ? isChecked(item) : false}"
          >
            {item.value}
          </AmoCheckbox>
        </li>
        {#if grouped}
          {#each item.items as groupItem (groupItem.id)}
            <li class="group-item">
              <AmoCheckbox
                on:change="{(event) => {
                  setSelected(event, groupItem, item);
                }}"
                checked="{isChecked(groupItem, item, selected)}"
              >
                {groupItem.value}
              </AmoCheckbox>
            </li>
          {/each}
        {/if}
      {/each}
    </ul>
  </div>

  <div class="arrow"></div>
</div>

<style>
  .arrow {
    position: absolute;
    top: 15px;
    right: 12px;
    width: 6px;
    height: 6px;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    transform: rotate(45deg);
    cursor: pointer;
  }

  .opened .arrow {
    transform: rotate(-135deg);
    top: 17px;
  }

  .list_main {
    display: none;
  }

  .opened_list {
    display: block;
    position: absolute;
    width: 100%;
    background-color: white;
    z-index: 9;
  }

  .item.item-first {
    display: inline-flex;
  }

  .wrap :global(.label) {
    align-items: normal !important;
  }

  .wrap {
    position: relative;
    width: 100%;
    background-color: white;
  }

  .list {
    border: 1px solid #d3d7d8;
    border-radius: 3px;
    padding: 5px;
    padding-top: 9px;
    cursor: pointer;
  }

  .list_main .item {
    padding: 5px 0px;
    padding-left: 5px;
  }

  .list_main .group-item {
    padding: 5px 0px;
    padding-left: 15px;
  }

  .list_main .list {
    border-top: none;
    max-height: 175px;
    position: relative;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>
