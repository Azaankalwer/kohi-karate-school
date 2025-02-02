export type TabType = 'transactions' | 'mappings' | 'audit' | 'summaries' | 'billing';

export interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
}