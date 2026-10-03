"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { increment, decrement } from "../store/store";

export default function ReduxCounter() {
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