import { DateTime } from "luxon";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getTimestampAfter(ms: number, datetime?: DateTime): DateTime {
  const time = datetime ?? DateTime.now().setZone("America/New_York");
  return time.plus({ millisecond: ms });
}
