# redux-bind-store [![Build Status](https://travis-ci.org/rocwind/redux-bind-store.svg?branch=master)](https://travis-ci.org/rocwind/redux-bind-store)

## Install
`npm i --save redux-bind-store`

## Usage
```
import { bindStore } from 'redux-bind-store'

// redux store
const store = createStore(reducer);

// bind to given store
const { getState, dispatch, connect } = bindStore(store);

// work with global getState and dispatch
const state = getState();
dispatch(someAction());

// connect to store changes with cache selectors
connect(state => {
    isLoggedIn: isLoggedInSelector(state),
}, ({ newProps, dispatch }) => {
    const { isLoggedIn } = newProps;
    if (!isLoggedIn) {
        // logged out case, skip
        return;
    }
    dispatch(someActionWhenLoggedIn());
});
```

## API

### `bindStore`
`function bindStore(store)`

#### `bindStore` Params
* `store: store` - redux store

#### `bindStore` Returns
`bindStore` returns an object with following properties:
* `getState: () => state` - redux getState method binded to the store
* `dispatch: (action) => void` - redux dispatch method binded to the store
* `subscribe: (listener) => () => void` - redux subscribe method binded to the store
* `connect: () => () => void` - connect to store updates

### `connect`
`function connect(mapStateToProps, propsChangedHander)`

#### `connect` Params
* `mapStateToProps: state => object` - map the state to a props object
* `propsChangedHandler: event => void` - callback for the props changed event, the handler callback will be called with event object contains:
    - `newProps: object` - current `mapStateToProps` result
    - `prevProps: object` - previous `mapStateToProps` result, `null` for the first call
    - `getState: () => state` - redux getState method binded to the store
    - `dispatch: (action) => void` - redux dispatch method binded to the store

#### `connect` Returns
`connect` returns an unsubscribe method - the one returned by `store.subscribe` - which will disconnect the `propsChangedHander` when called.
