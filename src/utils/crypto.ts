import Big from "big.js";
import { MATCHER_PRECISION } from "./constants";

export const EIP721Schemas = {
  domain: {
    name: "EVEDEX",
    version: "1",
    salt: "0x5792f7333c35db190e30acc144f049fd15b24f552c0010b8b3e06f9105c37c5a",
  },
  withdraw: {
    Withdraw: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  createLimitOrder: {
    "New limit order": [
      { name: "id", type: "string" },
      { name: "instrument", type: "string" },
      { name: "side", type: "string" },
      { name: "leverage", type: "uint8" },
      { name: "quantity", type: "uint96" },
      { name: "limitPrice", type: "uint80" },
      { name: "chainId", type: "uint256" },
    ],
  },
  createMarketOrder: {
    "New market order": [
      { name: "id", type: "string" },
      { name: "instrument", type: "string" },
      { name: "side", type: "string" },
      { name: "timeInForce", type: "string" },
      { name: "leverage", type: "uint8" },
      { name: "cashQuantity", type: "uint96" },
      { name: "chainId", type: "uint256" },
    ],
  },
  createStopLimitOrder: {
    "New stop-limit order": [
      { name: "id", type: "string" },
      { name: "instrument", type: "string" },
      { name: "side", type: "string" },
      { name: "leverage", type: "uint8" },
      { name: "quantity", type: "uint96" },
      { name: "limitPrice", type: "uint80" },
      { name: "stopPrice", type: "uint80" },
      { name: "chainId", type: "uint256" },
    ],
  },
  createPositionCloseOrder: {
    "Position close order": [
      { name: "id", type: "string" },
      { name: "instrument", type: "string" },
      { name: "leverage", type: "uint8" },
      { name: "quantity", type: "uint96" },
      { name: "chainId", type: "uint256" },
    ],
  },
  createTpSl: {
    "New take-profit/stop-loss": [
      { name: "instrument", type: "string" },
      { name: "type", type: "string" },
      { name: "side", type: "string" },
      { name: "quantity", type: "uint96" },
      { name: "price", type: "uint80" },
    ],
  },
  replaceLimitOrder: {
    "Replace limit order": [
      { name: "orderId", type: "string" },
      { name: "quantity", type: "uint96" },
      { name: "limitPrice", type: "uint80" },
    ],
  },
  replaceStopLimitOrder: {
    "Replace stop-limit order": [
      { name: "orderId", type: "string" },
      { name: "quantity", type: "uint96" },
      { name: "limitPrice", type: "uint80" },
      { name: "stopPrice", type: "uint80" },
    ],
  },
};

export function getDomainData(chainId: string) {
  return {
    ...EIP721Schemas.domain,
    chainId,
  };
}

export function toEthNumber(value: Big.BigSource) {
  return Big(value).mul(`1e${MATCHER_PRECISION}`).toFixed(0);
}

export interface SignedPayload {
  signature: string;
}

export interface NetworkChain {
  chainId: string;
}

export interface TypedDataDomain {
  name?: null | string;

  version?: null | string;

  chainId?: null | string | number | bigint;

  verifyingContract?: null | string;

  salt?: null | string | Uint8Array;
}

export interface TypedDataField {
  name: string;
  type: string;
}

export interface WalletClient {
  getChainId(): Promise<string> | string;

  getAddress(): Promise<string>;

  solidityPackedKeccak256(types: string[], values: any[]): string;

  getBytes(value: string): Uint8Array;

  serializeSignature(signature: string): string;

  signMessage(message: string | Uint8Array): Promise<string>;

  signTypedData(
    domain: any,
    types: Record<string, TypedDataField[]>,
    value: Record<string, any>,
  ): Promise<string>;
}
