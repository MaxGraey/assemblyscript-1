import {
  log  as console_log,
  warn as console_warn
} from "./bindings/console";

import { now as performance_now } from "./bindings/performance";
import { itoa, dtoa } from "./internal/number";

var counts = new Map<string,u64>();
var times  = new Map<string,f64>();

export namespace console {
  function log<T>(value: T): void {
    if (isString<T>()) {
      console_log(value);
    } else if (isInteger<T>()) {
      console_log(itoa<T>(value));
    } else if (isFloat<T>()) {
      console_log(dtoa(value));
    } else {
      console_log(value.toString());
    }
  }

  function warn<T>(value: T): void {
    if (isString<T>()) {
      console_warn(value);
    } else if (isInteger<T>()) {
      console_warn(itoa<T>(value));
    } else if (isFloat<T>()) {
      console_warn(dtoa(value));
    } else {
      console_warn(value.toString());
    }
  }

  function time(label: string = "default"): void {
    times.set(label, performance_now());
  }

  function timeEnd(label: string = "default"): void {
    var endTime = performance_now();
    if (times.has(label)) {
      let delta = endTime - times.get(label);
      console_log(label + ": " + dtoa(delta) + "ms");
      times.delete(label);
    } else {
      console_warn("Timer for '" + label + "' does not exist");
    }
  }

  function count(label: string = "default"): void {
    if (!counts.has(label)) counts.set(label, 0);
    var next = counts.get(label) + 1;
    counts.set(label, next);
    console_log(label + ": " + itoa<u64>(next));
  }

  function countReset(label: string = "default"): void {
    if (counts.has(label)) {
      counts.set(label, 0);
    } else {
      console_warn("Count for '" + label + "' does not exist");
    }
  }
}
