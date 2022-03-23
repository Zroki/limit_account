/// <reference path="./types/AmoCRM.d.ts" />
/// <reference path="./types/Widget.d.ts" />

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

  async function getCurrentCountEssense(essense) {
    const e = await fetch(`/ajax/${essense}/list/`, {
        headers: {
            "x-requested-with": "XMLHttpRequest"
        },
        method: "POST"
    });
    try {
        const n = await e.json();
        return 200 !== e.status ? 0 : "contacts" === essense ? n.response.summary.persons_count : "leads" === essense ? n.response.summary.count : 0
    } catch (t) {
        return 0
    }
}

  async function getLimitsAccount() {
    try {
      const req1 = await fetch("/private/api/v2/json/accounts/current", {
        headers: {
          "x-requested-with": "XMLHttpRequest"
        }
      });

      const req2 = await fetch("/ajax/settings/custom_fields/", {
        headers: {
          "x-requested-with": "XMLHttpRequest"
        },
        method: "POST",
      });

      const res1 = await req1.json();
      const res2 = await req2.json();

      return {
        leads: {
          current: 0,
          limit: res1.response.account.limits.active_deals_count
        },
        contacts: {
          current: 0,
          limit: res1.response.account.limits.contacts_count
        },
        users: {
          current: 0,
          limit: res1.response.account.limits.users_count
        },
        cf: {
          current: Object.keys(AMOCRM.constant('account')).length,
          limit: res2.response.params.tariff.cf_max_count
        }
      };
    } catch (error) {
      return {
        leads: {
          current: 0,
          limit: 0
        },
        contacts: {
          current: 0,
          limit: 0
        },
        users: {
          current: 0,
          limit: 0
        },
        cf: {
          current: 0,
          limit: 0
        }
      };
    }
  }

  widget.callbacks = {
    render: async () => {


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
