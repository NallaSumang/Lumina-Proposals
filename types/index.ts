export type RFPStatus = "draft" | "processing" | "in_review" | "completed" | "archived";
export type Priority = "low" | "medium" | "high" | "urgent";
export type QuestionStatus = "pending" | "answered" | "approved" | "rejected" | "needs_review";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "editor" | "reviewer" | "viewer";
  title?: string;
}

export interface RFP {
  id: string;
  title: string;
  client: string;
  status: RFPStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  owner: User;
  questions: number;
  answered: number;
  confidence: number; // 0-100
  value?: number;
}

export interface Question {
  id: string;
  rfpId: string;
  number: string;
  section: string;
  text: string;
  answer?: string;
  status: QuestionStatus;
  confidence: number;
  sources: Source[];
  reviewer?: User;
  updatedAt: string;
}

export interface Source {
  id: string;
  documentId: string;
  documentTitle: string;
  excerpt: string;
  page?: number;
  relevance: number;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: "policy" | "technical" | "product" | "security" | "legal" | "case_study";
  tags: string[];
  size: string;
  version: string;
  uploadedAt: string;
  uploadedBy: User;
  status: "indexed" | "processing" | "failed";
}

export interface ActivityItem {
  id: string;
  type: "upload" | "answer" | "approve" | "comment" | "create" | "export";
  actor: User;
  target: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
