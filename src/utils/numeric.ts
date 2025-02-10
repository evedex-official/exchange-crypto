import Big from "big.js";
import { MATCHER_PRECISION } from "./constants";

export function toMatcherNumber(value: Big.BigSource) {
  return Big(value).round(MATCHER_PRECISION, Big.roundHalfUp).toString();
}
