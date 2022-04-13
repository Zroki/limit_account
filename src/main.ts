/// <reference path="./types/AmoCRM.d.ts" />
/// <reference path="./types/Limits.d.ts" />
/// <reference path="./types/Widget.d.ts" />

import AccountLimit from './components/AccountLimit.svelte';

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

  async function sleep(ms: number) {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, ms);
    });
  }

  async function getCurrentCountLeads() {
    const req = await fetch('/ajax/leads/list/', {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      method: 'POST',
    });
    try {
      const res = await req.json();
      return req.status !== 200 ? 0 : res.response.summary.count;
    } catch (err) {
      return 0;
    }
  }

  async function getCurrentCountCompaines(essense) {
    const req = await fetch(`/ajax/contacts/list/${essense}`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      method: 'POST',
    });
    try {
      const res = await req.json();
      return req.status !== 200 ? 0 : res.response.summary.persons_count;
    } catch (err) {
      return 0;
    }
  }

  async function getCurrentAccounts() {
    const req = await fetch('/private/api/v2/json/accounts/current', {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
    });
    try {
      const res = await req.json();
      return req.status !== 200 ? 0 : res.response.account.limits;
    } catch (err) {
      return 0;
    }
  }

  async function getCurrentCustomFields() {
    const req = await fetch('/ajax/settings/custom_fields/', {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      method: 'POST',
    });
    try {
      const res = await req.json();
      return req.status !== 200 ? 0 : res.response.params.tariff.cf_max_count;
    } catch (err) {
      return 0;
    }
  }

  async function getLimitsAccount(): Promise<Limits> {
    try {
      const res1 = await getCurrentAccounts();

      await sleep(300);
      const countCustomFields = await getCurrentCustomFields();

      await sleep(300);

      const leadsCount = await getCurrentCountLeads();
      await sleep(300);

      const contactsCount = await getCurrentCountCompaines('contacts');
      await sleep(300);

      const companyCount = await getCurrentCountCompaines('compaines');
      await sleep(300);

      return {
        entitys: {
          headers: 'Сущности',
          fields: {
            leads: {
              current: leadsCount,
              limit: res1.active_deals_count,
              label: 'Сделки',
            },
            contacts: {
              current: contactsCount,
              limit: 50,
              label: 'Контакты',
            },
            company: {
              current: companyCount,
              limit: 50,
              label: 'Компании',
            },
            usersActive: {
              current: Object.values(AMOCRM.constant('managers')).filter((user) => user.active).length,
              limit: res1.users_count,
              label: 'Пользователи (активные)',
            },
            usersNoActive: {
              current: Object.values(AMOCRM.constant('managers')).filter((user) => !user.active).length,
              label: 'Пользователи (не активные)',
            },
          },
        },
        cf: {
          headers: 'Поля',
          fields: {
            leads: {
              current: Object.values(AMOCRM.constant('account').cf).filter((item) => item.ENTREE_DEALS === 1).length,
              limit: countCustomFields,
              label: 'Сделка',
            },
            contacts: {
              current: Object.values(AMOCRM.constant('account').cf).filter((item) => item.ENTREE_CONTACTS === 1).length,
              limit: countCustomFields,
              label: 'Контакт',
            },
            company: {
              current: Object.values(AMOCRM.constant('account').cf).filter((item) => item.ENTREE_COMPANY === 1).length,
              limit: countCustomFields,
              label: 'Компания',
            },
          },
        },
      };
    } catch (error) {
      return {
        entitys: {
          headers: 'Сущности',
          fields: {
            leads: {
              current: 0,
              limit: 0,
              label: 'Сделки',
            },
            contacts: {
              current: 0,
              limit: 0,
              label: 'Контакты',
            },
            company: {
              current: 0,
              limit: 0,
              label: 'Компании',
            },
            usersActive: {
              current: 0,
              limit: 0,
              label: 'Пользователи (активные)',
            },
            usersNoActive: {
              current: 0,
              label: 'Пользователи (не активные)',
            },
          },
        },
        cf: {
          headers: 'Поля',
          fields: {
            leads: {
              current: 0,
              limit: 0,
              label: 'Сделка',
            },
            contacts: {
              current: 0,
              limit: 0,
              label: 'Контакт',
            },
            company: {
              current: 0,
              limit: 0,
              label: 'Компания',
            },
          },
        },
      };
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
