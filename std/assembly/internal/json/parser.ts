import {
  Type,
  isWhitespace
} from "./general";

export class Parser {
  rootType: Type = Type.Null;

  constructor() {

  }

  /*
  char* skipWhitespace(char* p) {
    // There is an opportunity to make better use of superscalar
    // hardware here* but if someone cares about JSON parsing
    // performance the first thing they do is minify, so prefer
    // to optimize for code size here.
    // * https://github.com/chadaustin/Web-Benchmarks/blob/master/json/third-party/pjson/pjson.h#L1873
    while (true) {
      if (p == input_end) {
        return 0;
      } else if (isWhitespace(*p)) {
        ++p;
      } else {
        return p;
      }
    }
  }
  */
  parse(): bool {
    return false;
  }

  parseNull(): u32 {
    return 0;
  }

  parseFalse(): u32 {
    return 0;
  }

  parseTrue(): u32 {
    return 0;
  }

  parseString(): u32 {
    return 0;
  }

  readHex(): u32 {
    return 0;
  }
}
