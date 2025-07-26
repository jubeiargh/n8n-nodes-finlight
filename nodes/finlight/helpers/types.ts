export interface FinlightCompany {
  companyId: number;
  confidence: string;
  country?: string;
  exchange: string;
  industry?: string;
  name: string;
  sector?: string;
  ticker: string;
  isin?: string | null;
  openfigi?: string | null;
}

export interface FinlightNewsWebhook {
  link: string;
  source: string;
  title: string;
  publishDate: string;
  language: string;
  summary?: string;
  content?: string;
  sentiment?: string;
  confidence?: string;
  images?: string[];
  companies?: FinlightCompany[];
}
