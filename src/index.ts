import { Action, AnyAction, Dispatch, Store, Unsubscribe } from 'redux';
import { shallowEqual } from './utils';

export interface MapStateToProps<S> {
    (state: S): object
}

export interface PropsChangedEvent<S = any, A extends Action = AnyAction> {
    newProps: object,
    prevProps: object,
    getState(): S,
    dispatch: Dispatch<A>,
}

export interface PropsChangedHandler<S = any, A extends Action = AnyAction> {
    (event: PropsChangedEvent): void
}

export interface Connect<S = any, A extends Action = AnyAction> {
    (
        mapStateToProps: MapStateToProps<S>,
        propsChangedHandler: PropsChangedHandler<S, A>
    ): Unsubscribe
}

export interface BindStoreReturn<S = any, A extends Action = AnyAction> {
    dispatch: Dispatch<A>,
    getState(): S,
    subscribe(listener: () => void): Unsubscribe,

    connect: Connect<S, A>,
}

export function bindStore<S = any, A extends Action = AnyAction>(
    store: Store<S, A>
): BindStoreReturn {
    const dispatch = store.dispatch.bind(store);
    const getState = store.getState.bind(store);
    const subscribe = store.subscribe.bind(store);

    const connect: Connect<S, A> = (mapStateToProps, propsChangedHandler) => {
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
