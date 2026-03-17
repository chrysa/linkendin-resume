export interface ContactFormData {
  senderName: string;
  subject: string;
  message: string;
}

export interface GitHubIssuePayload {
  title: string;
  body: string;
  labels: string[];
}
