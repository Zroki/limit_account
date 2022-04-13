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

  async function getCurrentCountEssense(essense) {
    const req = await fetch(`/ajax/${essense}/list/`, {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      method: 'POST',
    });
    try {
      const res = await req.json();
      return 200 !== req.status ? 0 : 'contacts' === essense ? res.response.summary.persons_count : 'leads' === essense ? res.response.summary.count : 0
    } catch (t) {
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
      return 200 !== req.status ? 0 : res.response.summary.persons_count;
    } catch (t) {
      return 0;
    }
  }

  async function getLimitsAccount(): Promise<Limits> {
    try {
      const req1 = await fetch('/private/api/v2/json/accounts/current', {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
      });

      await sleep(300);

      const req2 = await fetch('/ajax/settings/custom_fields/', {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
        method: 'POST',
      });

      const res1 = await req1.json();
      const res2 = await req2.json();

      await sleep(300);

      const leadsCount = await getCurrentCountEssense('leads');

      await sleep(300);

      const contactsAndCompanyCount = await getCurrentCountEssense('contacts');

      await sleep(300);

      const companyCount = await getCurrentCountCompaines('compaines');

      await sleep(300);

      // const contactCount = await getCurrentCountCompaines('contacts');

      return {
        leads: {
          current: leadsCount,
          limit: res1.response.account.limits.active_deals_count,
        },
        contactsAndCompany: {
          current: contactsAndCompanyCount,
          limit: res1.response.account.limits.contacts_count,
        },
        company: {
          current: companyCount,
          limit: 50,
        },
        users: {
          current: Object.values(AMOCRM.constant('managers')).filter((user) => user.active).length,
          limit: res1.response.account.limits.users_count,
        },
        cf: {
          leads: {
            current: Object.values(AMOCRM.constant('account').cf).filter((item) => item.ENTREE_DEALS === 1).length,
            limit: res2.response.params.tariff.cf_max_count,
          },
          contacts: {
            current: Object.values(AMOCRM.constant('account').cf).filter((item) => item.ENTREE_CONTACTS === 1).length,
            limit: res2.response.params.tariff.cf_max_count,
          },
          company: {
            current: Object.values(AMOCRM.constant('account').cf).filter((item) => item.ENTREE_COMPANY === 1).length,
            limit: res2.response.params.tariff.cf_max_count,
          },
        },
      };
    } catch (error) {
      return {
        leads: {
          current: 0,
          limit: 0,
        },
        contactsAndCompany: {
          current: 0,
          limit: 0,
        },
        company: {
          current: 0,
          limit: 0,
        },
        users: {
          current: 0,
          limit: 0,
        },
        cf: {
          leads: {
            current: 0,
            limit: 0,
          },
          contacts: {
            current: 0,
            limit: 0,
          },
          company: {
            current: 0,
            limit: 0,
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
