export interface Job {
  job_title: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  match_score?: string;
}

export interface SearchHistoryItem {
  id: string;
  jobTitle: string;
  address: string;
  resultsCount: number;
  timestamp: string;
}
