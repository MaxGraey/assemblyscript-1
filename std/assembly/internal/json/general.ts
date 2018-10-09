
export enum Type {
  Integer,
  Double,
  Null,
  False,
  True,
  String,
  Array,
  Object
}

const TYPE_BITS: usize  = 3;
const TYPE_MASK: usize  = (1 << TYPE_BITS) - 1;
const VALUE_MASK: usize = <usize>(-1) >> TYPE_BITS;

const ROOT_MARKER: usize = VALUE_MASK;

@inline
function parseFlagsTable(): u8[] {
  const table = [
 // 0    1    2    3    4    5    6    7      8    9    A    B    C    D    E    F
    0,   0,   0,   0,   0,   0,   0,   0,     0,   2,   2,   0,   0,   2,   0,   0, // 0
    0,   0,   0,   0,   0,   0,   0,   0,     0,   0,   0,   0,   0,   0,   0,   0, // 1
    3,   1,   0,   1,   1,   1,   1,   1,     1,   1,   1,   1,   1,   1,   0x11,1, // 2
    0x11,0x11,0x11,0x11,0x11,0x11,0x11,0x11,  0x11,0x11,1,   1,   1,   1,   1,   1, // 3
    1,   1,   1,   1,   1,   0x11,1,   1,     1,   1,   1,   1,   1,   1,   1,   1, // 4
    1,   1,   1,   1,   1,   1,   1,   1,     1,   1,   1,   1,   0,   1,   1,   1, // 5
    1,   1,   1,   1,   1,   0x11,1,   1,     1,   1,   1,   1,   1,   1,   1,   1, // 6
    1,   1,   1,   1,   1,   1,   1,   1,     1,   1,   1,   1,   1,   1,   1,   1, // 7

 // 128 - 255
    0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0
  ];
  return table;
}

@inline
export function getElementType(s: usize): Type {
  return <Type>(s & TYPE_MASK);
}

@inline
export function getElementValue(s: usize): usize {
  return s >> TYPE_BITS;
}

@inline
export function makeElement(type: Type, value: usize): usize {
  return <usize>(type) | (value << TYPE_BITS);
}

@inline
export function isPlainStringCharacter(char: i32): bool {
  //return c >= 0x20 && c <= 0x7f && c != 0x22 && c != 0x5c;
  const parseFlags = parseFlagsTable();
  return <bool>(parseFlags[char] & 1);
}

@inline
export function isWhitespace(char: i32): bool {
  //return c == '\r' || c == '\n' || c == '\t' || c == ' ';
  const parseFlags = parseFlagsTable();
  return (parseFlags[char] & 2) != 0;
}
