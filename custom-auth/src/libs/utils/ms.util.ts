const SECONDS = 1000;
const MINUTES = SECONDS * 60;
const HOUR = MINUTES * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const YEAR = DAY * 365;

type Unit =
  | "Years"
  | "Year"
  | "Yrs"
  | "Yr"
  | "Y"
  | "Weeks"
  | "Week"
  | "W"
  | "Days"
  | "Day"
  | "D"
  | "Hours"
  | "Hour"
  | "Hrs"
  | "Hr"
  | "H"
  | "Minutes"
  | "Minute"
  | "Mins"
  | "Min"
  | "M"
  | "Seconds"
  | "Second"
  | "Secs"
  | "Sec"
  | "S"
  | "Milliseconds"
  | "Millisecond"
  | "Msecs"
  | "Msec"
  | "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

export const ms = (string: StringValue) => {
  if (
    typeof string !== "string" ||
    string.length === 0 ||
    string.length > 100
  ) {
    throw new Error(
      "Value provided to ms() must be a string with length between 1 and 99.",
    );
  }

  const match =
    /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms?|seconds?|secs?|s?|minutes?|mins?|m?|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      string,
    );

  const groups = match?.groups as { value: string; type?: string };

  if (!groups) return NaN;

  const parsedValue = parseFloat(groups.value);
  const type = (groups.type || "ms").toLowerCase();

  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return parsedValue * YEAR;
    case "weeks":
    case "week":
    case "w":
      return parsedValue * WEEK;
    case "days":
    case "day":
    case "d":
      return parsedValue * DAY;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return parsedValue * HOUR;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return parsedValue * MINUTES;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return parsedValue * SECONDS;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return SECONDS;
    default:
      throw new Error(`Invalid time string: ${string}`);
  }
};
