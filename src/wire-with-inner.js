/* @flow */
import React, { Component } from 'react';
import type { Element } from 'react';
import PropTypes from 'prop-types';

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

        static defaultProps = {
          innerRef: undefined,
        };

        static propTypes = {
          innerRef: PropTypes.func,
        };

        componentWillMount() {
          const emit = this.context[contextKey].emit;
          let emitters = {};
          Object.entries(mappings).forEach(([name, methods]) => {
            const $emit = (...args) => emit(name, ...args);
            Object.entries(methods).forEach(([method, val]) => {
              if (typeof val === 'function') {
                const impl: Function = val;
                const $impl = (...args) => impl.call(this.el, $emit, ...args);
                emitters = {
                  ...emitters,
                  [method]: $impl,
                };
              }
            });
          });
          this.emitters = emitters;
        }

        el: HTMLElement | Element<any>;
        emitters: { [string]: Function }

        render() {
          const { innerRef, ...props } = this.props;
          return React.createElement(WiredComponent, {
            ...this.emitters,
            ...props,
            ref: (el) => {
              this.el = el;
              if (innerRef) { innerRef(el); }
            },
          });
        }
      }

      return Wired;
    };
