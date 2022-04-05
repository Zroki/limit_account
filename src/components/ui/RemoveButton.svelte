<script>
    export let onClick = () => {};
    export let classes = '';
</script>

<button on:click="{onClick}" class="button-input remove_button {classes}">
    <span class="button-input-inner">
      <span class="icon icon-inline icon-delete-trash"></span>
    </span>
</button>

<style>
  .button-input.remove_button {
    width: 34px;
    height: 34px;
  }
</style>