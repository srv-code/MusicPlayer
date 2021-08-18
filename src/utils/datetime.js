export default class DateTimeUtils {
  static msToTime = s => {
    const pad = (n, z = 2) => ('00' + n).slice(-z);

    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return `${hrs ? `${pad(hrs)}:` : ''}${pad(mins)}:${pad(secs)}`;
  };

  static msToTimeComponents = s => {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return {
      hours: hrs,
      minutes: mins,
      seconds: secs,
      milliseconds: ms,
      string: `${hrs ? `${hrs} hours` : ''}${mins ? ` ${mins} minutes` : ''}${
        secs ? ` ${secs} seconds` : ''
      }`.trim(),
    };
  };
}
