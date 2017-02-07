/* @flow */
import React, { Component } from 'react';

import contextKey from './context-key';
import contextShape from './context-shape';

export default (...busses: string[]) => (WiredComponent: ReactClass<*>) => {
  const wiredComponentName = WiredComponent.displayName || WiredComponent.name || 'Component';

  class Wired extends Component {
    static displayName = `Wired(${wiredComponentName})`;

    static contextTypes = {
      [contextKey]: contextShape,
    };

    componentWillMount() {
      const emit = this.context[contextKey].emit;
      this.emitters = busses.length === 0
        ? { emit }
        : busses.reduce((d, name) => {
          const $emit = (...args) => emit(name, ...args);
          return {
            ...d,
            [`${name}Emitter`]: $emit,
          };
        }, {});
    }

    emitters: { [string]: Function }

    render() {
      return React.createElement(WiredComponent, {
        ...this.emitters,
        ...this.props,
      });
    }
  }

  return Wired;
};
