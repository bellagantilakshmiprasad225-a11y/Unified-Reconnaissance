export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type InvestigationStatus = 'New' | 'In Progress' | 'Completed' | 'Archived';
export type SearchType = 'Domain' | 'IP' | 'Email' | 'Company' | 'Person' | 'Username' | 'General';
export type FavoriteCategory = 'investigation' | 'tool' | 'search' | 'target';

export interface Investigation {
  id: string;
  userId?: string;
  name: string;
  analystName: string;
  date: string;
  priority: PriorityLevel;
  status: InvestigationStatus;
  description: string;
  notes: string;
  tags: string[];
  targetIds?: string[];
  evidenceIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TargetSocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface TargetProfile {
  id: string;
  userId?: string;
  fullName: string;
  username: string;
  company: string;
  organization: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  domain: string;
  ipAddress: string;
  country: string;
  city: string;
  address: string;
  socialLinks: TargetSocialLinks;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  userId?: string;
  investigationId?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  description: string;
  tags: string[];
  dataUrl?: string;
  blobKey?: string;
}

export interface SearchRecord {
  id: string;
  userId?: string;
  query: string;
  module: string;
  type: SearchType;
  timestamp: string;
  status: 'Completed' | 'Failed' | 'Pending';
  resultCount?: number;
  searchUrl?: string;
}

export interface FavoriteItem {
  id: string;
  userId?: string;
  category: FavoriteCategory;
  targetId: string;
  title: string;
  subtitle?: string;
  iconName?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId?: string;
  title: string;
  content: string;
  entityType: 'investigation' | 'target' | 'evidence' | 'general';
  entityId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Finding {
  id: string;
  userId?: string;
  investigationId: string;
  title: string;
  severity: PriorityLevel;
  description: string;
  source: string;
  createdAt: string;
}

export interface ReportSection {
  executiveSummary: string;
  targetDetails: string;
  timeline: string;
  findings: string;
  evidenceList: string;
  analystNotes: string;
  recommendations: string;
  conclusion: string;
}

export interface Report {
  id: string;
  userId?: string;
  investigationId: string;
  title: string;
  sections: ReportSection;
  generatedAt: string;
  analystName: string;
  classification: 'Unclassified' | 'Confidential' | 'Secret' | 'RESTRICTED OSINT';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  language: string;
  autoSave: boolean;
  notifications: boolean;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  defaultReportFormat: 'PDF' | 'HTML';
  includeEvidence: boolean;
  includeScreenshots: boolean;
  includeNotes: boolean;
  analystName: string;
  analystRole: string;
  analystOrg: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'Investigation' | 'Target' | 'Evidence' | 'Report' | 'Search' | 'System';
}
