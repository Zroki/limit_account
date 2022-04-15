<script lang="ts">
  import { fade } from 'svelte/transition';
  import Spinner from './ui/Spinner.svelte';
  import { getLimitsAccount } from '../helper';

  let accountLimits: LimitsV2[] = [];

  let isCollapse = true;
  let getData = false;

  async function toggleCollapseList() {
    isCollapse = !isCollapse;
    if (accountLimits.length === 0) {
      getData = true;
      accountLimits = await getLimitsAccount();
      getData = false;
    }
  }
</script>

<div class="main_block">
  <div class="account_info_button" on:click="{toggleCollapseList}">
    <span class="title">Лимиты аккаунта</span>
  </div>

  {#if !isCollapse}
    <div transition:fade="{{ duration: 300 }}" class="account_info">
      {#if getData}
        Получаем данные о лимитах аккаунта...
        <Spinner />
      {/if}
      {#each accountLimits as essense}
        <h3 class="title">{essense.headers}</h3>
        {#each essense.fields as field}
          <div class="item">
            <div class="label-limit">{field.label}</div>
            <div class="count-limit">
              {#if field.limit}
                <span
                  class="{field.current >= field.limit
                    ? 'over_limit'
                    : 'allowed_limit'}">{field.current}</span
                ><span>/</span><span>{field.limit}</span>
              {:else}
                <span>{field.current}</span>
              {/if}
            </div>
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
  .allowed_limit {
    font-weight: bold;
    color: green;
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
