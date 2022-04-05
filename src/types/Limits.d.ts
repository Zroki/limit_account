interface Limits {
    leads: {
        current: number,
        limit: number
      },
      contactsAndCompany: {
        current: number,
        limit: number
      },
      users: {
        current: number,
        limit: number
      },
      cf: {
        leads: {
          current: number,
          limit: number
        },
        contacts: {
          current: number,
          limit: number
        },
        company: {
          current: number,
          limit: number
        }
      }
}