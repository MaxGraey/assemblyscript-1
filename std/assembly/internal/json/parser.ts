import {
  Type,
  Result,
  Value,
  KeyValue
} from "./general";

import {
  CharCode,
  isWhiteSpaceOrLineTerminator as isWhiteSpace,
  HEADER_SIZE as STRING_HEADER_SIZE
} from "../string";

const NULL_FOUR_CC: u64   = 0x00_6C_00_6C_00_75_00_6E; // "null"
const TRUE_FOUR_CC: u64   = 0x00_65_00_75_00_72_00_74; // "true"
const FALS_FOUR_CC: u64   = 0x00_73_00_6C_00_61_00_66; // "fals"
const SPACES_FOUR_CC: u64 = 0x00_20_00_20_00_20_00_20; // "    "

export class Parser {
  private offset: usize;
  private length: usize;

  private cachedValues:    Value[];
  private cachedKeyValues: KeyValue[];

  constructor(public data: string) {
    this.offset = 0;
    this.length = data.length;
  }

  destroy(): void {
    Parser.destroyArray(this.cachedValues);
    Parser.destroyArray(this.cachedKeyValues);
  }

  @inline
  private static destroyArray<T>(array: T[]): void {
    if (isReference<T>()) {
      for (let i = 0, len = array.length; i < len; ++i) {
        memory.free(changetype<usize>(unchecked(array[i])));
      }
    }
    memory.free(changetype<usize>(array.buffer_));
    memory.free(changetype<usize>(array));
  }

  parse(): Result {
    return Result.Ok;
  }

  parseNull(): Value | null {
    if (this.length >= 4) {
      let offset = this.offset;
      let data   = changetype<usize>(this.data);
      if (load<u64>(data + (offset << 1), STRING_HEADER_SIZE) == NULL_FOUR_CC) {
        this.skip(4); // skip "null".length
        return Value.Null;
      }
    }
    // TODO print fancy error
    assert(false, "invalid null");
    return null;
  }

  parseBool(): Value | null {
    if (this.length >= 4) { // 4 = "true".length
      let offset = this.offset;
      let data   = changetype<usize>(this.data);

      let fourChars = load<u64>(data + (offset << 1), STRING_HEADER_SIZE);
      if (fourChars == TRUE_FOUR_CC) {
        this.skip(4); // skip "true".length
        let value = Value.Bool;
        value.bool = true;
        return value;
      }

      if (fourChars == FALS_FOUR_CC) {
        if (load<u16>(data + (offset << 1), STRING_HEADER_SIZE + (4 << 1)) == CharCode.e) {
          this.skip(5); // skip "false".length
          let value = Value.Bool;
          value.bool = false;
          return value;
        }
      }
    }

    // TODO print fancy error
    assert(false, "invalid bool");
    return null;
  }

  parseObject(): Value | null {
    var value = Value.Object;
    return value;
  }

  parseArray(): Value | null {
    var value = Value.Array;
    return value;
  }

  parseString(): Value | null {
    var value = Value.String;
    return value;
  }

  private skipWhitespaces(): void {
    var offset = this.offset;
    var data   = changetype<usize>(this.data) + (offset << 1);
    var index  = offset;
    for (; isWhiteSpace(load<u16>(data + (index << 1), STRING_HEADER_SIZE)); ++index) {}
    var diff = index - offset;
    if (diff) this.skip(diff);
  }

  private skipWhitespacesExpectOneSpace(): void {
    var offset = this.offset;
    var data = changetype<usize>(this.data);
    if (load<u16>(data + (offset << 1), STRING_HEADER_SIZE) == CharCode.SPACE) {
      let code = load<u16>(data + (offset << 1), STRING_HEADER_SIZE + (1 << 1));
      this.skip(1);
      if (!isWhiteSpace(code)) return;
    }
    this.skipWhitespaces();
  }

  private skipWhitespacesExpectNewLine(): void {
    var offset = this.offset;
    var data = changetype<usize>(this.data);
    if (load<u16>(data + (offset << 1), STRING_HEADER_SIZE) == CharCode.NEWLINE) {
      let length = this.length - 1; // - sizeof("\n")
      let index  = offset + 1;      // + sizeof("\n")

      while (index < length && load<u64>(data + (index << 1), STRING_HEADER_SIZE) == SPACES_FOUR_CC) index += 4;
      while (index < length && load<u16>(data + (index << 1), STRING_HEADER_SIZE) == CharCode.SPACE) index += 1;

      // this.skip(index + 1);
      let diff = index - offset;
      if (diff) this.skip(diff);
      let code = load<u16>(data + ((this.offset + index) << 1), STRING_HEADER_SIZE);
      if (!isWhiteSpace(code)) return;
    }
    this.skipWhitespaces();
  }

  private processBackslash(str: string): bool {
    var offset = this.offset;
    var data = changetype<usize>(this.data);
    var code = load<u16>(data + (offset << 1), STRING_HEADER_SIZE);

    if (load<u16>(data + (offset << 1), STRING_HEADER_SIZE) == CharCode.u) {
      // TODO ?
    }

    switch (code) {
      case CharCode.DBL_QUOTE:
      case CharCode.LEFT_SLASH:
      case CharCode.RIGHT_SLASH: break;
      case CharCode.b: { code = CharCode.BACKSPACE; break; } // '\b'
      case CharCode.f: { code = 0x0C; break; } // '\f'
      case CharCode.n: { code = CharCode.NEWLINE; break; } // '\n'
      case CharCode.r: { code = 0x0D; break; } // '\r'
      case CharCode.t: { code = 0x09; break; } // '\t'
      default: { code = 0; break; }
    }

    if (code == 0) {
      assert(false); // TODO Error "invalid escape sequence"
      return false;
    }
    this.skip(1);
    var buffer = changetype<usize>(str);
    var length = str.length;
    store<u16>(buffer + (length++ << 1), code, STRING_HEADER_SIZE);
    store<u16>(buffer, length, offsetof<String>("length"));
    return true;
  }

  @inline
  private static skipNonSpecialCharacters(buffer: usize, offset: usize, size: usize): usize {
    for (let index = offset; index < size; ++index) {
      let code = load<u16>(buffer + (index << 1), STRING_HEADER_SIZE);
      if ((code == CharCode.DBL_QUOTE || code <= 0x19 || code == CharCode.LEFT_SLASH)) {
        return index;
      }
    }
    return size;
  }

  @inline
  private skip(bytes: i32): void {
    assert(this.length >= bytes);
    this.offset += bytes;
    this.length -= bytes;
  }
}
