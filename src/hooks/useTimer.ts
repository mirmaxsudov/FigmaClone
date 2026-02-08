import React from 'react';

interface UseTimerOptions {
  autoStart?: boolean;
  initialTime?: number;
  interval?: number;
  onTimeChange?: (timeLeft: number) => void;
  onTimerEnd?: () => void;
}

export function useTimer({
  initialTime = 1000,
  interval = 1000,
  autoStart = false,
  onTimerEnd,
  onTimeChange
}: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = React.useState(initialTime);
  const [isRunning, setIsRunning] = React.useState(autoStart);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const hoursLeft = Math.floor(timeLeft / 3600)
    .toString()
    .padStart(2, '0');
  const minutesLeft = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0');
  const secondsLeft = (timeLeft % 60).toString().padStart(2, '0');

  React.useEffect(() => {
    if (onTimerEnd && timeLeft <= 0) onTimerEnd();
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        onTimeChange?.(timeLeft);
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, interval, timeLeft]);

  const start = (time = timeLeft) => {
    setIsRunning(true);
    setTimeLeft(time);
  };
  const pause = () => setIsRunning(false);
  const reset = (timeLeft = initialTime) => {
    setIsRunning(false);
    setTimeLeft(timeLeft);
  };

  const formatTimeString = () => {
    const h = Math.floor(timeLeft / 3600).toPrecision(2);
    const m = Math.floor((timeLeft % 3600) / 60).toPrecision(2);
    const s = (timeLeft % 60).toPrecision(2);

    return `${h}:${m}:${s}`;
  };

  return {
    timeLeft,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    formatTimeString
  };
}
