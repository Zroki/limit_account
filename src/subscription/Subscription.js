import SubscriptionInfo from './SubscriptionInfo.svelte';
import moment from 'moment';

export default class Subscription {
    constructor(widgetCode) {
        this._widgetName = AMOCRM.widgets.list[widgetCode] ? AMOCRM.widgets.list[widgetCode].langs.widget.name : '';
        this._widgetCode = widgetCode;
        this._iconWidgetUrl = AMOCRM.widgets.list[widgetCode] ? AMOCRM.widgets.list[widgetCode].params.images_path : '';
        this._baseUrl = 'https://app-registry.certit.ru/api';
    }

    /**
     * Вставляет в настройки виджета панель с информацией о подписке. Вставлять только в настройках.
     */
    setPanelSubscriptionInfoSettings(isFree) {
        const widgetSettingsWrap = document.querySelector('.widget-settings__wrap-desc-space');

        if (!widgetSettingsWrap) {
            return false;
        }

        new SubscriptionInfo({
            target: widgetSettingsWrap,
            props: {
                isFree,
                iconWidgetUrl: this._iconWidgetUrl,
                subscriptionInfo: this._getSubscriptionInfoLocalStorage(),
            }
        });

        return true;
    }

    _sendRequestOnShutdownWidget() {
        const accountId = AMOCRM.constant('account').id;

        try {
            return fetch(`${this._baseUrl}/delete_widget?widget_code=${this._widgetCode}&account_id=${accountId}`, {
                method: 'delete'
            });
        } catch (e) {
            return false;
        }
    }

    addListenerOnShutdownWidget() {
        const widgetMainInfoPanel = document.querySelector(`.widget-settings__modal.${this._widgetCode} .widget_main_info`);

        if (!widgetMainInfoPanel) {
            throw new Error('Ошибка при постановке слушателя на левую часть в настройках виджета');
        }

        widgetMainInfoPanel.addEventListener('click', ({target}) => {

            // если кликнули на кнопку отключения виджета
            if (target.closest('.widget-settings__command-plate-uninstall')) {
                this._sendRequestOnShutdownWidget();
            }

        }, true);
    }

    async isSubscriptionExpired() {
        const subscriptionInfo = this._getSubscriptionInfoLocalStorage();
        const currentTimeStamp = Date.now();

        if (!subscriptionInfo) {
            const result = await this._getNewSubscriptionInfo();

            // Если нет ответа от сервиса или нет информации о подписке
            if (!result) {
                return false;
            }

            const {subscriptionInfo} = this._getSubscriptionInfoLocalStorage();

            if (currentTimeStamp > +subscriptionInfo.date_end * 1000) {
                this._showExpiredMessage();
                return true;
            }
        }

        const {lastCheck} = subscriptionInfo;

        // проверяем, прошло ли 4 часа с последней проверки на подписку
        if (+moment(lastCheck).add(4, 'hours') < currentTimeStamp) {
            const result = await this._getNewSubscriptionInfo();

            // Если нет ответа от сервиса или нет информации о подписке
            if (!result) {
                return false;
            }

            const {subscriptionInfo} = this._getSubscriptionInfoLocalStorage();

            if (currentTimeStamp > +subscriptionInfo.date_end * 1000) {
                this._showExpiredMessage();
                return true;
            }

            const isSoonExpired = this._isSoonExpired(subscriptionInfo, currentTimeStamp);

            if (isSoonExpired) {
                this._showSoonExpiredMessage();
                return false;
            }

            if (isSoonExpired === null) {
                this._showErrorMessage();
                return true;
            }

            return false;
        }

        return this._isNowExpired();
    }

    _isNowExpired() {
        const {subscriptionInfo} = this._getSubscriptionInfoLocalStorage();
        const currentTimeStamp = Date.now();

        if (currentTimeStamp > +subscriptionInfo.date_end * 1000) {
            this._showExpiredMessage();
            return true;
        }

        return false;
    }

    async _getNewSubscriptionInfo() {
        const accountId = AMOCRM.constant('account').id;
        try {
            const request = await fetch(
                `${this._baseUrl}/get_account_info?widget_code=${this._widgetCode}&account_id=${accountId}`
            );

            const response = await request.json();

            if (response.is_complete) {
                const subscriptionInfo = response.subscription;

                this._setSubscriptionInfoLocalStorage(subscriptionInfo);
                return true;
            } else {
                // this._showEmptySubscriptionMessage();
                return false;
            }
        } catch (error) {
            // this._showErrorMessage();
            return false;
        }
    }

    _setSubscriptionInfoLocalStorage(subscriptionInfo) {
        localStorage.setItem(`${this._widgetCode}_subscription`, JSON.stringify({
            lastCheck: Date.now(),
            subscriptionInfo,
        }));
    }

    _getSubscriptionInfoLocalStorage() {
        const subscriptionInfo = localStorage.getItem(`${this._widgetCode}_subscription`);

        if (typeof subscriptionInfo === 'string') {
            return JSON.parse(subscriptionInfo);
        }

        return null;
    }

    _isSoonExpired(subscriptionInfo, currentTimeStamp) {
        if (subscriptionInfo) {
            return +moment(currentTimeStamp).add(7, 'days') > +subscriptionInfo.date_end * 1000;
        }

        return null;
    }

    _showSoonExpiredMessage() {
        AMOCRM.notifications.show_message_error({
            text: 'Подписка виджета скоро истечёт',
            header: this._widgetName,
        });
    }

    _showExpiredMessage() {
        AMOCRM.notifications.show_message_error({
            text: 'Подписка виджета истекла',
            header: this._widgetName,
        });
    }

    _showErrorMessage() {
        AMOCRM.notifications.show_message_error({
            text: 'Ошибка получения информации о подписке',
            header: this._widgetName,
        });
    }

    _showEmptySubscriptionMessage() {
        AMOCRM.notifications.show_message_error({
            text: 'Отсутствует подписка для виджета',
            header: this._widgetName,
        });
    }
}
