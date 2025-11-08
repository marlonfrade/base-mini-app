import { useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import type { PaymentRow } from "../types/payments";

export function usePaymentContract() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendBatchPayment = useCallback(
    async (recipients: PaymentRow[]) => {
      if (recipients.length === 0) {
        throw new Error("Nenhum destinatário");
      }

      const firstRecipient = recipients[0];
      
      if (!firstRecipient) {
        throw new Error("Destinatário inválido");
      }

      writeContract({
        address: firstRecipient.wallet as `0x${string}`,
        abi: [],
        functionName: "fallback",
        value: parseEther(firstRecipient.amount),
      });

      return hash;
    },
    [writeContract, hash]
  );

  return {
    sendBatchPayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
