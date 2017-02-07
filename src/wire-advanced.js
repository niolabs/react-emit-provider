/* @flow */
import React, { Component } from 'react';
import defaultMemoizer from 'memoizee';

import contextKey from './context-key';
import contextShape from './context-shape';

type Mappings = { [string]: { [string]: Function } };
type AdvancedWireOptions = {
  memoize: boolean,
  memoizeFn: Function,
}

export default (
    mappings: Mappings,
    { memoize = true, memoizeFn = defaultMemoizer }: AdvancedWireOptions = {},
  ) =>
    (WiredComponent: ReactClass<*>) => {
      const wiredComponentName = WiredComponent.displayName ||
        WiredComponent.name ||
        'Component';

      class Wired extends Component {
        static displayName = `Wired(${wiredComponentName})`;

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
                const $impl = (...args) => () => impl($emit, ...args);
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
