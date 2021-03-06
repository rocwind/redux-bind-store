import { ActionCreator, Action, createStore, Reducer, Store } from 'redux';
import { bindStore } from '../index';

enum ActionTypeEnum {
    Add = 'add',
    Sub = 'sub',
}

const reducer: Reducer<number, Action<ActionTypeEnum>> = (
    state: number = 0,
    action: Action<ActionTypeEnum>
) => {
    switch (action.type) {
        case ActionTypeEnum.Add:
            return state + 1;
        case ActionTypeEnum.Sub:
            return state - 1;
    }

    return state;
}

const add: ActionCreator<Action<ActionTypeEnum>> = () => ({ type: ActionTypeEnum.Add });
const sub: ActionCreator<Action<ActionTypeEnum>> = () => ({ type: ActionTypeEnum.Sub });


let store: Store<number, Action<ActionTypeEnum>>;
beforeEach(() => {
    store = createStore(reducer);
});

it('binded dispatch changes state', () => {
    expect(store.getState()).toBe(0);
    const { dispatch } = bindStore(store);
    dispatch(add());
    expect(store.getState()).toBe(1);
});

it('binded getState gets latest state', () => {
    const { getState } = bindStore(store);
    expect(getState()).toBe(0);
    store.dispatch(add());
    expect(store.getState()).toBe(1);
});

it('binded subscribe gets updates', done => {
    const { subscribe } = bindStore(store);
    subscribe(() => {
        expect(store.getState()).toBe(1);
        done();
    });
    expect(store.getState()).toBe(0);
    store.dispatch(add());
});

it('binded connect propsChangedHandler gets updates', () => {
    const fn = jest.fn(({ newProps }) => { return newProps.value });

    const { connect } = bindStore(store);
    connect(state => ({ value: state }), fn);
    store.dispatch(add());

    expect(fn).toHaveNthReturnedWith(1, 0);
    expect(fn).toHaveNthReturnedWith(2, 1);
});

it('binded connect propsChangedHandler updates with prevProps', () => {
    const fn = jest.fn(({ prevProps }) => { return prevProps && prevProps.value });

    const { connect } = bindStore(store);
    connect(state => ({ value: state }), fn);
    store.dispatch(add());

    expect(fn).toHaveNthReturnedWith(1, null);
    expect(fn).toHaveNthReturnedWith(2, 0);
});
