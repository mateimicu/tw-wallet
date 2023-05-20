import { v4 } from "uuid";

export default class IdGenerator {
  static randomId(): string {
    return v4();
  }
}
