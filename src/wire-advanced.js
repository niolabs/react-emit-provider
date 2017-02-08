/* @flow */
import React, { Component } from 'react';
import defaultMemoizer from 'memoizee';

import contextKey from './context-key';
import contextShape from './context-shape';

type WireMappings = { [string]: { [string]: Function } };
type WireAdvancedOptions = {
  memoize: boolean,
  memoizeFn: Function,
}

export default (
    mappings: WireMappings,
    { memoize = true, memoizeFn = defaultMemoizer }: WireAdvancedOptions = {},
  ) =>
    (WiredComponent: ReactClass<*>) => {
      const wiredComponentName = WiredComponent.displayName ||
        WiredComponent.name ||
        'Component';

      class Wired extends Component {
        static displayName = `WiredAdvanced(${wiredComponentName})`;

        static contextTypes = {
          [contextKey]: contextShape,
        };

        componentWillMount() {
          const emit = this.context[contextKey].emit;
          let emitters = {};
          Object.entries(mappings).forEach(([name, methods]) => {
            const $emit = (...args) => emit(name, ...args);
            Object.entries(methods).forEach(([method, val]) => {
              if (typeof val === 'function') {
                const impl: Function = val;
                const $impl = (...args1) => (...args2) => impl($emit, ...args1, ...args2);
                emitters = {
                  ...emitters,
                  [method]: memoize ? memoizeFn($impl, { length: impl.length }) : $impl,
                };
              }
            });
          });
          this.emitters = emitters;
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
