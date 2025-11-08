/**
 * Script de migração para converter endereços antigos sem checksum
 * para o formato correto com checksum usando Viem
 */

import { toChecksumAddress } from "./utils";
import type { PaymentRow } from "../types/payments";

/**
 * Migra os endereços de um array de PaymentRow para o formato com checksum
 * Remove endereços inválidos automaticamente
 */
export function migratePaymentRows(rows: PaymentRow[]): PaymentRow[] {
  const migrated: PaymentRow[] = [];
  
  rows.forEach((row) => {
    const checksumWallet = toChecksumAddress(row.wallet);
    
    if (!checksumWallet) {
      // Endereço inválido - ignora completamente
      console.warn(`⚠️ Removendo pagamento com endereço inválido: ${row.name} (${row.wallet})`);
      return;
    }
    
    migrated.push({
      ...row,
      wallet: checksumWallet,
    });
  });
  
  return migrated;
}

/**
 * Verifica se há endereços que precisam ser migrados ou removidos
 */
export function needsMigration(rows: PaymentRow[]): boolean {
  return rows.some((row) => {
    const checksumWallet = toChecksumAddress(row.wallet);
    // Precisa migração se: endereço inválido OU checksum diferente
    return !checksumWallet || checksumWallet !== row.wallet;
  });
}

/**
 * Força a limpeza de dados inválidos e migração de endereços no localStorage
 */
export function migrateLocalStorage() {
  console.log("🔄 Verificando dados do localStorage...");
  
  try {
    // Migrar payments-storage
    const paymentsKey = "payments-storage";
    const paymentsData = localStorage.getItem(paymentsKey);
    
    if (paymentsData) {
      try {
        const parsed = JSON.parse(paymentsData);
        const state = parsed.state;
        
        if (state?.rows && Array.isArray(state.rows)) {
          if (needsMigration(state.rows)) {
            console.log("🔄 Limpando endereços inválidos em payments-storage...");
            const originalCount = state.rows.length;
            state.rows = migratePaymentRows(state.rows);
            const newCount = state.rows.length;
            
            if (newCount < originalCount) {
              console.log(`🗑️ Removidos ${originalCount - newCount} pagamentos com endereços inválidos`);
            }
            
            parsed.state = state;
            localStorage.setItem(paymentsKey, JSON.stringify(parsed));
            console.log(`✅ payments-storage atualizado! (${newCount} pagamentos válidos)`);
          } else {
            console.log("✅ payments-storage já está atualizado");
          }
        }
      } catch (e) {
        console.warn("⚠️ Erro ao processar payments-storage, limpando...");
        localStorage.removeItem(paymentsKey);
      }
    }
    
    // Migrar history-storage
    const historyKey = "history-storage";
    const historyData = localStorage.getItem(historyKey);
    
    if (historyData) {
      try {
        const parsed = JSON.parse(historyData);
        const state = parsed.state;
        
        if (state?.items && Array.isArray(state.items)) {
          let needsUpdate = false;
          
          state.items = state.items.map((item: any) => {
            if (item.recipients && Array.isArray(item.recipients)) {
              const original = item.recipients.length;
              const migrated = migratePaymentRows(item.recipients);
              
              if (migrated.length !== original || JSON.stringify(migrated) !== JSON.stringify(item.recipients)) {
                needsUpdate = true;
                return { ...item, recipients: migrated };
              }
            }
            return item;
          });
          
          if (needsUpdate) {
            console.log("🔄 Limpando endereços inválidos em history-storage...");
            parsed.state = state;
            localStorage.setItem(historyKey, JSON.stringify(parsed));
            console.log("✅ history-storage atualizado!");
          } else {
            console.log("✅ history-storage já está atualizado");
          }
        }
      } catch (e) {
        console.warn("⚠️ Erro ao processar history-storage, limpando...");
        localStorage.removeItem(historyKey);
      }
    }
    
    console.log("✅ Verificação completa!");
    return true;
  } catch (error) {
    console.error("❌ Erro durante migração:", error);
    return false;
  }
}

/**
 * Remove completamente todos os dados do localStorage (reset completo)
 */
export function clearAllStorageData() {
  console.log("🗑️ Limpando todo o localStorage...");
  
  const keys = ["payments-storage", "history-storage", "users-storage"];
  
  keys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ ${key} removido`);
    }
  });
  
  console.log("✅ localStorage limpo completamente!");
}
