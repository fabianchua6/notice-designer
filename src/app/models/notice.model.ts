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

// Template variables that can be inserted into notices
export interface TemplateVariable {
  key: string;
  label: string;
  category: string;
  sampleValue: string;
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Taxpayer Information
  { key: '{{taxpayer.name}}', label: 'Taxpayer Name', category: 'Taxpayer', sampleValue: 'John Doe' },
  { key: '{{taxpayer.nric}}', label: 'NRIC/FIN', category: 'Taxpayer', sampleValue: 'S1234567A' },
  { key: '{{taxpayer.address}}', label: 'Address', category: 'Taxpayer', sampleValue: '123 Orchard Road, #12-34, Singapore 238888' },
  { key: '{{taxpayer.email}}', label: 'Email', category: 'Taxpayer', sampleValue: 'john.doe@email.com' },
  
  // Assessment Details
  { key: '{{assessment.year}}', label: 'Year of Assessment', category: 'Assessment', sampleValue: '2024' },
  { key: '{{assessment.type}}', label: 'Assessment Type', category: 'Assessment', sampleValue: 'Income Tax' },
  { key: '{{assessment.amount}}', label: 'Tax Amount', category: 'Assessment', sampleValue: '$5,234.00' },
  { key: '{{assessment.dueDate}}', label: 'Due Date', category: 'Assessment', sampleValue: '15 January 2025' },
  { key: '{{assessment.refNumber}}', label: 'Reference Number', category: 'Assessment', sampleValue: 'NOA-2024-123456' },
  
  // Notice Details
  { key: '{{notice.date}}', label: 'Notice Date', category: 'Notice', sampleValue: '11 December 2024' },
  { key: '{{notice.number}}', label: 'Notice Number', category: 'Notice', sampleValue: 'IRAS/IT/2024/001234' },
  { key: '{{notice.validUntil}}', label: 'Valid Until', category: 'Notice', sampleValue: '31 December 2025' },
  
  // Payment Details
  { key: '{{payment.bankName}}', label: 'Bank Name', category: 'Payment', sampleValue: 'DBS Bank' },
  { key: '{{payment.accountNo}}', label: 'Account Number', category: 'Payment', sampleValue: '001-234567-8' },
  { key: '{{payment.payNowRef}}', label: 'PayNow Reference', category: 'Payment', sampleValue: 'IRAS12345678' },
];
