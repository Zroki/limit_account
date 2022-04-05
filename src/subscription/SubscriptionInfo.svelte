<script>
  import moment from 'moment';

  export let iconWidgetUrl = '';
  export let subscriptionInfo = '';
  export let isFree = false;

  if (typeof subscriptionInfo === 'string') {
    subscriptionInfo = JSON.parse(subscriptionInfo);
  } else if (!subscriptionInfo) {
    subscriptionInfo = {
      date_end: 'Отсутствует',
      date_start: 'Отсутствует',
      enabled: false,
    };
  }

  subscriptionInfo = subscriptionInfo.subscriptionInfo
    ? subscriptionInfo.subscriptionInfo
    : {
        date_end: 'Отсутствует',
        date_start: 'Отсутствует',
        enabled: false,
      };

  if (
    typeof subscriptionInfo.date_end === 'number' &&
    typeof subscriptionInfo.date_start === 'number'
  ) {
    subscriptionInfo.date_end = moment(subscriptionInfo.date_end * 1000).format(
      'DD.MM.YYYY'
    );
    subscriptionInfo.date_start = moment(
      subscriptionInfo.date_start * 1000
    ).format('DD.MM.YYYY');
  }

  let subsModal = {
    open: false,
    toggleOpen: () => {
      subsModal.open = !subsModal.open;

      subsModal = { ...subsModal };
    },
  };
</script>

<input
  class="toggle_subscription_block_button"
  type="button"
  value="Информация о подписке"
  on:click="{subsModal.toggleOpen}"
/>
{#if subsModal.open}
  <div class="subscription_block">
    <h2 class="title">Подписка</h2>
    <div class="content_block">
      <img
        class="icon_widget"
        src="{`${iconWidgetUrl}/logo_small.png`}"
        alt="Иконка виджета"
      />
      <div class="info back">
        {#if isFree}
          <p style="font-size: 20px;">Бесплатная версия виджета</p>
          {:else}
          <p style="font-size: 20px;">Платная версия виджета</p>
        {/if}
        
      </div>

      <div class="info front">
        <h3 class="content">
          {#if isFree}
            Дата начала: <span class="item">-</span>
            {:else}
            Дата начала: <span class="item">{subscriptionInfo.date_start}</span>
          {/if}
        </h3>
        <h3 class="content">
          {#if isFree}
            Дата окончания: <span class="item">Бессрочно</span>
          {:else}
            Дата окончания: <span class="item">{subscriptionInfo.date_end}</span>
          {/if}
        </h3>
        <h3 class="content">
          {#if isFree}
            Состояние подписки: <span class="item active">Активна</span>
          {:else}
            Состояние подписки: <span
            class="{subscriptionInfo.enabled
              ? 'item active'
              : 'item subsc_status'}"
          >{subscriptionInfo.enabled ? 'Активна' : 'Истекла'}</span>
          {/if}
        </h3>
      </div>
    </div>
  </div>
{/if}

<style>
  .subsc_status {
    color: red;
  }

  .active {
    color: green;
  }

  .content_block {
    position: relative;
    display: flex;
    align-items: center;
  }

  .back {
    transform: rotateY(180deg);
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    background-color: #f0f0f0!important;
  }

  .content_block:hover .front {transform: rotateY(180deg);}
  .content_block:hover .back {transform: rotateY(360deg);}

  .info {
    background-color: #f0f0f0;
    position: absolute;
    width: 50%;
    top: 0;
    backface-visibility: hidden;
    transition: 0.7s;
    right: 0;
    font-size: 13px;
    padding: 5px;
    border-radius: 3px;
    box-shadow: #00000069 -2px -1px 7px 1px;
  }

  .item {
    font-weight: bold;
  }

  .content {
    border-bottom: 1px solid black;
    padding: 2px 5px;
  }

  .icon_widget {
    border-radius: 50%;
    width: 40%;
    height: 40%;
    margin-right: 10px;
  }

  .subscription_block {
    position: absolute;
    border: 1px solid grey;
    width: 30%;
    right: 10px;
    bottom: 40px;
    background-color: #4c8bf7;
    border-radius: 0px 0px 10px 10px;
    height: 160px;
    z-index: 999;
    padding: 5px;
  }

  .title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
  }

  .toggle_subscription_block_button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #4c8bf7;
    border: 1px solid #0037ff;
    font-weight: bold;
    color: white;
    padding: 3px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
</style>
