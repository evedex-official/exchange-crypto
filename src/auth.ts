import { SiweMessage } from "siwe";
import { SignedPayload, WalletClient } from "./utils/crypto";

export interface AuthMessage {
  nonce: string;
  address: string;
  chainId: string;
  expirationTime?: string;
}

export interface AuthPayload {
  message: string;
}

export interface NormalizeAuthPayload extends AuthPayload {
  address: string;
}

export interface SignedAuth extends NormalizeAuthPayload, SignedPayload {}

export function getAuthSiweMessagePayload({
  nonce,
  address,
  chainId,
  expirationTime,
}: AuthMessage): AuthPayload {
  return {
    message: new SiweMessage({
      scheme: "https",
      domain: "evedex.com",
      uri: "https://evedex.com",
      address,
      statement: "Sign in to evedex.com",
      nonce,
      expirationTime,
      chainId: Number(chainId),
      version: "1",
    }).prepareMessage(),
  };
}

export async function signAuthMessage(
  signer: WalletClient,
  messagePayload: AuthMessage,
): Promise<SignedAuth> {
  const address = await signer.getAddress();

  const { message } = getAuthSiweMessagePayload(messagePayload);

  const signature = await signer.signMessage(message);

  return {
    address,
    message,
    signature,
  };
}

// @deprecated use signAuthMessage instead

export async function signAuth(
  signer: WalletClient,
  payload: AuthPayload,
): Promise<SignedAuth> {
  const address = await signer.getAddress();
  const signature = await signer.signMessage(payload.message);

  return {
    address,
    message: payload.message,
    signature,
  };
}
