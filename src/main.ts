/// <reference path="./types/AmoCRM.d.ts" />
/// <reference path="./types/Widget.d.ts" />

import { getDefaultSettings } from "./defaults";

import Settings from './components/Settings.svelte';
// import Subscription from './subscription/Subscription';

function widgetConstructor() {
  const checkDoubleInitialization = (key: string) => {
    if (window[key]) {
      throw new Error('Двойная инициализация виджета.');
    }
    // @ts-ignore
    window[key] = true;
  };
  checkDoubleInitialization('__тут название виджета123__');

  const widget: Widget = this;

  function getSettings(): any | {} {
    let settings = widget.get_settings().config;
    if (!settings || Array.isArray(settings)) {
      return getDefaultSettings();
    }
    if (typeof settings === 'object') {
      settings = JSON.stringify(settings);
    }
    settings = settings
      .replace(/{{!eql!}}/gm, '=')
      .replace(/{{!amp!}}/gm, '&')
      .replace(/{{!plus!}}/gm, '+')
      .replace(/{{!qsn!}}/gm, '?');
    settings = JSON.parse(settings);
    return settings;
  }

  widget.callbacks = {
    render: async () => {
      // const widgetCode = widget.get_settings().widget_code;
      // const expired = await new Subscription(widgetCode).isSubscriptionExpired();
      // if (expired) {
      //     return true;
      // }

      return true;
    },
    bind_actions: () => true,
    onSave: () => true,
    init: () => true,
    settings: () => {
      const widgetCode = widget.get_settings().widget_code;
      // const subs = new Subscription(widgetCode);
      //
      // subs.setPanelSubscriptionInfoSettings();
      // subs.addListenerOnShutdownWidget();

      const settingsWrapper = document.querySelector('#widget_settings__fields_wrapper');
      const hiddenInput = document.querySelector(`#${ widgetCode }_custom`);

      settingsWrapper.insertAdjacentHTML('afterbegin', `<div class="${ widgetCode }_settings_block_main"></div>`)

      const settingsPlace = document.querySelector(`.${ widgetCode }_settings_block_main`);

      new Settings({
        target: settingsPlace,
        props: {
          hiddenInput,
        },
      });

      return true;
    },
  };

  return widget;
}

export default widgetConstructor;
