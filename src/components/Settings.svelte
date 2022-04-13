<script lang="ts">
  import getDefaultSettings from "../defaults";

  export let hiddenInput = null;

  const settings = getSettings();

  function getSettings(): any | {} {
    const settingsString = hiddenInput.value;
    if (!settingsString) {
      return getDefaultSettings();
    }
    if (typeof settingsString === 'string') {
      return JSON.parse(settingsString);
    }
    return JSON.parse(JSON.stringify(settingsString));
  }

  function setSettings(newValue) {
    hiddenInput.value = JSON.stringify(newValue);
    hiddenInput.dispatchEvent(
      new Event('change', { bubbles: true, cancelable: true }),
    );
  }
</script>

<div class="container">

</div>

<style>

</style>
