
export enum Type {
  Array,
  Object,
  Bool,
  Number,
  String,
  Null
}

export class KeyValue {
  key: string;
  value: Value;
}

export class Value {
  @inline static get Array(): Value  { return new Value(Type.Array) }
  @inline static get Object(): Value { return new Value(Type.Object) }
  @inline static get Bool(): Value   { return new Value(Type.Bool) }
  @inline static get Number(): Value { return new Value(Type.Number) }
  @inline static get String(): Value { return new Value(Type.String) }
  @inline static get Null(): Value   { return new Value(Type.Null) }

  private value: u64;

  constructor(public type: Type) {}

  @inline get number(): f64 { return reinterpret<f64>(this.value) }
  @inline set number(value: f64): void { this.value = reinterpret<u64>(value) }

  @inline get bool(): bool { return <bool>this.value }
  @inline set bool(value: bool): void { this.value = <u64>(value) }

  @inline get string(): string { return changetype<string>(<usize>this.value) }
  @inline set string(value: string): void { this.value = changetype<usize>(value) }

  @inline get array(): Value[] { return changetype<Value[]>(<usize>this.value) }
  @inline set array(value: Value[]): void { this.value = changetype<usize>(value) }

  @inline get object(): KeyValue { return changetype<KeyValue>(<usize>this.value) }
  @inline set object(value: KeyValue): void { this.value = changetype<usize>(value) }
}

/*
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
*/
