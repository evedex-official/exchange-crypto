import Big from "big.js";
import { EIP721Schemas, getDomainData } from "./utils/crypto";
import { SignedPayload, WalletClient, toEthNumber } from "./utils/crypto";
import {
  CreateBaseOrder,
  LimitOrder,
  MarketOrder,
  PositionCloseOrder,
  ReplaceBaseOrder,
  ReplaceLimitOrder,
  ReplaceStopLimitOrder,
  StopLimitOrder,
} from "./utils/exchange";
import { toMatcherNumber } from "./utils/numeric";
export * as utils from "./utils";

export interface AuthPayload {
  message: string;
}

export interface NormalizeAuthPayload extends AuthPayload {
  address: string;
}

export interface SignedAuth extends NormalizeAuthPayload, SignedPayload {}

export async function signAuth(signer: WalletClient, payload: AuthPayload): Promise<SignedAuth> {
  const address = await signer.getAddress();
  const signature = await signer.signMessage(payload.message);

  return {
    address,
    message: payload.message,
    signature,
  };
}

export interface NormalizeLimitOrder extends CreateBaseOrder {
  quantity: string;
  limitPrice: string;
}

export interface SignedLimitOrder extends NormalizeLimitOrder, SignedPayload {
  quantity: string;
  limitPrice: string;
}

export async function signLimitOrder(
  signer: WalletClient,
  order: LimitOrder,
): Promise<SignedLimitOrder> {
  const normalize: NormalizeLimitOrder = {
    instrument: order.instrument,
    side: order.side,
    leverage: order.leverage,
    quantity: toMatcherNumber(order.quantity),
    limitPrice: toMatcherNumber(order.limitPrice),
    tpsl: order.tpsl,
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.createLimitOrder,
    {
      ...normalize,
      quantity: toEthNumber(normalize.quantity),
      limitPrice: toEthNumber(normalize.limitPrice),
    },
  );

  return {
    ...normalize,
    signature: signer.serializeSignature(signature),
  };
}

export interface NormalizeMarketOrder extends CreateBaseOrder, Pick<MarketOrder, "timeInForce"> {
  cashQuantity: string;
}

export interface SignedMarketOrder extends NormalizeMarketOrder, SignedPayload {}

export async function signMarketOrder(
  signer: WalletClient,
  order: MarketOrder,
): Promise<SignedMarketOrder> {
  const normalize: NormalizeMarketOrder = {
    instrument: order.instrument,
    side: order.side,
    timeInForce: order.timeInForce,
    leverage: order.leverage,
    cashQuantity: toMatcherNumber(order.cashQuantity),
    tpsl: order.tpsl,
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.createMarketOrder,
    {
      ...normalize,
      cashQuantity: toEthNumber(normalize.cashQuantity),
    },
  );

  return {
    ...normalize,
    signature: signer.serializeSignature(signature),
  };
}

export interface NormalizeStopLimitOrder extends CreateBaseOrder {
  quantity: string;
  limitPrice: string;
  stopPrice: string;
}

export interface SignedStopLimitOrder extends NormalizeStopLimitOrder, SignedPayload {}

export async function signStopLimitOrder(
  signer: WalletClient,
  order: StopLimitOrder,
): Promise<SignedStopLimitOrder> {
  const normalize: NormalizeStopLimitOrder = {
    instrument: order.instrument,
    side: order.side,
    leverage: order.leverage,
    quantity: toMatcherNumber(order.quantity),
    limitPrice: toMatcherNumber(order.limitPrice),
    stopPrice: toMatcherNumber(order.stopPrice),
    tpsl: order.tpsl,
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.createStopLimitOrder,
    {
      ...normalize,
      quantity: toEthNumber(normalize.quantity),
      limitPrice: toEthNumber(normalize.limitPrice),
      stopPrice: toEthNumber(normalize.stopPrice),
    },
  );

  return {
    ...normalize,
    signature: signer.serializeSignature(signature),
  };
}

export interface NormalizePositionCloseOrder
  extends Pick<PositionCloseOrder, "instrument" | "leverage"> {
  quantity: string;
}

export interface SignedPositionCloseOrder extends NormalizePositionCloseOrder, SignedPayload {}

export async function signPositionCloseOrder(
  signer: WalletClient,
  order: PositionCloseOrder,
): Promise<SignedPositionCloseOrder> {
  const normalize: NormalizePositionCloseOrder = {
    instrument: order.instrument,
    leverage: order.leverage,
    quantity: toMatcherNumber(order.quantity),
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.createPositionCloseOrder,
    {
      ...normalize,
      quantity: toEthNumber(normalize.quantity),
    },
  );

  return {
    ...normalize,
    signature: signer.serializeSignature(signature),
  };
}

export interface NormalizeReplaceLimitOrder extends ReplaceBaseOrder {
  quantity: string;
  limitPrice: string;
}

export interface SignedReplaceLimitOrder extends NormalizeReplaceLimitOrder, SignedPayload {}

export async function signReplaceLimitOrder(
  signer: WalletClient,
  orderPayload: ReplaceLimitOrder,
): Promise<SignedReplaceLimitOrder> {
  const normalize: NormalizeReplaceLimitOrder = {
    orderId: orderPayload.orderId,
    quantity: toMatcherNumber(orderPayload.quantity),
    limitPrice: toMatcherNumber(orderPayload.limitPrice),
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.replaceLimitOrder,
    {
      ...normalize,
      quantity: toEthNumber(normalize.quantity),
      limitPrice: toEthNumber(normalize.limitPrice),
    },
  );

  return {
    ...normalize,
    signature: signer.serializeSignature(signature),
  };
}

export interface NormalizeReplaceStopLimitOrder extends NormalizeReplaceLimitOrder {
  stopPrice: string;
}

export interface SignedReplaceStopLimitOrder
  extends NormalizeReplaceStopLimitOrder,
    SignedPayload {}

export async function signReplaceStopLimitOrder(
  signer: WalletClient,
  orderPayload: ReplaceStopLimitOrder,
): Promise<SignedReplaceStopLimitOrder> {
  const normalize: NormalizeReplaceStopLimitOrder = {
    orderId: orderPayload.orderId,
    quantity: toMatcherNumber(orderPayload.quantity),
    limitPrice: toMatcherNumber(orderPayload.limitPrice),
    stopPrice: toMatcherNumber(orderPayload.stopPrice),
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.replaceStopLimitOrder,
    {
      ...normalize,
      quantity: toEthNumber(normalize.quantity),
      limitPrice: toEthNumber(normalize.limitPrice),
      stopPrice: toEthNumber(normalize.stopPrice),
    },
  );

  return {
    ...normalize,
    signature: signer.serializeSignature(signature),
  };
}

export interface TradingBalanceWithdraw {
  recipient: string;
  amount: Big.BigSource;
}

export interface NormalizeTradingBalanceWithdraw extends Pick<TradingBalanceWithdraw, "recipient"> {
  amount: string;
}

export interface SignedTradingBalanceWithdraw extends NormalizeTradingBalanceWithdraw {
  signature: string;
}

export async function signTradingBalanceWithdraw(
  signer: WalletClient,
  withdraw: TradingBalanceWithdraw,
): Promise<SignedTradingBalanceWithdraw> {
  const normalize: NormalizeTradingBalanceWithdraw = {
    recipient: withdraw.recipient,
    amount: toMatcherNumber(withdraw.amount),
  };

  const signature = await signer.signTypedData(
    getDomainData(await signer.getChainId()),
    EIP721Schemas.withdraw,
    {
      recipient: withdraw.recipient,
      amount: toEthNumber(normalize.amount),
    },
  );

  return {
    ...normalize,
    signature,
  };
}
