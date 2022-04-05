<script>
  // grouped = true
  /* items =
          [
            {
              id: '',
              value: '',
              bgColor: '',
              items: [
                {
                  id: '',
                  value: '',
                  group: ''
                  bgColor: '',
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

  import AmoCheckbox from './Checkbox.svelte';

  export let disabled = false;
  export let items = [];
  export let grouped = false;
  export let onSelect = null;
  export let selected = grouped ? { groups: [], items: [] } : [];

  if (!selected) {
    selected = grouped ? { groups: [], items: [] } : [];
  }

  $: {
    if (!items) {
      items = {};
    }
  }
  $: {
    if (!selected) {
      selected = grouped ? { groups: [], items: [] } : [];
    }
  }
  let opened = false;
  let itemsArr = Object.values(items);
  let suggestContainer;

  const newItemsArr = [];
  const groupsById = {};
  const itemsById = {};

  if (grouped) {
    itemsArr.forEach((group) => {
      newItemsArr.push({
        id: `group::${group.id}`,
        _id: group.id,
        type: 'group',
        value: group.value,
        bgColor: group.bgColor,
        checked: selected.groups.includes(group.id),
      });
      const groupObj = newItemsArr[newItemsArr.length - 1];
      groupsById[groupObj._id] = groupObj;
      if (group.items) {
        Object.values(group.items).forEach((item) => {
          const groupSelected = selected.groups.includes(group.id);
          newItemsArr.push({
            id: `item::${item.id}`,
            _id: item.id,
            group: group.id,
            value: item.value,
            bgColor: item.bgColor,
            type: 'item',
            disabled: groupSelected,
            checked: groupSelected || selected.items.includes(item.id),
          });
          const itemObj = newItemsArr[newItemsArr.length - 1];
          itemsById[itemObj._id] = itemObj;
        });
      }
    });
  } else {
    Object.values(itemsArr).forEach((item) => {
      newItemsArr.push({
        id: item.id,
        value: item.value,
        _id: item.id,
        type: 'item',
        checked: selected.includes(item.id),
      });
      const itemObj = newItemsArr[newItemsArr.length - 1];
      itemsById[itemObj._id] = itemObj;
    });
  }

  itemsArr = newItemsArr;

  function setState(items, selected) {
    if (grouped) {
      items.forEach((item) => {
        if (item.type === 'group') {
          const groupSelected = selected.groups.includes(item._id);
          item.checked = groupSelected;
        } else {
          item.checked = selected.items.includes(item._id);
        }
      });

      selected = { ...selected };
    } else {
      items.forEach((item) => {
        item.checked = selected.includes(item._id);
      });
    }
    return [...items];
  }

  function isSomeSelected(items, selectedItems) {
    return grouped
      ? items.some(item =>
          item.type === 'group'
            ? selectedItems.groups.includes(item._id)
            : selectedItems.items.includes(item._id)
        )
      : items.some(item => selectedItems.includes(item._id));
  }

  function isAllSelected(items, selectedItems) {
    return grouped
      ? items.every(
          item =>
            item.type !== 'group' || selectedItems.groups.includes(item._id)
        )
      : items.every(item => selectedItems.includes(item._id));
  }

  $: itemsArr = setState(itemsArr, selected);
  $: allSelected = isAllSelected(itemsArr, selected);
  $: someSelected = isSomeSelected(itemsArr, selected);

  function selectAll() {
    if (someSelected) {
      if (grouped) {
        selected.groups = [];
        selected.items = [];
        selected = { ...selected };
      } else {
        selected = [];
      }
      if (onSelect) {
        onSelect(selected);
      }
    } else {
      if (grouped) {
        selected.groups = itemsArr
          .filter(item => item.type === 'group')
          .map(item => item._id);
        selected.items = itemsArr
          .filter(item => item.type === 'item')
          .map(item => item._id);
        selected = { ...selected };
      } else {
        selected = itemsArr.map(item => item._id);
      }
      if (onSelect) {
        onSelect(selected);
      }
    }
  }

  function selectedCount(selected) {
    let count = 0;
    if (grouped) {
      selected.items.forEach(() => ++count);
    } else {
      selected.forEach(() => ++count);
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
    if (
      !suggestContainer.contains(target) &&
      target !== suggestContainer
    ) {
      opened = false;
    }
  }

  function setSelected(event, item) {
    const { checked } = event.target;
    if (checked) {
      if (grouped) {
        if (item.type === 'group') {
          selected.groups = [...selected.groups, item._id];

          // Закидываем все элементы группы в selected и чистим от дублей
          const newSelectedItems = itemsArr.filter(groupItem => groupItem.group === item._id).map(groupItem => groupItem._id);
          selected.items = [...selected.items, ...newSelectedItems].filter((groupItem, index, array) => array.indexOf(groupItem) === index);
        } else {
          selected.items = [...selected.items, item._id];

          const allGroupItems = itemsArr.filter(arrElem => arrElem.group === item.group);

          if (allGroupItems.every(arrElem => selected.items.includes(arrElem._id))) {
            selected.groups = [...selected.groups, item.group];
          }
        }
        selected = { ...selected };
      } else {
        selected = [...selected, item._id];
      }
      if (onSelect) {
        onSelect(selected, item);
      }
    } else {
      if (grouped) {
        if (item.type === 'group') {
          selected.groups = selected.groups.filter(
            selectedId => selectedId !== item._id
          );
          selected.items = selected.items.filter(
            selectedId => itemsById[selectedId].group !== item._id
          );
          selected = { ...selected };
        } else {
          const groupSelected = itemsArr.find(arrElem => arrElem.type === 'group' && arrElem._id === item.group && arrElem.checked);
          if (groupSelected) {
            selected.groups = selected.groups.filter(group => group !== groupSelected._id);
          }
          selected.items = selected.items.filter(
            selectedId => selectedId !== item._id
          );
          selected = { ...selected };
        }
      } else {
        selected = selected.filter(selectedId => selectedId !== item._id);
      }
      if (onSelect) {
        onSelect(selected, item);
      }
    }
  }

  function stopOpening(event) {
    if (suggestContainer.contains(event.target)) {
      event.stopPropagation();
    }
  }
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
          checked="{someSelected}"
        />
      </div>

      <div class="selected">
        {#if !opened && allSelected}
          <div>Всё</div>
        {:else if !opened && !allSelected && selectedCount(selected)}
          <div>Выбрано: {selectedCount(selected)}</div>
        {:else}
          <div>Всё</div>
        {/if}
      </div>
    </li>
  </ul>

  <div class="list_main" class:opened_list="{opened}">
    <ul class="list">
      {#each itemsArr as item, index (item.id)}
        <li
          class="item"
          style="{item.bgColor
            ? `background-color:${item.bgColor};`
            : ''}{grouped && item.type === 'item' ? 'padding-left: 16px;' : ''}"
        >
          <AmoCheckbox
            on:change="{(event) => {
              setSelected(event, item);
            }}"
            checked="{item.checked}"
          >
            {item.value}
          </AmoCheckbox>
        </li>
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

  .list_main .list {
    border-top: none;
    max-height: 175px;
    position: relative;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>
