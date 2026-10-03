"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, increment, decrement } from "./store";
import type { RootState, AppDispatch } from "./store";

function ReduxCounter() {
  const count = useSelector(
    (state: RootState) => state.counter.value
  );

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <p>Redux Count: {count}</p>

      <button onClick={() => dispatch(increment())}>
        Increment
      </button>

      <button onClick={() => dispatch(decrement())}>
        Decrement
      </button>
    </div>
  );
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {children}
      <ReduxCounter />
    </Provider>
  );
}