/* @flow */
import React, { Component } from 'react';

import contextKey from './context-key';
import contextShape from './context-shape';

type WireMappings = { [string]: { [string]: Function } };

export default (mappings: WireMappings) =>
    (WiredComponent: ReactClass<*>) => {
      const wiredComponentName = WiredComponent.displayName ||
        WiredComponent.name ||
        'Component';

      class Wired extends Component {
        static displayName = `WiredWithProps(${wiredComponentName})`;

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
                const $impl = (...args) => impl($emit, this.props, ...args);
                emitters = {
                  ...emitters,
                  [method]: $impl,
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
