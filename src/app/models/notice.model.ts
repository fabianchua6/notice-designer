// Letter header configuration
export interface LetterHeader {
  showHeader: boolean;
  showHeaderOnAllPages: boolean; // Show condensed header on pages 2+
  taxRef: string;
  date: string;
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  showQuoteNote: boolean;
  showBarcode: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  header?: LetterHeader;
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
  templateId?: string;
}

// TODO: Future Enhancement - Component Library
// Create a reusable component library system for common document elements:
// - Header templates (letterhead, official header, simple header)
// - Table templates (key-value, data grid, summary table, income breakdown)
// - Info boxes (notice, warning, success, action required)
// - Signature blocks (officer, comptroller, system-generated)
// - Footer templates (IRAS standard, page numbers, contact info)
// Implementation approach:
// 1. Create ComponentLibrary interface with categories
// 2. Build drag-drop UI in editor
// 3. Store as JSON templates with preview thumbnails
// 4. Allow users to save custom components
// 5. Version control for system components

// Master Template - reusable templates for creating notices
export interface MasterTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  content: string;
  header?: LetterHeader;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  isSystem: boolean;
}

export type TemplateCategory = 
  | 'assessment' 
  | 'statement'
  | 'notification'
  | 'reminder' 
  | 'penalty' 
  | 'refund' 
  | 'acknowledgment'
  | 'general'
  | 'other';

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; icon: string }[] = [
  { value: 'assessment', label: 'Tax Assessment', icon: 'assignment' },
  { value: 'statement', label: 'Statement', icon: 'receipt_long' },
  { value: 'notification', label: 'Notification', icon: 'notifications' },
  { value: 'reminder', label: 'Payment Reminder', icon: 'schedule' },
  { value: 'penalty', label: 'Penalty Notice', icon: 'warning' },
  { value: 'refund', label: 'Refund Notice', icon: 'payments' },
  { value: 'acknowledgment', label: 'Acknowledgment', icon: 'check_circle' },
  { value: 'general', label: 'General Notice', icon: 'mail' },
  { value: 'other', label: 'Other', icon: 'description' },
];

// Template variables that can be inserted into notices
export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  category: string;
  sampleValue: string;
  isList?: boolean;  // Indicates this is a list/array variable
}

// List variable definition for arrays
export interface ListVariable {
  key: string;
  label: string;
  description: string;
  category: string;
  itemFields: { key: string; label: string; sampleValue: string }[];
  sampleData: Record<string, any>[];
}

// Available list variables for loop templates
export const LIST_VARIABLES: ListVariable[] = [
  {
    key: 'incomeItems',
    label: 'Income Items',
    description: 'List of income sources (employment, rental, etc.)',
    category: 'Income',
    itemFields: [
      { key: 'source', label: 'Source', sampleValue: 'Employment Income' },
      { key: 'employer', label: 'Employer/Payer', sampleValue: 'ABC Company Pte Ltd' },
      { key: 'amount', label: 'Amount', sampleValue: '30,000.00' },
    ],
    sampleData: [
      { source: 'Employment Income', employer: 'BINARY TECHNOLOGY PTE. LTD.', amount: '29,795.00' },
      { source: 'NSman Pay', employer: 'MINDEF', amount: '223.00' },
    ]
  },
  {
    key: 'deductionItems',
    label: 'Deduction Items',
    description: 'List of tax deductions and reliefs',
    category: 'Deductions',
    itemFields: [
      { key: 'type', label: 'Type', sampleValue: 'Earned Income Relief' },
      { key: 'description', label: 'Description', sampleValue: 'Standard relief for earned income' },
      { key: 'amount', label: 'Amount', sampleValue: '1,000.00' },
    ],
    sampleData: [
      { type: 'Earned Income Relief', description: 'Standard relief for earned income', amount: '1,000.00' },
      { type: 'CPF/Provident Fund Relief', description: 'CPF contributions', amount: '600.00' },
      { type: 'NSman Relief', description: 'National Service relief', amount: '3,000.00' },
    ]
  },
  {
    key: 'paymentHistory',
    label: 'Payment History',
    description: 'List of past payments made',
    category: 'Payment',
    itemFields: [
      { key: 'date', label: 'Date', sampleValue: '15 Oct 2025' },
      { key: 'method', label: 'Method', sampleValue: 'GIRO' },
      { key: 'amount', label: 'Amount', sampleValue: '100.00' },
      { key: 'reference', label: 'Reference', sampleValue: 'PAY-2025-001' },
    ],
    sampleData: [
      { date: '15 Oct 2025', method: 'GIRO', amount: '100.00', reference: 'PAY-2025-001' },
      { date: '15 Nov 2025', method: 'GIRO', amount: '100.00', reference: 'PAY-2025-002' },
    ]
  },
];

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Taxpayer Information
  { key: '{{taxpayer.name}}', label: 'Taxpayer Name', category: 'Taxpayer', sampleValue: 'TAN AH KOW' },
  { key: '{{taxpayer.taxRef}}', label: 'Tax Reference No.', category: 'Taxpayer', sampleValue: 'S1234567A' },
  { key: '{{taxpayer.nric}}', label: 'NRIC/FIN', category: 'Taxpayer', sampleValue: 'S1234567A' },
  { key: '{{taxpayer.address}}', label: 'Address', category: 'Taxpayer', sampleValue: '123 ORCHARD ROAD\n#12-34\nSINGAPORE 238888' },
  { key: '{{taxpayer.email}}', label: 'Email', category: 'Taxpayer', sampleValue: 'john.doe@email.com' },
  { key: '{{taxpayer.salutation}}', label: 'Salutation', category: 'Taxpayer', sampleValue: 'Sir' },
  
  // Assessment Details
  { key: '{{assessment.year}}', label: 'Year of Assessment', category: 'Assessment', sampleValue: '2025' },
  { key: '{{assessment.incomeYear}}', label: 'Income Year', category: 'Assessment', sampleValue: '2024' },
  { key: '{{assessment.type}}', label: 'Assessment Type', category: 'Assessment', sampleValue: 'Income Tax' },
  { key: '{{assessment.amount}}', label: 'Tax Amount', category: 'Assessment', sampleValue: '$43.28' },
  { key: '{{assessment.dueDate}}', label: 'Due Date', category: 'Assessment', sampleValue: '07 Nov 2025' },
  { key: '{{assessment.refNumber}}', label: 'Reference Number', category: 'Assessment', sampleValue: 'NOA-2025-123456' },
  
  // Income Details
  { key: '{{income.total}}', label: 'Total Income', category: 'Income', sampleValue: '30,018.00' },
  { key: '{{income.employment}}', label: 'Employment Income', category: 'Income', sampleValue: '30,018.00' },
  { key: '{{income.chargeable}}', label: 'Chargeable Income', category: 'Income', sampleValue: '25,410.00' },
  { key: '{{income.other}}', label: 'Other Income', category: 'Income', sampleValue: '223.00' },
  { key: '{{income.nsman}}', label: 'NSman Pay', category: 'Income', sampleValue: '223.00' },
  
  // Employer Details
  { key: '{{employer1.name}}', label: 'Employer 1 Name', category: 'Employer', sampleValue: 'BINARY TECHNOLOGY DEVELOPMENT PTE. LTD.' },
  { key: '{{employer1.total}}', label: 'Employer 1 Total', category: 'Employer', sampleValue: '29,795.00' },
  { key: '{{employer1.amount}}', label: 'Employer 1 Amount', category: 'Employer', sampleValue: '26,767.00' },
  { key: '{{employer1.salary}}', label: 'Employer 1 Salary', category: 'Employer', sampleValue: '26,700.00' },
  { key: '{{employer1.bonus}}', label: 'Employer 1 Bonus', category: 'Employer', sampleValue: '67.00' },
  
  // Deductions
  { key: '{{deductions.total}}', label: 'Total Deductions', category: 'Deductions', sampleValue: '4,608.00' },
  { key: '{{deductions.donations}}', label: 'Total Donations', category: 'Deductions', sampleValue: '8.00' },
  { key: '{{deductions.reliefs}}', label: 'Total Reliefs', category: 'Deductions', sampleValue: '4,600.00' },
  { key: '{{donations.amount}}', label: 'Donations Amount', category: 'Deductions', sampleValue: '7.50' },
  { key: '{{donations.employer1}}', label: 'Donations via Employer 1', category: 'Deductions', sampleValue: '2.50' },
  
  // Reliefs
  { key: '{{relief.earnedIncome}}', label: 'Earned Income Relief', category: 'Reliefs', sampleValue: '1,000.00' },
  { key: '{{relief.cpf}}', label: 'CPF/Provident Fund Relief', category: 'Reliefs', sampleValue: '600.00' },
  { key: '{{relief.cpfAmount}}', label: 'CPF Amount', category: 'Reliefs', sampleValue: '600.00' },
  { key: '{{relief.nsman}}', label: 'NSman Relief Total', category: 'Reliefs', sampleValue: '3,000.00' },
  { key: '{{relief.nsmanAmount}}', label: 'NSman Relief Amount', category: 'Reliefs', sampleValue: '3,000.00' },
  
  // Tax Computation
  { key: '{{tax.bracket}}', label: 'Tax Bracket', category: 'Tax', sampleValue: '5,410.00 @ 2%' },
  { key: '{{tax.rate}}', label: 'Tax Rate', category: 'Tax', sampleValue: '2%' },
  { key: '{{tax.grossTax}}', label: 'Gross Tax', category: 'Tax', sampleValue: '108.20' },
  { key: '{{tax.rebate}}', label: 'Tax Rebate', category: 'Tax', sampleValue: '64.92' },
  
  // Notice Details
  { key: '{{notice.date}}', label: 'Notice Date', category: 'Notice', sampleValue: '07 Oct 2025' },
  { key: '{{notice.number}}', label: 'Notice Number', category: 'Notice', sampleValue: 'CFN03101 105-23-143430854-0-6' },
  { key: '{{notice.validUntil}}', label: 'Valid Until', category: 'Notice', sampleValue: '31 December 2025' },
  { key: '{{notice.refNumber}}', label: 'Reference Number', category: 'Notice', sampleValue: 'NOA/2024/123456' },
  { key: '{{amendment.deadline}}', label: 'Amendment Deadline', category: 'Notice', sampleValue: '06 Nov 2025' },
  
  // Payment Details
  { key: '{{payment.amount}}', label: 'Payment Amount', category: 'Payment', sampleValue: '$43.28' },
  { key: '{{payment.dueDate}}', label: 'Payment Due Date', category: 'Payment', sampleValue: '07 Nov 2025' },
  { key: '{{payment.ackNumber}}', label: 'Acknowledgment No.', category: 'Payment', sampleValue: '2020001257959' },
  { key: '{{payment.dateTime}}', label: 'Payment Date/Time', category: 'Payment', sampleValue: '10 Oct 2025 11:14 PM' },
  { key: '{{payment.bankName}}', label: 'Bank Name', category: 'Payment', sampleValue: 'DBS Bank' },
  { key: '{{payment.accountNo}}', label: 'Account Number', category: 'Payment', sampleValue: '001-234567-8' },
  { key: '{{payment.payNowRef}}', label: 'PayNow Reference', category: 'Payment', sampleValue: 'IRAS12345678' },
  { key: '{{payment.method}}', label: 'Payment Method', category: 'Payment', sampleValue: 'GIRO, Internet Banking, or AXS' },
];
