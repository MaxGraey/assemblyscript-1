import {
  Type,
  Value
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
  offset: usize;
  length: usize;

  constructor(public data: string) {
    this.offset = 0;
    this.length = data.length;
  }

  parse(): bool {
    return false;
  }

  parseNull(): Value | null {
    if (this.length >= 4) {
      let offset = this.offset;
      let data   = changetype<usize>(this.data);
      if (load<u64>(data + (offset << 1), STRING_HEADER_SIZE) == NULL_FOUR_CC) {
        this.skipBytes(4); // skip "null".length
        return new Value(Type.Null);
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
        this.skipBytes(4); // skip "true".length
        let value = new Value(Type.Bool);
        value.bool = true;
        return value;
      }

      if (fourChars == FALS_FOUR_CC) {
        if (load<u16>(data + (offset << 1), STRING_HEADER_SIZE + (4 << 1)) == CharCode.e) {
          this.skipBytes(5); // skip "false".length
          let value = new Value(Type.Bool);
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
    var value = new Value(Type.Object);
    return value;
  }

  parseArray(): Value | null {
    var value = new Value(Type.Array);
    return value;
  }

  parseString(): Value | null {
    var value = new Value(Type.String);
    return value;
  }

  private skipWhitespaces(): void {
    var offset = this.offset;
    var data   = changetype<usize>(this.data) + (offset << 1);
    var index  = offset;
    for (; isWhiteSpace(load<u16>(data + (index << 1), STRING_HEADER_SIZE)); ++index) {}
    var diff = index - offset;
    if (diff) this.skipBytes(diff);
  }

  private skipWhitespacesExpectOneSpace(): void {
    var data = changetype<usize>(this.data);
    if (load<u16>(data + (this.offset << 1), STRING_HEADER_SIZE) == CharCode.SPACE) {
      this.skipBytes(1);
      let code = load<u16>(data + (this.offset << 1), STRING_HEADER_SIZE);
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

      // this.skipBytes(index + 1);
      this.skipBytes(index - offset);
      let code = load<u16>(data + ((this.offset + index) << 1), STRING_HEADER_SIZE);
      if (!isWhiteSpace(code)) return;
    }
    this.skipWhitespaces();
  }

  @inline
  private static skipNonSpecialCharacters(buffer: usize, offset: usize, size: usize): usize {
    for (let index = offset; index < size; ++index) {
      let code = load<u16>(buffer + (index << 1), STRING_HEADER_SIZE);
      if ((code == CharCode.DQUOTE || code <= 0x19 || code == CharCode.LSLASH)) {
        return index;
      }
    }
    return size;
  }

  @inline
  private skipBytes(bytes: i32): void {
    assert(this.length >= bytes);
    this.offset += bytes;
    this.length -= bytes;
  }
}
