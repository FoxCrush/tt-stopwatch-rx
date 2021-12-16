// import React from "react";
import React, { useState, useEffect } from "react";
import { interval, fromEvent } from "rxjs";
import { map, filter, bufferCount } from "rxjs/operators";
import styles from "./timer.module.css";

function TimerContainer() {
  const waitBtn = React.useRef(null);
  const clickCount = 2;
  const clickTimespan = 300;
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [timerState, setTimerState] = useState(false);
  const [waitModeState, setWaitMode] = useState(false);

  useEffect(() => {
    if (timerState) {
      const observable$ = interval(1000);
      const sub = observable$.subscribe(() =>
        setCount((currCount) => currCount + 1)
      );
      return () => {
        sub.unsubscribe();
      };
    }
  }, [timerState]);

  useEffect(() => {
    const minutes = `${Math.floor(count / 60)}`.padStart(2, 0);
    const hours = `${Math.floor(minutes / 60)}`.padStart(2, 0);
    const seconds = `${count - (minutes * 60 + hours * 3600)}`.padStart(2, 0);
    setTime(`${hours}:${minutes}:${seconds}`);

    const waitBtnDoubleClick$ = fromEvent(waitBtn.current, "click") //from github https://gist.github.com/mauriciosoares/5f7d185e900a23895e24
      .pipe(
        map(() => new Date().getTime()),
        // Emit the last `clickCount` timestamps.
        bufferCount(clickCount, 1),
        // `timestamps` is an array the length of `clickCount` containing the last added `timestamps`.
        filter((timestamps) => {
          // `timestamps[0]` contains the timestamp `clickCount` clicks ago.
          // Check if `timestamp[0]` was within the `clickTimespan`.
          return timestamps[0] > new Date().getTime() - clickTimespan;
        })
      )
      // Will emit after `clickCount` clicks if the first one happened within the `clickTimespan`.
      // Won't wait until `clickTimespan` runs out to emit.
      .subscribe(() => {
        setTimerState(false);
        setWaitMode(true);
      });
    return () => {
      waitBtnDoubleClick$.unsubscribe();
    };
  }, [count]);

  const resetBtnHandler = () => setCount(0);

  return (
    <div className={styles.container}>
      <span>{time}</span>
      <ul>
        <li>
          <button
            className={styles.buttonListItem}
            type="button"
            onClick={() => {
              setTimerState((state) => !state);
              if (!waitModeState) {
                setCount(0);
              }
              setWaitMode(false);
            }}
          >
            Start/Stop
          </button>
          <button
            ref={waitBtn}
            className={styles.buttonListItem}
            type="button"
            onClick={() => {
              setWaitMode(true);
            }}
          >
            Wait
          </button>
          <button
            className={styles.buttonListItem}
            type="button"
            onClick={resetBtnHandler}
          >
            Reset
          </button>
        </li>
      </ul>
    </div>
  );
}

export default TimerContainer;
