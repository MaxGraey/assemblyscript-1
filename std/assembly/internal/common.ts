
import { loadUnsafe } from "./arraybuffer";

// Total tables size: 680 bytes (instead 2472 bytes in RapidJSON version)

@inline // 32 * 8 = 256 bytes
function powersPos2(): f64[] {
  const table = [
    1e00, 1e01, 1e02, 1e03, 1e04, 1e05, 1e06, 1e07, 1e08, 1e09,
    1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19,
    1e20, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29,
    1e30, 1e31
  ];
  return table;
}

@inline // 32 * 8 = 256 bytes
function powersNeg2(): f64[] {
  const table = [
    1e-00, 1e-01, 1e-02, 1e-03, 1e-04, 1e-05, 1e-06, 1e-07, 1e-08, 1e-09,
    1e-10, 1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17, 1e-18, 1e-19,
    1e-20, 1e-21, 1e-22, 1e-23, 1e-24, 1e-25, 1e-26, 1e-27, 1e-28, 1e-29,
    1e-30, 1e-31
  ];
  return table;
}

@inline // 10 * 8 = 80 bytes
function powersPos1(): f64[] {
  const table = [
    1e00, 1e32, 1e64, 1e96, 1e128, 1e160, 1e192, 1e224, 1e256, 1e288
  ];
  return table;
}

@inline // 11 * 8 = 88 bytes
function powersNeg1(): f64[] {
  const table = [
    1e-00, 1e-32, 1e-64, 1e-96, 1e-128, 1e-160, 1e-192, 1e-224, 1e-256, 1e-288, 1e-320
  ];
  return table;
}

// compute 10 ** n
@inline
export function pow10(n: i32): f64 {
  const powPos1 = <ArrayBuffer>powersPos1().buffer_;
  const powPos2 = <ArrayBuffer>powersPos2().buffer_;
  const powNeg1 = <ArrayBuffer>powersNeg1().buffer_;
  const powNeg2 = <ArrayBuffer>powersNeg2().buffer_;
  if (n >= 0) {
    return n <= 308
      ? loadUnsafe<f64,f64>(powPos1, n >> 5) * loadUnsafe<f64,f64>(powPos2, n & 31)
      : Infinity;
  }
  var p = -n;
  return n >= -323
    ? loadUnsafe<f64,f64>(powNeg1, p >> 5) * loadUnsafe<f64,f64>(powNeg2, p & 31)
    : 0;
}

/*
@inline
export function fastPath(significand: f64, exp: i32): f64 {
  return significand * pow10(exp);
}
*/
