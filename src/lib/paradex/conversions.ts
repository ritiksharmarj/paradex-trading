import BigNumber from "bignumber.js";

export function toQuantums(
  amount: BigNumber | string,
  precision: number,
): string {
  const bnAmount = typeof amount === "string" ? BigNumber(amount) : amount;
  const bnQuantums = bnAmount.dividedBy(`1e-${precision}`);
  return bnQuantums.integerValue(BigNumber.ROUND_FLOOR).toString();
}
