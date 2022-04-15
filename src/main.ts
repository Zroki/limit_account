/// <reference path="./types/AmoCRM.d.ts" />
/// <reference path="./types/Limits.d.ts" />
/// <reference path="./types/Widget.d.ts" />
// @ts-ignore
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

  widget.callbacks = {
    render: async () => {
      if (AMOCRM.widgets.system.area !== 'settings') {
        return true;
      }

      new AccountLimit({
        target: document.querySelector('.public-integrations-list'),
        props: {},
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
