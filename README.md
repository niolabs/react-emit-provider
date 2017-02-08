# react-emit-provider

## Installing

```
npm install react-emit-provider
```

## Usage

### Provider

```js
import React from 'react';
import ReactDOM from 'react-dom';
import EmitProvider from 'react-emit-provider';
import EmitEmitter from 'events';

const ee = new EventEmitter();
const emit = ee.emit.bind(ee);

ReactDOM.render((
  <EmitProvider emit={emit}>
    <WiredComponent />
  </EmitProvider>
), app);
```

### Component Wiring

To get the emitter:

```js
import { wire } from 'react-emit-provider';

const Component = (props) {
  const { emit } = props;
  return (<button onClick={() => emit('name')}>Button</button>);
};

export default wire()(Component);
```

To get a emitter of specific `eventName`


```js
import { wire } from 'react-emit-provider';

const Component = (props) {
  const { clickedEmitter } = props;
  return (<button onClick={clickedEmitter}>Button</button>);
};

export default wire('clicked')(Component);
```

Or multiple:

```js
import { wire } from 'react-emit-provider';

const Component = (props) {
  const { connectEmitter, disconnectEmitter } = props;
  return (
    <div>
      <button onClick={connectEmitter}>connect</button>
      <button onClick={disconnectEmitter}>disconnect</button>
    </div>
  );
};

export default wire('connect', 'disconnect')(Component);
```

### Advanced Wiring

Advanced wiring can give you more control over the injected methods. It will
also, by default, perform memoization to avoid generating multiple handlers.

```js
import { wireAdvanced } from 'react-emit-provider';

const Component = (props) {
  const { item, handleSelect, handleUnselect } = props;
  return (
    <div>
      <div>{item.name}</div>
      <button onClick={handleSelect(item.id)}>select</button>
      <button onClick={handleUnselect(item.id)}>unselect</button>
    </div>
  );
};

export default wireAdvanced({
  channel: {
    handleSelect: (emit, id) => { emit({ type: 'SELECT', id }); },
    handleUnselect: (emit, id) => { emit({ type: 'UNSELECT', id }); },
  },
})(Component);
```

Which would be dispatched as:

```js
ee.addEventListener('channel', (signal) => {
  console.log(signal.type, signal.id);
});
```

`wireAdvanced()` handlers will now also pass through arguments given
to the handler on invocation, as well as partially applied arguments
during handler construction.

```jsx
const Component = () => <button onClick={handleClick({ data: 'data' })}>Button</button>

const Wired = wireAdvanced({
  channel: {
    handleClick(emit, data, e) {
      /* data - the partially applied data object */
      /* e - the onClick event from the button */
    },
  },
});
```


