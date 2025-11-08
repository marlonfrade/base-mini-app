import { useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther } from "viem";
import type { PaymentRow } from "../types/payments";
import { PAYMENT_CONTRACT_ABI, PAYMENT_CONTRACT_ADDRESS } from "./contractABI";

export function usePaymentContract() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: dashboardStats, refetch: refetchStats } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "getDashboardStats",
  });

  const { data: isPendingBatch } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "isPending",
  });

  const { data: dueDate } = useReadContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PAYMENT_CONTRACT_ABI,
    functionName: "getDueDate",
  });

  const sendBatchPayment = useCallback(
    async (recipients: PaymentRow[], dueDateUnix?: number) => {
      if (recipients.length === 0) {
        throw new Error("Nenhum destinatário");
      }

      const addresses = recipients.map((r) => r.wallet as `0x${string}`);
      const amounts = recipients.map((r) => parseEther(r.amount));
      const dueDate = dueDateUnix || Math.floor(Date.now() / 1000) + 86400; 

      writeContract({
        address: PAYMENT_CONTRACT_ADDRESS,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: "sendFuncionarios",
        args: [addresses, amounts, BigInt(dueDate)],
      });

      return hash;
    },
    [writeContract, hash]
  );

  const executePendingTransaction = useCallback(() => {
    writeContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "sendTransaction",
    });
  }, [writeContract]);

  const deposit = useCallback((amount: string) => {
    writeContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "deposit",
      value: parseEther(amount),
    });
  }, [writeContract]);

  const withdraw = useCallback((amount: string) => {
    writeContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: PAYMENT_CONTRACT_ABI,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  }, [writeContract]);

  return {
    sendBatchPayment,
    executePendingTransaction,
    deposit,
    withdraw,
    
    dashboardStats,
    isPendingBatch,
    dueDate,
    refetchStats,
    
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
