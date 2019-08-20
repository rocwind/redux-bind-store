import { Action, AnyAction, Dispatch, Store, Unsubscribe } from 'redux';
import { shallowEqual } from './utils';

export interface MapStateToProps<S, P> {
    (state: S): P
}

export interface PropsChangedEvent<S, P, A extends Action = AnyAction> {
    newProps: P,
    prevProps: P,
    getState(): S,
    dispatch: Dispatch<A>,
}

export interface PropsChangedHandler<S, P, A extends Action = AnyAction> {
    (event: PropsChangedEvent<S, P, A>): void
}

export interface BindStoreReturn<S = any, A extends Action = AnyAction> {
    dispatch: Dispatch<A>,
    getState(): S,
    subscribe(listener: () => void): Unsubscribe,

    connect<P>(mapStateToProps: MapStateToProps<S, P>, propsChangedHandler: PropsChangedHandler<S, P, A>): Unsubscribe,
}

export function bindStore<S = any, A extends Action = AnyAction>(
    store: Store<S, A>
): BindStoreReturn {
    const dispatch = store.dispatch.bind(store);
    const getState = store.getState.bind(store);
    const subscribe = store.subscribe.bind(store);

    const connect = (mapStateToProps, propsChangedHandler) => {
        // initial props
        let props = mapStateToProps(store.getState());
        propsChangedHandler({
            newProps: props,
            prevProps: null,
            getState,
            dispatch,
        });

        return store.subscribe(() => {
            const newProps = mapStateToProps(store.getState());
            // shallow compare
            if (shallowEqual(newProps, props)) {
                return;
            }

            const prevProps = props;
            props = newProps;
            propsChangedHandler({
                newProps,
                prevProps,
                getState,
                dispatch,
            });
        });
    };

    return {
        dispatch,
        getState,
        subscribe,
        connect,
    };
}
