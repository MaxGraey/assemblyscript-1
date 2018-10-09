import { Type } from "./general";

export class Value {
  type: Type;

  constructor() {
  }

  getIntValue(): i32 {
    return 0;
  }

  getDoubleValue(): f64 {
    return 0;
  }
}

export class Document {
  root: usize;
  rootType: Type;
  constructor(rhs: Document) {
    this.root = rhs.root;
    this.rootType = rhs.rootType;
  }

  isValid(): bool {
    return this.rootType == Type.Array || this.rootType == Type.Object;
  }
}
