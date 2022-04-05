interface Widget {
    get_settings: () => {
        active: string
        id: number
        images_path: string
        oauth_client_uuid: string
        path: string
        status: string
        version: string
        widget_active: string
        widget_code: string
        config: string
    }
    callbacks: {
        bind_actions: () => boolean | Promise<boolean>
        destroy?: () => boolean | Promise<boolean>
        init: () => boolean | Promise<boolean>
        onSave: () => boolean | Promise<boolean>
        render: () => boolean | Promise<boolean>
        settings: () => boolean | Promise<boolean>
    }
}