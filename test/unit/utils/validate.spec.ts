import { assert } from "chai";
import { validatePayload } from "../../../src/utils/validate";
import { EIP721Schemas } from "../../../src/utils/crypto";
import { ethers } from "ethers";

describe("Validate payload test", () => {
  context("Validating errors", () => {
    it("Should return empty payload with undefined", () => {
      assert.throws(
        () =>
          validatePayload(
            undefined as unknown as Record<string, any>,
            EIP721Schemas.createLimitOrder,
          ),
        /Payload must be an object/,
      );
    });

    it("Should return empty payload with true", () => {
      assert.throws(
        () =>
          validatePayload(true as unknown as Record<string, any>, EIP721Schemas.createLimitOrder),
        /Payload must be an object/,
      );
    });

    it("Should return missing field for string id field", () => {
      assert.throws(
        () => validatePayload({}, EIP721Schemas.createLimitOrder),
        /Missing field "id" in payload/,
      );
    });

    it("Should return incorrect field type for int leverage field", () => {
      assert.throws(
        () =>
          validatePayload(
            { id: "test", instrument: "test", side: "test", leverage: "test" },
            EIP721Schemas.createLimitOrder,
          ),
        /Field "leverage" incorrect uint type/,
      );
    });

    it("Should return incorrect field type for int leverage field", () => {
      assert.throws(
        () =>
          validatePayload(
            { id: "test", instrument: "test", side: "test", leverage: "-1" },
            EIP721Schemas.createLimitOrder,
          ),
        /Field "leverage" incorrect uint type/,
      );
    });

    it("Should return incorrect field type for address field", () => {
      assert.throws(
        () => validatePayload({ recipient: "test", amount: 1 }, EIP721Schemas.withdraw),
        /Field "recipient" incorrect address type/,
      );
    });
  });

  context("Validating success", () => {
    it("Should return valid payload for create limit order", () => {
      assert.doesNotThrow(() =>
        validatePayload(
          {
            id: "test",
            instrument: "test",
            side: "test",
            leverage: 1,
            limitPrice: 1,
            quantity: 1,
            chainId: 1,
          },
          EIP721Schemas.createLimitOrder,
        ),
      );
    });

    it("Should return incorrect field type for address field", () => {
      assert.doesNotThrow(() =>
        validatePayload(
          { recipient: ethers.Wallet.createRandom().address, amount: 1 },
          EIP721Schemas.withdraw,
        ),
      );
    });
  });
});
