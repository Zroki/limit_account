<script type="ts">
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
    <div class="account_info">
      <h3 class="title">Сущности</h3>
      <div class="item">
        <span>Сделки</span>
        <span
          class="{accountLimits.leads.current >= accountLimits.leads.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.leads.current}/{accountLimits.leads.limit}</span
        >
      </div>
      <div class="item">
        <span>Контакты и компании</span>
        <span
          class="{accountLimits.contactsAndCompany.current >=
          accountLimits.contactsAndCompany.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.contactsAndCompany.current}/{accountLimits
            .contactsAndCompany.limit}</span
        >
      </div>
      <div class="item">
        <span>Компании</span>
        <span
          class="{accountLimits.company.current >=
          accountLimits.company.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.company.current}/{accountLimits
            .company.limit}</span
        >
      </div>
      <div class="item">
        <span>Пользователи</span>
        <span
          class="{accountLimits.users.current >= accountLimits.users.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.users.current}/{accountLimits.users.limit}</span
        >
      </div>
      <h3 class="title">Поля</h3>
      <div class="item">
        <span>Сделка</span>
        <span
          class="{accountLimits.cf.leads.current >= accountLimits.cf.leads.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.cf.leads.current}/{accountLimits.cf.leads.limit}</span
        >
      </div>
      <div class="item">
        <span>Контакт</span>
        <span
          class="{accountLimits.cf.contacts.current >=
          accountLimits.cf.contacts.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.cf.contacts.current}/{accountLimits.cf.contacts
            .limit}</span
        >
      </div>
      <div class="item">
        <span>Компания</span>
        <span
          class="{accountLimits.cf.company.current >=
          accountLimits.cf.company.limit
            ? 'over_limit'
            : ''}"
          >{accountLimits.cf.company.current}/{accountLimits.cf.company
            .limit}</span
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .main_block {
    position: absolute;
    left: calc(50% - 150px);
  }
  .over_limit {
    color: red;
  }
  .account_info_button {
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px 80px;
    background-color: #4974f6;
    cursor: pointer;
    text-align: center;
  }
  .title {
    color: white;
    font-size: 17px;
    font-weight: bold;
  }
  .account_info .title {
    color: black;
    text-align: center;
  }
  .account_info {
    border: 1px solid black;
    border-radius: 0 0 3px 3px;
    position: relative;
    background-color: white;
    padding: 5px 10px;
  }
  .account_info .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
