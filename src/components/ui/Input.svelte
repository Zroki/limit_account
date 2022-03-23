<script>
  export let disabled = false;
  export let value = '';
  export let placeholder = '';
  export let onChange = null;
  export let title = '';
  export let caption = '';
  export let classes = '';
  export let style = '';
</script>

<label on:click {style} class="label {classes}">
  {caption}
  <input
    {placeholder}
    {title}
    {disabled}
    bind:value
    class="inp"
    on:change
    on:change="{({ target }) => onChange && onChange(target.value)}"
    on:input
    on:focus
    type="text" />
</label>

<style>
  .label {
    margin: 0;
    padding: 0;
    display: block;
    font-size: 15px;
    box-sizing: border-box;
  }
  .inp {
    margin: 0;
    width: 100%;
    display: block;
    border-radius: 3px;
    padding: 8px 9px 7px;
    color: #313942;
    background: #fff;
    box-sizing: border-box;
    border: 1px solid #dbdedf;
  }
  .inp:disabled {
    opacity: 0.6;
  }
</style>
