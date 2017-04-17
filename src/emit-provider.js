/* @flow */
import { Children, Component } from 'react';
import PropTypes from 'prop-types';

import warn from './warn';
import contextKey from './context-key';
import contextShape from './context-shape';

export default class EmitProvider extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    emit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    emit: () => warn('No emitter provided'),
  };

  static childContextTypes = {
    [contextKey]: contextShape,
  };

  getChildContext() {
    return {
      [contextKey]: {
        emit: this.props.emit,
      },
    };
  }

  render() { return Children.only(this.props.children); }
}
