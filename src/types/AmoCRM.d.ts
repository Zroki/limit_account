interface User {
    amojo_id: string,
    api_key: string,
    group_mates_ids: object,
    id: number,
    login: string,
    name: string,
    personal_mobile: string,
    settings: object,
    uuid: string
}

interface Manager {
    active: boolean
    amo_profile_id: object
    amojo_id: string
    avatar: string
    free_user: string
    group: string
    id: string
    is_admin: string
    login: string
    option: string
    status: string
    title: string
}

interface CF {
    ACCOUNT_ID: number
    CATALOG_ID: object
    CODE: string
    DESCRIPTION: string
    DISABLED: number
    ELEMENT_TYPES: object
    ENTREE_CATALOG: number
    ENTREE_COMPANY: number
    ENTREE_CONTACTS: number
    ENTREE_CUSTOMERS: number
    ENTREE_DEALS: number
    ID: number
    MULTIPLE: string
    NAME: string
    ORIGIN: string
    PREDEFINED: string
    SETTINGS: object
    SORT: number
    TYPE_ID: number
    deleted_at: object
}

interface Account {
    amo_messenger: object
    amojo_enabled: boolean
    amojo_id: string
    amojo_rights: object
    amojo_server: string
    catalogs_available: boolean
    cf: {
        [id: string]: CF
    }
    country: string
    currency: string
    customers_enabled: boolean
    date_format: string
    date_pattern: string
    helpbot_enabled: boolean
    id: number
    invoices: object
    is_contact_name_display_order_first: boolean
    is_rpa_available: boolean
    language: string
    name: string
    notifications_enabled: boolean
    paid_from: number
    paid_till: number
    pay_type: string
    predefined_cf: AmoEnums
    products: object
    subdomain: string
    suppliers: object
    talks_auto_close_delay: number
    tariffName: string
    time_format: string
    timezone: string
    top_level_domain: string
    unsorted_on: string
    users: object
    version: number
}

interface AmoEnums {
    EMAIL: {
        ENUMS: {
            [id: string]: {
                ID: number
                SORT: number
                TOTAL: number
                VALUE: string
                code: null
            }
        }
        TYPE_ID: number
        NAME: string
        ENUMS_NAMES: {
            [name: string]: {
                FULL: string
                MEDIUM: string
                SHORT: string
            }
        }
        ID: number
    }
    PHONE: {
        ENUMS: {
            [id: string]: {
                ID: number
                SORT: number
                TOTAL: number
                VALUE: string
                code: null
            }
        }
        TYPE_ID: number
        NAME: string
        ENUMS_NAMES: {
            [name: string]: {
                FULL: string
                MEDIUM: string
                SHORT: string
            }
        }
        ID: number
    }
}

interface Groups {
  [groupId: string]: string
}

type Managers = {
    [id: number]: Manager
}

declare namespace AMOCRM {
  function constant(param: 'user'): User
  function constant(param: 'groups'): Groups
    function constant(param: 'managers'): Managers
    function constant(param: 'account'): Account

    const notifications: {
        show_message: (obj: { text?: string, header: string }) => undefined
        show_message_error: (obj: { text?: string, header: string }) => undefined
        show_notification: (obj: { text?: string, header: string }) => undefined
    }
    const widgets: {
        list: {
            langs: {
                widget: {
                    description: string
                    name: string
                    short_description: string
                }
            }
            params: {
                images_path: string
            }
        }[]
        system: {
            amohash: string
            amouser: string
            amouser_id: number
            area: string
            domain: string
            server: string
            subdomain: string
        }
    }
    const data: {
        current_entity: string
        current_card: {
            id: number
            main_user: number
            is_card: boolean
            current_entity: string
        }
    }
    const system: {
        format: {
            date: {
                calendar: string
                calendar_no_year: string
                date: string
                date_short: string
                full: string
                time: string
            }
            time: number
        }
        timezone: string
    }
}
