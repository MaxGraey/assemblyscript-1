import {
  Type,
  Value
} from "./general";

import {
  CharCode,
  isWhiteSpaceOrLineTerminator as isWhiteSpace,
  HEADER_SIZE as STRING_HEADER_SIZE
} from "../string";

const TrueFourCC = 0x00_65_00_75_00_72_00_74;
const FalsFourCC = 0x00_73_00_6C_00_61_00_66;

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

  parseNull(): Value {
    var value = new Value(Type.Null);
    return value;
  }

  parseBool(): Value | null {
    var offset = this.offset;
    var data   = changetype<usize>(this.data);
    var value  = new Value(Type.Bool);

    if (this.length >= 4) { // 4 = "true".length
      let fourChars = load<u64>(data + (offset << 1), STRING_HEADER_SIZE);
      if (fourChars == TrueFourCC) { // "true"
        this.skipBytes(4); // skip "true".length
        value.bool = true;
        return value;
      }

      if (fourChars == FalsFourCC) { // "fals"
        if (load<u16>(data + (offset << 1), STRING_HEADER_SIZE + (4 << 1)) == CharCode.e) {
          this.skipBytes(5); // skip "false".length
          value.bool = false;
          return value;
        }
      }
    }

    // TODO print fancy error
    assert(false);
    return null;
  }

  parseObject(): Value {
    var value = new Value(Type.Object);
    return value;
  }

  parseArray(): Value {
    var value = new Value(Type.Array);
    return value;
  }

  parseString(): Value {
    var value = new Value(Type.String);
    return value;
  }

  readHex(): void {
    // TODO
  }

  private skipWhitespaces(): void {
    var data   = this.data;
    var offset = this.offset;
    var index  = offset;
    for (; isWhiteSpace(data[index]); ++index) {}
    var diff = index - offset;
    if (diff) this.skipBytes(diff);
  }

  private skipWhitespacesExpectOneSpace(): void {
    var data = changetype<usize>(this.data);
    if (load<u16>(data + (this.offset << 1), STRING_HEADER_SIZE) == CharCode.SPACE) {
      this.skipBytes(1);
      let chr = load<u16>(data + (this.offset << 1), STRING_HEADER_SIZE);
      if (!isWhiteSpace(chr)) return;
    }
    this.skipWhitespaces();
  }

  private skipWhitespacesExpectNewLine(): void {
    if (this.data[this.offset] == CharCode.NEWLINE) {
      const fourSpaces: u64 = 0x00_20_00_20_00_20_00_20;

      let offset = this.offset + 1; // + sizeof("\n")
      let length = this.length - 1; // - sizeof("\n")
      let data   = changetype<usize>(this.data);

      let i = 0;
      while (i < length && load<u64>(data + (i << 1), STRING_HEADER_SIZE) == fourSpaces)     i += 8;
      while (i < length && load<u16>(data + (i << 1), STRING_HEADER_SIZE) == CharCode.SPACE) i += 1;

      this.skipBytes(i + 1);
      let chr = load<u16>(data + (i << 1), STRING_HEADER_SIZE);
      if (!isWhiteSpace(chr)) return;
    }
    this.skipWhitespaces();
  }

  @inline
  private skipBytes(bytes: i32): void {
    assert(this.length >= bytes);
    this.offset += bytes;
    this.length -= bytes;
  }
}
