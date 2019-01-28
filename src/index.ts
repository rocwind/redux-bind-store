import { Action, AnyAction, Dispatch, Store, Unsubscribe } from 'redux';

export interface BindStoreReturn<S = any, A extends Action = AnyAction> {
    dispatch: Dispatch<A>,
    getState: () => S,
    subscribe: (listener: () => void) => Unsubscribe,
}


export function bindStore<S = any, A extends Action = AnyAction>(
    store: Store<S, A>
): BindStoreReturn {
    const dispatch = store.dispatch.bind(store);
    const getState = store.getState.bind(store);
    const subscribe = store.subscribe.bind(store);
    return {
        dispatch,
        getState,
        subscribe,
    };
}
