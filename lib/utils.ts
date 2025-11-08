import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getAddress, isAddress } from "viem"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte um endereço Ethereum para o formato correto com checksum
 * @param address - Endereço Ethereum (pode estar em qualquer formato)
 * @returns Endereço com checksum correto ou null se inválido
 */
export function toChecksumAddress(address: string): string | null {
  try {
    const cleaned = address.trim();
    
    if (!cleaned.startsWith('0x') || cleaned.length !== 42) {
      return null;
    }
    
    if (!isAddress(cleaned)) {
      return null;
    }
    
    const checksummed = getAddress(cleaned);
    return checksummed;
  } catch (error) {
    return null;
  }
}

/**
 * Valida e converte múltiplos endereços para checksum
 * @param addresses - Array de endereços
 * @returns Array de endereços válidos com checksum
 */
export function validateAndChecksumAddresses(addresses: string[]): string[] {
  return addresses
    .map(toChecksumAddress)
    .filter((addr): addr is string => addr !== null);
}
