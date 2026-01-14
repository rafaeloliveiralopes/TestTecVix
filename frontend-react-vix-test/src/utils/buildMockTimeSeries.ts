import { IFormatData } from "../types/socketType";

type TBuildMockTimeSeriesParams = {
  seed: number;
  points?: number;
  intervalMs?: number;
  initialMin?: number;
  initialMax?: number;
  jitter?: number;
  clampMin?: number;
  clampMax?: number;
  decimals?: number;
  locale?: string;
};

export const buildMockTimeSeries = ({
  seed,
  points = 24,
  intervalMs = 1000,
  initialMin = 0,
  initialMax = 60,
  jitter = 16,
  clampMin = 0,
  clampMax = 100,
  decimals = 3,
  locale = "pt-BR",
}: TBuildMockTimeSeriesParams): IFormatData[] => {
  // Gera dados mockados (determinísticos) para os gráficos sem depender de socket/API.
  let state = seed;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const formatTime = (date: Date) =>
    date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  let lastValue = clamp(initialMin + rand() * (initialMax - initialMin), 0, 100);

  return Array.from({ length: points }, (_item, index) => {
    const variation = (rand() - 0.5) * jitter;
    lastValue = clamp(lastValue + variation, clampMin, clampMax);
    const time = new Date(Date.now() - (points - 1 - index) * intervalMs);
    return { time: formatTime(time), value: Number(lastValue.toFixed(decimals)) };
  });
};

