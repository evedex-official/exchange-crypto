export enum Side {
  Buy = "BUY",
  Sell = "SELL",
}

export enum TimeInForce {
  FOK = "FOK",
  IOC = "IOC",
}

export enum TpSlType {
  TakeProfit = "take-profit",
  StopLoss = "stop-loss",
}

export interface OrderTpSl {
  type: TpSlType;
  side: Side;
  quantity: Big.BigSource;
  price: Big.BigSource;
}

export interface TpSl extends OrderTpSl {
  instrument: string;
  order: string | null;
}

export interface CreateBaseOrder {
  instrument: string;
  side: Side;
  leverage: number;
  tpsl?: OrderTpSl[] | null;
}

export interface LimitOrder extends CreateBaseOrder {
  quantity: Big.BigSource;
  limitPrice: Big.BigSource;
}

export interface MarketOrder extends CreateBaseOrder {
  timeInForce: TimeInForce;
  cashQuantity: Big.BigSource;
}

export interface StopLimitOrder extends CreateBaseOrder {
  quantity: Big.BigSource;
  limitPrice: Big.BigSource;
  stopPrice: Big.BigSource;
}

export interface PositionCloseOrder {
  instrument: string;
  leverage: number;
  quantity: Big.BigSource;
}

export interface ReplaceBaseOrder {
  orderId: string;
}

export interface ReplaceLimitOrder extends ReplaceBaseOrder {
  quantity: Big.BigSource;
  limitPrice: Big.BigSource;
}

export interface ReplaceStopLimitOrder extends ReplaceLimitOrder {
  stopPrice: Big.BigSource;
}
