function buildFetch(url = '', method = 'POST') {
  return fetch(url, {
    headers: {
      'x-requested-with': 'XMLHttpRequest',
    },
    method,
  });
}

async function getCurrentCountLeads() {
  const req = await buildFetch('/ajax/leads/list/');

  try {
    const res = await req.json();

    if (req.status === 200) {
      return res.response.summary.count;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

async function getCurrentCountContacts() {
  const req = await buildFetch('/api/v4/contacts', 'GET');

  try {
    const res = await req.json();

    if (req.status === 200) {
      return res._embedded.contacts.length;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

async function getCurrentCountCompaines() {
  const req = await buildFetch('/api/v4/companies', 'GET');

  try {
    const res = await req.json();

    if (req.status === 200) {
      return res._embedded.companies.length;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

async function getCurrentAccounts() {
  const req = await buildFetch('/private/api/v2/json/accounts/current', 'GET');

  try {
    const res = await req.json();
    if (req.status === 200) {
      return res.response.account.limits;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

async function getCountCustomFields() {
  const req = await buildFetch('/ajax/settings/custom_fields/');

  try {
    const res = await req.json();
    if (req.status === 200) {
      return res.response.params.tariff.cf_max_count;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

function getEntreeCount(entreeName = '') {
  return Object.values(AMOCRM.constant('account').cf).filter((item) => item[`ENTREE_${entreeName}`] === 1).length;
}

function getUserCount(active = true) {
  return Object.values(AMOCRM.constant('managers')).filter((user) => user.active === active).length;
}

async function sleep(ms) {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, ms);
  });
}

function getEmptyLimits() {
  return [
    {
      headers: 'Сущности',
      fields: [
        {
          current: 0,
          limit: 0,
          label: 'Сделки',
        },
        {
          current: 0,
          limit: 0,
          label: 'Контакты',
        },
        {
          current: 0,
          limit: 0,
          label: 'Компании',
        },
        {
          current: 0,
          limit: 0,
          label: 'Пользователи (активные)',
        },
        {
          current: 0,
          label: 'Пользователи (не активные)',
        },
      ],
    },
    {
      headers: 'Поля',
      fields: [
        {
          current: 0,
          limit: 0,
          label: 'Сделка',
        },
        {
          current: 0,
          limit: 0,
          label: 'Контакт',
        },
        {
          current: 0,
          limit: 0,
          label: 'Компания',
        },
      ],
    },
  ];
}

async function getBasicLimitsObj() {
  const accountLimits = await getCurrentAccounts();
  await sleep(300);
  const countCustomFields = await getCountCustomFields();
  await sleep(300);
  const leadsCount = await getCurrentCountLeads();
  await sleep(300);
  const contactsCount = await getCurrentCountContacts();
  await sleep(300);
  const companyCount = await getCurrentCountCompaines();
  await sleep(300);

  return {
    accountLimits,
    countCustomFields,
    leadsCount,
    contactsCount,
    companyCount,
  };
}

async function getLimitsAccount() {
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

export {
  getEntreeCount,
  getUserCount,
  getBasicLimitsObj,
  getEmptyLimits,
  getLimitsAccount,
};
