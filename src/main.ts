/// <reference path="./types/AmoCRM.d.ts" />
/// <reference path="./types/Limits.d.ts" />
/// <reference path="./types/Widget.d.ts" />

import AccountLimit from './components/AccountLimit.svelte';

import {
  getEntreeCount,
  getUserCount,
  getBasicLimitsObj,
  getEmptyLimits,
} from './helper';

function widgetConstructor() {
  const checkDoubleInitialization = (key: string) => {
    if (window[key]) {
      throw new Error('Двойная инициализация виджета.');
    }
    // @ts-ignore
    window[key] = true;
  };
  checkDoubleInitialization('__limit_account_v2__');

  const widget: Widget = this;

  async function getLimitsAccount(): Promise<LimitsV2[]> {
    try {
      const accountLimitsObj = await getBasicLimitsObj();

      return [
        {
          headers: 'Сущности',
          fields: [
            {
              current: accountLimitsObj.leadsCount,
              limit: accountLimitsObj.accountLimits.active_deals_count,
              label: 'Сделки',
            },
            {
              current: accountLimitsObj.contactsCount,
              limit: 50,
              label: 'Контакты',
            },
            {
              current: accountLimitsObj.companyCount,
              limit: 50,
              label: 'Компании',
            },
            {
              current: getUserCount(),
              limit: accountLimitsObj.accountLimits.users_count,
              label: 'Пользователи (активные)',
            },
            {
              current: getUserCount(false),
              label: 'Пользователи (не активные)',
            },
          ],
        },
        {
          headers: 'Поля',
          fields: [
            {
              current: getEntreeCount('DEALS'),
              limit: accountLimitsObj.countCustomFields,
              label: 'Сделка',
            },
            {
              current: getEntreeCount('CONTACTS'),
              limit: accountLimitsObj.countCustomFields,
              label: 'Контакт',
            },
            {
              current: getEntreeCount('COMPANY'),
              limit: accountLimitsObj.countCustomFields,
              label: 'Компания',
            },
          ],
        },
      ];
    } catch (error) {
      return getEmptyLimits();
    }
  }

  widget.callbacks = {
    render: async () => {
      if (AMOCRM.widgets.system.area !== 'settings') {
        return true;
      }

      const accountLimits = await getLimitsAccount();

      new AccountLimit({
        target: document.querySelector('.public-integrations-list'),
        props: {
          accountLimits,
        },
      });

      return true;
    },
    bind_actions: () => true,
    onSave: () => true,
    init: () => true,
    settings: () => true,
  };

  return widget;
}

export default widgetConstructor;
