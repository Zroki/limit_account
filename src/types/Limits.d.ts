interface Limits {
  entitys: {
    headers: string,
    fields: {
      leads: {
        current: number,
        limit: number,
        label: string,
      },
      contacts: {
        current: number,
        limit: number,
        label: string,
      },
      company: {
        current: number,
        limit: number,
        label: string,
      },
      usersActive: {
        current: number,
        limit: number,
        label: string,
      },
      usersNoActive: {
        current: number,
        label: string,
      }
    }
  },
  cf: {
    headers: string,
    fields: {
      leads: {
        current: number,
        limit: number,
        label: string,
      },
      contacts: {
        current: number,
        limit: number,
        label: string,
      },
      company: {
        current: number,
        limit: number,
        label: string,
      }
    }
  }
}
