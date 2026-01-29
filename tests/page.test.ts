import { toPager } from "@ipa-schema/api";

describe("toPager", () => {
  it("undefined", () => {
    expect(toPager(undefined)).toBeUndefined();
  });
});
