export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
  status?: 'draft' | 'published';
}

// Template Categories
export type TemplateCategory = 'assessment' | 'statement' | 'notification' | 'acknowledgment' | 'reminder' | 'general' | 'other';

export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  category: string;
  sampleValue: string;
}

export interface MasterTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  content: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; icon: string }[] = [
  { value: 'assessment', label: 'Tax Assessment', icon: 'assessment' },
  { value: 'statement', label: 'Statement', icon: 'receipt_long' },
  { value: 'notification', label: 'Notification', icon: 'notifications' },
  { value: 'acknowledgment', label: 'Acknowledgment', icon: 'check_circle' },
  { value: 'reminder', label: 'Reminder', icon: 'schedule' },
  { value: 'general', label: 'General', icon: 'mail' },
  { value: 'other', label: 'Other', icon: 'description' }
];

// Template Variables for dynamic content
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Taxpayer Information
  { key: '{{taxpayer.name}}', label: 'Taxpayer Name', description: 'Full name of the taxpayer', category: 'Taxpayer', sampleValue: 'TAN AH KOW' },
  { key: '{{taxpayer.nric}}', label: 'NRIC/FIN', description: 'Identification number', category: 'Taxpayer', sampleValue: 'S1234567A' },
  { key: '{{taxpayer.address}}', label: 'Address', description: 'Mailing address', category: 'Taxpayer', sampleValue: '123 Orchard Road #12-34, Singapore 238888' },
  { key: '{{taxpayer.email}}', label: 'Email', description: 'Email address', category: 'Taxpayer', sampleValue: 'tanah.kow@email.com' },
  
  // Assessment Information
  { key: '{{assessment.year}}', label: 'Year of Assessment', description: 'The tax year', category: 'Assessment', sampleValue: '2024' },
  { key: '{{assessment.totalIncome}}', label: 'Total Income', description: 'Total assessable income', category: 'Assessment', sampleValue: '$85,000' },
  { key: '{{assessment.taxPayable}}', label: 'Tax Payable', description: 'Total tax amount', category: 'Assessment', sampleValue: '$3,350' },
  { key: '{{assessment.dueDate}}', label: 'Due Date', description: 'Payment due date', category: 'Assessment', sampleValue: '15 Apr 2024' },
  
  // Notice Information
  { key: '{{notice.date}}', label: 'Notice Date', description: 'Date of the notice', category: 'Notice', sampleValue: '15 Mar 2024' },
  { key: '{{notice.refNumber}}', label: 'Reference Number', description: 'Notice reference', category: 'Notice', sampleValue: 'NOA/2024/123456' },
  
  // Payment Information
  { key: '{{payment.amount}}', label: 'Payment Amount', description: 'Amount to pay', category: 'Payment', sampleValue: '$3,350.00' },
  { key: '{{payment.dueDate}}', label: 'Payment Due Date', description: 'When payment is due', category: 'Payment', sampleValue: '15 Apr 2024' },
  { key: '{{payment.method}}', label: 'Payment Method', description: 'How to pay', category: 'Payment', sampleValue: 'GIRO, Internet Banking, or AXS' }
];
