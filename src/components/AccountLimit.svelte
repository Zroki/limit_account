<script lang="ts">
  import { fade } from 'svelte/transition';

  export let accountLimits: Limits;

  let isCollapse = true;

  function toggleCollapseList() {
    isCollapse = !isCollapse;
  }
</script>

<div class="main_block">
  <div class="account_info_button" on:click="{toggleCollapseList}">
    <span class="title">Лимиты аккаунта</span>
  </div>

  {#if !isCollapse}
    <div transition:fade="{{ duration: 300 }}" class="account_info">
      {#each Object.values(accountLimits) as limit}
        <h3 class="title">{limit.headers}</h3>
        {#each Object.values(limit.fields) as field}
          <div class="item">
            <span>{field.label}</span>
            {#if field.limit}
              <span class="{field.current >= field.limit
                ? 'over_limit'
                : ''}"
              >{field.current}/{field.limit}</span>
            {:else}
              <span>{field.current}</span>
            {/if}
            
          </div>
        {/each}
      {/each}
    </div>
  {/if}
</div>

<style>
  .main_block {
    position: absolute;
    left: calc(50% - 150px);
  }
  .over_limit {
    font-weight: bold;
    color: red;
  }
  .account_info_button {
    border: 1px solid #dbdedf;
    border-radius: 3px;
    padding: 5px 80px;
    background-color: #4c8bf7;
    cursor: pointer;
    text-align: center;
  }
  .title {
    color: white;
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .account_info .title {
    color: black;
    text-align: center;
  }
  .account_info {
    border: 1px solid #dbdedf;
    border-radius: 0 0 3px 3px;
    position: relative;
    background-color: white;
    padding: 10px;
  }
  .account_info .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }
</style>
