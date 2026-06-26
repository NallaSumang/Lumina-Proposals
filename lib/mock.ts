import type {
  RFP,
  User,
  Question,
  KnowledgeDoc,
  ActivityItem,
  NotificationItem,
} from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Alex Morgan",
  email: "alex.morgan@tenderdox.com",
  role: "admin",
  title: "Head of Proposals",
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Priya Shah", email: "priya@tenderdox.com", role: "editor", title: "Solutions Architect" },
  { id: "u3", name: "Marcus Chen", email: "marcus@tenderdox.com", role: "reviewer", title: "Security Lead" },
  { id: "u4", name: "Sofia Reyes", email: "sofia@tenderdox.com", role: "editor", title: "Proposal Writer" },
  { id: "u5", name: "Daniel Okafor", email: "daniel@tenderdox.com", role: "viewer", title: "Account Executive" },
];

const clients = [
  "Acme Financial",
  "Northwind Health",
  "Globex Insurance",
  "Initech Federal",
  "Umbra Logistics",
  "Soylent Retail",
  "Pied Piper Cloud",
  "Stark Industries",
  "Wayne Enterprises",
  "Hooli Banking",
];

const titles = [
  "Cloud Security & Compliance RFP",
  "Enterprise Data Platform RFI",
  "Customer Identity & Access RFP",
  "Managed Detection & Response",
  "Procurement Automation Suite",
  "Vendor Risk Management Platform",
  "AI Knowledge Operations RFP",
  "Zero Trust Network Architecture",
  "Healthcare Interoperability Bid",
  "Federal Cyber Modernization",
];

const statuses: RFP["status"][] = ["draft", "processing", "in_review", "completed", "archived"];
const priorities: RFP["priority"][] = ["low", "medium", "high", "urgent"];

export const rfps: RFP[] = Array.from({ length: 24 }, (_, i) => {
  const total = 40 + ((i * 7) % 160);
  const answered = Math.floor(total * (0.3 + ((i % 7) / 10)));
  return {
    id: `rfp_${1000 + i}`,
    title: titles[i % titles.length],
    client: clients[i % clients.length],
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    dueDate: new Date(Date.now() + (i - 5) * 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    owner: users[i % users.length],
    questions: total,
    answered,
    confidence: 60 + ((i * 13) % 38),
    value: 50000 + ((i * 47000) % 2000000),
  };
});

export const knowledgeDocs: KnowledgeDoc[] = [
  { id: "k1", title: "SOC 2 Type II Report 2025", type: "security", tags: ["SOC2", "compliance"], size: "2.4 MB", version: "v3.1", uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(), uploadedBy: users[2], status: "indexed" },
  { id: "k2", title: "ISO 27001 Statement of Applicability", type: "security", tags: ["ISO27001"], size: "1.1 MB", version: "v2.0", uploadedAt: new Date(Date.now() - 86400000 * 8).toISOString(), uploadedBy: users[2], status: "indexed" },
  { id: "k3", title: "HIPAA BAA Template & Controls", type: "legal", tags: ["HIPAA", "healthcare"], size: "780 KB", version: "v1.4", uploadedAt: new Date(Date.now() - 86400000 * 12).toISOString(), uploadedBy: users[1], status: "indexed" },
  { id: "k4", title: "Product Security Whitepaper", type: "product", tags: ["security", "architecture"], size: "3.8 MB", version: "v4.0", uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(), uploadedBy: users[1], status: "indexed" },
  { id: "k5", title: "Data Processing Addendum (GDPR)", type: "legal", tags: ["GDPR", "privacy"], size: "640 KB", version: "v2.2", uploadedAt: new Date(Date.now() - 86400000 * 21).toISOString(), uploadedBy: users[0], status: "indexed" },
  { id: "k6", title: "Reference Architecture — Multi-Region", type: "technical", tags: ["architecture", "AWS"], size: "5.2 MB", version: "v1.0", uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(), uploadedBy: users[1], status: "indexed" },
  { id: "k7", title: "Acme Financial — Case Study", type: "case_study", tags: ["fintech"], size: "920 KB", version: "v1.0", uploadedAt: new Date(Date.now() - 86400000 * 30).toISOString(), uploadedBy: users[3], status: "indexed" },
  { id: "k8", title: "Incident Response Policy", type: "policy", tags: ["security", "policy"], size: "410 KB", version: "v3.3", uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(), uploadedBy: users[2], status: "processing" },
  { id: "k9", title: "Business Continuity & DR Plan", type: "policy", tags: ["BCP", "DR"], size: "1.7 MB", version: "v2.1", uploadedAt: new Date(Date.now() - 86400000 * 14).toISOString(), uploadedBy: users[0], status: "indexed" },
  { id: "k10", title: "API Reference & Rate Limits", type: "technical", tags: ["API", "developer"], size: "2.0 MB", version: "v6.0", uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(), uploadedBy: users[1], status: "indexed" },
  { id: "k11", title: "Penetration Test Summary 2025", type: "security", tags: ["pentest"], size: "1.3 MB", version: "v1.0", uploadedAt: new Date(Date.now() - 86400000 * 9).toISOString(), uploadedBy: users[2], status: "indexed" },
  { id: "k12", title: "Onboarding & Implementation Guide", type: "product", tags: ["onboarding"], size: "2.6 MB", version: "v2.5", uploadedAt: new Date(Date.now() - 86400000 * 18).toISOString(), uploadedBy: users[3], status: "indexed" },
];

const sections = ["Security", "Compliance", "Architecture", "Implementation", "Support", "Pricing", "Legal"];
const sampleQuestions = [
  "Describe your approach to data encryption at rest and in transit.",
  "Provide details on your SOC 2 Type II attestation and audit cadence.",
  "What is your standard SLA for production incidents and uptime?",
  "How do you handle multi-tenancy isolation in your platform?",
  "Describe your disaster recovery RPO and RTO commitments.",
  "What identity providers and SSO protocols do you support?",
  "Outline your sub-processor list and data residency options.",
  "Describe your secure software development lifecycle.",
  "How are customer-managed keys (CMK / BYOK) supported?",
  "Detail your role-based access control and audit logging.",
  "Provide information about your vulnerability management program.",
  "Describe your incident response and customer notification policy.",
];

export const questionsByRfp: Record<string, Question[]> = Object.fromEntries(
  rfps.map((r) => [
    r.id,
    Array.from({ length: 14 }, (_, i): Question => {
      const status: Question["status"] =
        i < 4 ? "approved" : i < 7 ? "answered" : i < 10 ? "needs_review" : i < 12 ? "pending" : "rejected";
      return {
        id: `${r.id}_q${i + 1}`,
        rfpId: r.id,
        number: `${Math.floor(i / 4) + 1}.${(i % 4) + 1}`,
        section: sections[i % sections.length],
        text: sampleQuestions[i % sampleQuestions.length],
        answer:
          status === "pending"
            ? undefined
            : `All customer data is encrypted at rest using AES-256 with envelope encryption via AWS KMS, and in transit with TLS 1.3. Encryption keys are rotated automatically every 90 days, and customers on Enterprise plans may bring their own keys (BYOK) via integration with their own KMS instance. Key access is governed by least-privilege IAM policies and reviewed quarterly as part of our SOC 2 controls.`,
        status,
        confidence: 55 + ((i * 11) % 44),
        sources: [
          { id: "s1", documentId: "k1", documentTitle: "SOC 2 Type II Report 2025", excerpt: "All production data stores employ AES-256 encryption at rest, with TLS 1.3 enforced for data in transit.", page: 14, relevance: 96 },
          { id: "s2", documentId: "k4", documentTitle: "Product Security Whitepaper", excerpt: "Envelope encryption is implemented via AWS KMS with customer-managed key support on Enterprise plans.", page: 8, relevance: 91 },
          { id: "s3", documentId: "k9", documentTitle: "Business Continuity & DR Plan", excerpt: "Key rotation occurs on a 90-day automated schedule and is audited quarterly.", page: 22, relevance: 78 },
        ],
        reviewer: status === "approved" || status === "needs_review" ? users[(i + 1) % users.length] : undefined,
        updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
      };
    }),
  ]),
);

export const activity: ActivityItem[] = [
  { id: "a1", type: "upload", actor: users[1], target: "Product Security Whitepaper v4.0", timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
  { id: "a2", type: "answer", actor: users[3], target: "RFP-1003 · Q2.4 Encryption", timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
  { id: "a3", type: "approve", actor: currentUser, target: "RFP-1001 · Q1.1 SOC 2 attestation", timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { id: "a4", type: "create", actor: users[4], target: "Acme Financial — Cloud Security RFP", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "a5", type: "comment", actor: users[2], target: "RFP-1005 · Q3.2 Multi-tenancy", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  { id: "a6", type: "export", actor: currentUser, target: "RFP-0998 final responses (DOCX)", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString() },
  { id: "a7", type: "upload", actor: users[2], target: "Penetration Test Summary 2025", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
];

export const notifications: NotificationItem[] = [
  { id: "n1", type: "success", title: "RFP processing complete", message: "Acme Financial RFP — 142 questions extracted and matched.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
  { id: "n2", type: "info", title: "Review requested", message: "Priya Shah requested your review on 6 answers.", timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), read: false },
  { id: "n3", type: "warning", title: "Low confidence answers", message: "9 answers in Globex Insurance RFP scored below 70%.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false },
  { id: "n4", type: "success", title: "Document indexed", message: "Product Security Whitepaper v4.0 added to knowledge base.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
  { id: "n5", type: "info", title: "Export ready", message: "RFP-0998 final responses are ready to download.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true },
];

// Charts data
export const weeklyActivity = [
  { day: "Mon", uploads: 12, answers: 48 },
  { day: "Tue", uploads: 19, answers: 64 },
  { day: "Wed", uploads: 14, answers: 71 },
  { day: "Thu", uploads: 22, answers: 89 },
  { day: "Fri", uploads: 28, answers: 96 },
  { day: "Sat", uploads: 8, answers: 22 },
  { day: "Sun", uploads: 5, answers: 14 },
];

export const confidenceDistribution = [
  { bucket: "0–60", value: 8 },
  { bucket: "60–70", value: 17 },
  { bucket: "70–80", value: 34 },
  { bucket: "80–90", value: 58 },
  { bucket: "90–100", value: 41 },
];

export const monthlyRfps = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  rfps: 4 + ((i * 5) % 18),
  hours: 30 + ((i * 17) % 120),
}));

export const stats = {
  totalRfps: rfps.length,
  pending: rfps.filter((r) => r.status === "processing" || r.status === "in_review").length,
  completed: rfps.filter((r) => r.status === "completed").length,
  knowledgeDocs: knowledgeDocs.length,
  avgConfidence: Math.round(rfps.reduce((s, r) => s + r.confidence, 0) / rfps.length),
  hoursSaved: 1284,
};
