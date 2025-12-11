import { Injectable, signal } from '@angular/core';
import { MasterTemplate, TemplateCategory } from '../models/notice.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private templates = signal<MasterTemplate[]>([]);
  
  constructor() {
    this.loadTemplates();
  }
  
  getTemplates() {
    return this.templates.asReadonly();
  }
  
  getTemplatesByCategory(category: TemplateCategory): MasterTemplate[] {
    return this.templates().filter(t => t.category === category);
  }
  
  getTemplateById(id: string): MasterTemplate | undefined {
    return this.templates().find(t => t.id === id);
  }
  
  addTemplate(template: Omit<MasterTemplate, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'>): MasterTemplate {
    const newTemplate: MasterTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystem: false,
    };
    
    this.templates.update(templates => [...templates, newTemplate]);
    this.saveTemplates();
    return newTemplate;
  }
  
  updateTemplate(id: string, updates: Partial<MasterTemplate>): void {
    this.templates.update(templates =>
      templates.map(template =>
        template.id === id && !template.isSystem
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      )
    );
    this.saveTemplates();
  }
  
  deleteTemplate(id: string): void {
    const template = this.getTemplateById(id);
    if (template && !template.isSystem) {
      this.templates.update(templates => templates.filter(t => t.id !== id));
      this.saveTemplates();
    }
  }
  
  private generateId(): string {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private saveTemplates(): void {
    try {
      // Only save non-system templates
      const userTemplates = this.templates().filter(t => !t.isSystem);
      localStorage.setItem('masterTemplates', JSON.stringify(userTemplates));
    } catch (error) {
      console.error('Failed to save templates to localStorage:', error);
    }
  }
  
  private loadTemplates(): void {
    // Start with system templates
    const systemTemplates = this.getSystemTemplates();
    
    // Load user templates from localStorage
    try {
      const stored = localStorage.getItem('masterTemplates');
      if (stored) {
        const parsed = JSON.parse(stored);
        const userTemplates = parsed.map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
          isSystem: false,
        }));
        this.templates.set([...systemTemplates, ...userTemplates]);
      } else {
        this.templates.set(systemTemplates);
      }
    } catch (error) {
      console.error('Failed to load templates from localStorage:', error);
      this.templates.set(systemTemplates);
    }
  }
  
  private getSystemTemplates(): MasterTemplate[] {
    return [
      {
        id: 'system-noa',
        name: 'Income Tax - Notice of Assessment',
        description: 'Official NOA with income, deductions, and tax computation summary',
        category: 'assessment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- IRAS Header -->
<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 70%;">
      <p style="margin: 0; font-size: 11px;">Tax Reference Number: <strong>{{taxpayer.taxRef}}</strong></p>
      <p style="margin: 0; font-size: 11px;">Date: {{notice.date}}</p>
      <p style="margin-top: 10px; font-size: 11px;">Please quote the Tax Reference Number (e.g. NRIC, FIN etc.) in full when corresponding with us.</p>
      <p style="margin-top: 10px; font-size: 11px;">
        <strong>{{taxpayer.name}}</strong><br>
        {{taxpayer.address}}
      </p>
    </td>
    <td style="width: 30%; text-align: right; vertical-align: top;">
      <p style="font-size: 11px; color: #666; text-align: right;">
        <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
        <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
        <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
      </p>
    </td>
  </tr>
</table>

<!-- Title Banner -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 12px 20px; margin: 30px 0 20px 0; border-radius: 4px;">
  <h2 style="margin: 0; font-size: 18px; font-weight: 500;">Income Tax – Notice of Assessment (Original)</h2>
</div>

<!-- Action Box -->
<div style="background-color: #e8f4fc; border-left: 4px solid #2d7bb9; padding: 15px 20px; margin-bottom: 20px;">
  <h3 style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 16px;">What do you need to do?</h3>
  <p style="margin: 0; font-size: 14px;">
    Please pay <strong style="font-size: 20px;">{{payment.amount}}</strong> by <strong>{{payment.dueDate}}</strong>.
  </p>
  <p style="margin: 8px 0 0 0; font-size: 11px; color: #666; font-style: italic;">
    Payment made after {{notice.date}} may not be reflected in this notice.
  </p>
</div>

<!-- How to Pay -->
<h4 style="margin: 0 0 8px 0; font-size: 13px;">How to Pay?</h4>
<p style="font-size: 12px; margin-bottom: 20px;">
  Please login to myTax Portal and <a href="#" style="color: #2d7bb9;">apply GIRO</a> to enjoy up to 12 interest-free monthly instalments or <a href="#" style="color: #2d7bb9;">pay</a> in full via PayNow QR or AXS by the due date to avoid late payment penalties and <a href="#" style="color: #2d7bb9;">other recovery actions</a>.
</p>

<!-- Year of Assessment Header -->
<h3 style="text-align: center; margin: 25px 0 15px 0; font-size: 14px; font-weight: bold;">YEAR OF ASSESSMENT {{assessment.year}}</h3>

<!-- Income/Deductions/Tax Summary Table -->
<table style="width: 100%; border-collapse: collapse; font-size: 11px;">
  <tr>
    <!-- Income Column -->
    <td style="width: 33%; vertical-align: top; padding-right: 10px;">
      <div style="border: 2px solid #2d7bb9; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #2d7bb9; color: white; padding: 8px; text-align: center;">
          <strong>+ INCOME^</strong> <span style="float: right;">($)</span>
        </div>
        <div style="padding: 8px;">
          <p style="margin: 0; text-align: right; font-size: 14px;"><strong>{{income.total}}</strong></p>
          <table style="width: 100%; margin-top: 8px; font-size: 10px;">
            <tr style="background-color: #e8f4fc;">
              <td style="padding: 4px;"><strong>EMPLOYMENT</strong></td>
              <td style="text-align: right; padding: 4px;">{{income.employment}}</td>
            </tr>
          </table>
          <p style="margin: 8px 0 0 0; font-size: 9px; color: #666;">^ All income are net after deduction of expenses.</p>
        </div>
      </div>
    </td>
    
    <!-- Deductions Column -->
    <td style="width: 33%; vertical-align: top; padding: 0 5px;">
      <div style="border: 2px solid #ff9800; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #ff9800; color: white; padding: 8px; text-align: center;">
          <strong>- DEDUCTIONS</strong> <span style="float: right;">($)</span>
        </div>
        <div style="padding: 8px;">
          <p style="margin: 0; text-align: right; font-size: 14px;"><strong>{{deductions.total}}</strong></p>
          <table style="width: 100%; margin-top: 8px; font-size: 10px;">
            <tr style="background-color: #fff8e1;">
              <td style="padding: 4px;"><strong>DONATIONS</strong></td>
              <td style="text-align: right; padding: 4px;">{{deductions.donations}}</td>
            </tr>
            <tr style="background-color: #fff8e1;">
              <td style="padding: 4px;"><strong>RELIEFS</strong></td>
              <td style="text-align: right; padding: 4px;">{{deductions.reliefs}}</td>
            </tr>
            <tr>
              <td style="padding: 4px; padding-left: 12px;">Earned Income</td>
              <td style="text-align: right; padding: 4px;">{{relief.earnedIncome}}</td>
            </tr>
            <tr>
              <td style="padding: 4px; padding-left: 12px;">NSman-self/wife/parent</td>
              <td style="text-align: right; padding: 4px;">{{relief.nsman}}</td>
            </tr>
            <tr>
              <td style="padding: 4px; padding-left: 12px;">Provident Fund/Life Insurance</td>
              <td style="text-align: right; padding: 4px;">{{relief.cpf}}</td>
            </tr>
          </table>
        </div>
      </div>
    </td>
    
    <!-- Chargeable Income Column -->
    <td style="width: 33%; vertical-align: top; padding-left: 10px;">
      <div style="border: 2px solid #4caf50; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #4caf50; color: white; padding: 8px; text-align: center;">
          <strong>= CHARGEABLE INCOME</strong> <span style="float: right;">($)</span>
        </div>
        <div style="padding: 8px;">
          <p style="margin: 0; text-align: right; font-size: 14px;"><strong>{{income.chargeable}}</strong></p>
          <table style="width: 100%; margin-top: 8px; font-size: 10px; border: 1px solid #ddd;">
            <tr style="background-color: #e8f5e9;">
              <td colspan="2" style="padding: 4px;"><strong>TAX COMPUTATION</strong></td>
            </tr>
            <tr>
              <td style="padding: 4px;">First {{tax.bracket}} @ {{tax.rate}}</td>
              <td style="text-align: right; padding: 4px;">{{tax.grossTax}}</td>
            </tr>
            <tr>
              <td style="padding: 4px;"><em>Less:</em></td>
              <td></td>
            </tr>
            <tr>
              <td style="padding: 4px;">60% Tax Rebate (capped at $200)</td>
              <td style="text-align: right; padding: 4px;">{{tax.rebate}}</td>
            </tr>
            <tr style="background-color: #ffeb3b;">
              <td style="padding: 6px;"><strong>Tax Payable</strong><br>by {{payment.dueDate}}</td>
              <td style="text-align: right; padding: 6px; font-size: 14px;"><strong>{{payment.amount}}</strong></td>
            </tr>
          </table>
        </div>
      </div>
    </td>
  </tr>
</table>

<!-- Footer -->
<div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 6351 3551</p>
  <p style="margin: 5px 0;">Page 1 of 2 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
      },
      {
        id: 'system-noa-page2',
        name: 'NOA - Page 2 (Instructions)',
        description: 'Second page of NOA with instructions and signature',
        category: 'assessment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- IRAS Header -->
<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 70%;">
      <p style="margin: 0; font-size: 11px;">Tax Reference Number: <strong>{{taxpayer.taxRef}}</strong></p>
      <p style="margin: 0; font-size: 11px;">Date: {{notice.date}}</p>
    </td>
    <td style="width: 30%; text-align: right; vertical-align: top;">
      <p style="font-size: 11px; color: #666; text-align: right;">
        <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
        <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
        <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
      </p>
    </td>
  </tr>
</table>

<ul style="font-size: 12px; line-height: 1.8;">
  <li>Your tax assessment is based on information obtained from the relevant organisations and your last year's tax record, if any. View 'Pre-Filled Income and Deduction Statement' under 'View Notices' at myTax Portal for the breakdown of your pre-filled income and reliefs. Please notify us of any understatement or omission of any income or of any excessive tax relief as there are penalties for failing to do so.</li>
  
  <li>To amend your assessment, use <a href="#" style="color: #2d7bb9;">Amend Tax Bill</a> under 'Individuals' at myTax Portal within 30 days, i.e. by <strong>{{amendment.deadline}}</strong>. Please pay the amount, if any, in this Notice by the due date, even if you object to this assessment. If you are unable to use the digital service, please email via myTax Mail or write in to us.</li>
  
  <li>Please pay your taxes, if any, by the due date to avoid late payment penalties and <a href="#" style="color: #2d7bb9;">other recovery actions</a>.</li>
  
  <li><a href="#" style="color: #2d7bb9;">View Account Summary</a> under 'Account' at myTax Portal for your latest income tax balance.</li>
</ul>

<p style="font-size: 12px; margin-top: 20px; padding: 10px; background-color: #fff3cd; border-radius: 4px;">
  <strong>If you need help with your tax payment, please check go.gov.sg/iras-difficulty-paying-tax on how you may apply for a longer GIRO payment arrangement.</strong>
</p>

<div style="margin-top: 40px;">
  <p style="font-family: 'Brush Script MT', cursive; font-size: 28px; margin: 0;">OwFookChuen</p>
  <p style="margin: 10px 0 0 0; font-size: 12px;">
    <strong>OW FOOK CHUEN</strong><br>
    COMPTROLLER OF INCOME TAX
  </p>
</div>

<!-- Footer -->
<div style="margin-top: 60px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 6351 3551</p>
  <p style="margin: 5px 0;">Page 2 of 2 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
      },
      {
        id: 'system-prefilled',
        name: 'Pre-Filled Income and Deduction Statement',
        description: 'Detailed breakdown of income sources and deductions',
        category: 'assessment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- IRAS Header -->
<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 70%;">
      <p style="margin: 0; font-size: 11px;">Tax Reference Number: <strong>{{taxpayer.taxRef}}</strong></p>
    </td>
    <td style="width: 30%; text-align: right; vertical-align: top;">
      <p style="font-size: 11px; color: #666; text-align: right;">
        <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
        <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
        <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
      </p>
    </td>
  </tr>
</table>

<!-- Title Banner -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 12px 20px; margin: 30px 0 15px 0; border-radius: 4px;">
  <h2 style="margin: 0; font-size: 18px; font-weight: 500;">Pre-Filled Income and Deduction Statement</h2>
</div>

<table style="width: 100%; font-size: 12px; margin-bottom: 20px;">
  <tr>
    <td><strong>Year of Assessment:</strong></td>
    <td><strong>YA {{assessment.year}}</strong></td>
  </tr>
</table>

<p style="font-size: 11px; margin-bottom: 20px; color: #666;">
  This statement includes information that IRAS received from the relevant organisations and pre-filled deductions based on information available to us, which may include reliefs allowed to you previously (as at {{notice.date}}).
</p>

<!-- Employment Income Section -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 8px 15px; margin-top: 20px; border-radius: 4px 4px 0 0;">
  <table style="width: 100%; color: white;">
    <tr>
      <td><strong>Employment Income and Expenses</strong></td>
      <td style="text-align: right;"><strong>S\${{income.employment}}</strong></td>
    </tr>
  </table>
</div>

<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
  <tr style="background-color: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Employer(s) under Auto Inclusion Scheme</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{employer1.total}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 20px;">{{employer1.name}}</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{employer1.amount}}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 40px;">Salary</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{employer1.salary}}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 40px;">Bonus</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{employer1.bonus}}</td>
  </tr>
  <tr style="background-color: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Income from relevant Organisation(s)</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{income.other}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 20px;">NSman Pay</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{income.nsman}}</td>
  </tr>
</table>

<!-- Deductions Section -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 8px 15px; margin-top: 20px; border-radius: 4px 4px 0 0;">
  <table style="width: 100%; color: white;">
    <tr>
      <td><strong>Deductions, Tax Reliefs and Rebates</strong></td>
      <td style="text-align: right;"><strong>S\${{deductions.total}}</strong></td>
    </tr>
  </table>
</div>

<table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
  <tr style="background-color: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Donations</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{deductions.donations}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 20px;">Donations through<br>Amount allowed</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{donations.amount}}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 40px;">{{employer1.name}}</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{donations.employer1}}</td>
  </tr>
  <tr style="background-color: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Reliefs</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{deductions.reliefs}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Earned Income Relief</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{relief.earnedIncome}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>CPF/Provident Fund Relief</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{relief.cpf}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px 8px 8px 20px; border: 1px solid #ddd; font-size: 10px; color: #666;">
      Employee's Compulsory Contribution to CPF/Provident Fund Through<br>
      CPF Relief is capped by the amount of compulsory employee CPF contributions made on Ordinary Wages and Additional Wages under the CPF Act.
    </td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{relief.cpfAmount}}</td>
  </tr>
  <tr style="background-color: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Relief(s) from relevant Organisations</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>S\${{relief.nsman}}</strong></td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; padding-left: 20px;">NSman Relief - Self/Wife/Parent</td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{{relief.nsmanAmount}}</td>
  </tr>
</table>

<!-- Footer -->
<div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 1800-3568300</p>
  <p style="margin: 5px 0;">Page 1 of 2 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
      },
      {
        id: 'system-nfs',
        name: 'No-Filing Service (NFS) Notification',
        description: 'Letter informing taxpayer no filing is required',
        category: 'acknowledgment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- IRAS Header -->
<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 70%;">
      <p style="margin: 0; font-size: 11px;">Tax Reference Number: <strong>{{taxpayer.taxRef}}</strong></p>
      <p style="margin: 0; font-size: 11px;">Date: {{notice.date}}</p>
      <p style="margin-top: 10px; font-size: 11px;">Please quote the Tax Reference Number (e.g. NRIC, FIN etc.) in full when corresponding with us.</p>
      <p style="margin-top: 10px; font-size: 11px;">
        <strong>{{taxpayer.name}}</strong><br>
        {{taxpayer.address}}
      </p>
    </td>
    <td style="width: 30%; text-align: right; vertical-align: top;">
      <p style="font-size: 11px; color: #666; text-align: right;">
        <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
        <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
        <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
      </p>
    </td>
  </tr>
</table>

<!-- Barcode placeholder -->
<p style="font-family: 'Libre Barcode 128', monospace; font-size: 40px; margin: 20px 0;">|||||||||||||||||||||||||||</p>

<!-- Title Banner -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 12px 20px; margin: 30px 0 20px 0; border-radius: 4px;">
  <h2 style="margin: 0; font-size: 16px; font-weight: 500;">No-Filing Service for Year of Assessment {{assessment.year}}</h2>
  <p style="margin: 5px 0 0 0; font-size: 13px;">(for income earned in year {{assessment.incomeYear}})</p>
</div>

<p style="font-size: 12px;">Dear Sir</p>

<p style="font-size: 12px; line-height: 1.6;">
  You are not required to file an Income Tax Return for the Year of Assessment {{assessment.year}} as you have been selected for the No-Filing Service (NFS) this year.
</p>

<p style="font-size: 12px; line-height: 1.6;">
  You will receive your tax bill (Notice of Assessment) computed based on your pre-filled income /relief/ deductions and/or previous year's relief claims (with adjustments if you do not meet the eligibility criteria).
</p>

<p style="font-size: 12px; line-height: 1.6;">
  <strong>It is your responsibility to ensure that your tax bill is accurate.</strong>
</p>

<!-- What do you need to do box -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 10px 15px; margin: 20px 0 0 0; border-radius: 4px 4px 0 0;">
  <h3 style="margin: 0; font-size: 14px; font-weight: 500;">What do you need to do?</h3>
</div>
<div style="background-color: #e8f4fc; padding: 15px; border: 1px solid #2d7bb9; border-top: none; margin-bottom: 20px;">
  <ul style="font-size: 12px; line-height: 1.8; margin: 0; padding-left: 20px;">
    <li>You may verify your pre-filled information by logging in to <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a> within 21 days from the date of this letter with your Singpass or Singpass Foreign user Account (SFA).</li>
    <li>Select "<a href="#" style="color: #2d7bb9;">File Income Tax Return</a>" to view your pre-filled information.</li>
    <li>If your pre-filled information is accurate, you may request to receive your tax bill early.</li>
    <li>If you wish to make changes, you may file your Income Tax Return. However, for discrepancies in your pre-filled employment income, please contact your employer(s) directly to clarify.</li>
    <li>Update your current mobile number and/or email address by selecting "<a href="#" style="color: #2d7bb9;">Update Contact and Notification Preferences</a>" to receive important notifications on your tax matters.</li>
  </ul>
</div>

<!-- Footer -->
<div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 6351 3551</p>
  <p style="margin: 5px 0;">Page 1 of 2 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
      },
      {
        id: 'system-nfs-page2',
        name: 'NFS Notification - Page 2',
        description: 'Second page with instructions after receiving tax bill',
        category: 'acknowledgment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- IRAS Header -->
<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 70%;">
      <p style="margin: 0; font-size: 11px;">Tax Reference Number: <strong>{{taxpayer.taxRef}}</strong></p>
      <p style="margin: 0; font-size: 11px;">Date: {{notice.date}}</p>
    </td>
    <td style="width: 30%; text-align: right; vertical-align: top;">
      <p style="font-size: 11px; color: #666; text-align: right;">
        <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
        <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
        <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
      </p>
    </td>
  </tr>
</table>

<!-- What do you need to do box -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 10px 15px; margin: 30px 0 0 0; border-radius: 4px 4px 0 0;">
  <h3 style="margin: 0; font-size: 14px; font-weight: 500;">What do you need to do?</h3>
</div>
<div style="background-color: #e8f4fc; padding: 15px; border: 1px solid #2d7bb9; border-top: none; margin-bottom: 20px;">
  <p style="font-size: 12px; margin: 0 0 10px 0;"><strong><u>After receiving the tax bill</u></strong></p>
  <ul style="font-size: 12px; line-height: 1.8; margin: 0; padding-left: 20px;">
    <li>Ensure that the tax bill is accurate.</li>
    <li>If there are discrepancies in your pre-filled employment income, please contact your employer(s) directly to clarify.</li>
    <li>If you have any other income that is not shown in the tax bill, or if your relief claims in the tax bill are incorrect, you <strong>must</strong> inform us <strong>within 30 days</strong> from the date of your tax bill. There are penalties for failing to report any incorrect information in your tax bill.</li>
    <li>To do so, log in to <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a> using your Singpass or SFA, select "<a href="#" style="color: #2d7bb9;">Amend Tax Bill</a>".</li>
  </ul>
</div>

<p style="font-size: 12px; line-height: 1.6;">
  For individuals with NRIC or FIN number, register for Singpass at <a href="https://go.gov.sg/register-singpass" style="color: #2d7bb9;">go.gov.sg/register-singpass</a>, if you do not have one. For other individuals, apply for SFA at <a href="https://go.gov.sg/iras-sfa-info" style="color: #2d7bb9;">go.gov.sg/iras-sfa-info</a>.
</p>

<div style="margin-top: 30px;">
  <p style="font-size: 12px;">Yours faithfully</p>
  <p style="margin: 20px 0 0 0; font-size: 12px;">
    <strong>TAN JEK SWAN (MS)</strong><br>
    ASSISTANT COMMISSIONER<br>
    INDIVIDUAL INCOME TAX DIVISION<br>
    for COMPTROLLER OF INCOME TAX
  </p>
  <p style="font-size: 10px; color: #666; font-style: italic; margin-top: 10px;">
    This is a system-generated letter and no signature is required.
  </p>
</div>

<!-- Footer -->
<div style="margin-top: 60px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 6351 3551</p>
  <p style="margin: 5px 0;">Page 2 of 2 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
      },
      {
        id: 'system-payment-ack',
        name: 'Payment Acknowledgment',
        description: 'Confirmation of pending tax payment',
        category: 'acknowledgment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- Header Bar -->
<div style="background-color: #f0f0f0; padding: 6px 12px; font-size: 11px; margin-bottom: 15px;">
  🔴 A Singapore Government Agency Website
</div>

<!-- IRAS Logo -->
<p style="font-size: 11px; color: #666; margin-bottom: 20px;">
  <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
  <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
  <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
</p>

<!-- User Info Bar -->
<div style="background-color: #e8f4fc; padding: 8px 15px; border-bottom: 3px solid #2d7bb9; margin-bottom: 30px;">
  <strong>{{taxpayer.taxRef}}</strong> | <strong>{{taxpayer.name}}</strong>
</div>

<h1 style="font-size: 24px; font-weight: normal; margin: 0 0 30px 0;">Pay Taxes</h1>

<h2 style="font-size: 18px; font-weight: bold; margin: 0 0 20px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Acknowledgement</h2>

<!-- Pending Payment Box -->
<div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; margin-bottom: 20px;">
  <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Pending Payment</h3>
  <p style="margin: 0 0 15px 0; font-size: 12px;">Your account will only be updated after IRAS receives your payment.</p>
  
  <table style="width: 100%; font-size: 12px;">
    <tr>
      <td><strong>Acknowledgement No.</strong></td>
      <td>{{payment.ackNumber}}</td>
      <td><strong>Date/Time</strong></td>
      <td>{{payment.dateTime}}</td>
    </tr>
  </table>
  
  <p style="margin: 15px 0 0 0; font-size: 12px;">
    A copy of this acknowledgement is available at <a href="#" style="color: #2d7bb9;">View Notices</a> digital service.
  </p>
</div>

<!-- Amount Payable Box -->
<table style="width: 100%; border: 2px solid #20b4af; margin-bottom: 20px;">
  <tr>
    <td style="width: 30%; background-color: #e0f7fa; padding: 20px; vertical-align: top;">
      <p style="margin: 0; font-size: 12px; font-weight: bold;">Amount Payable</p>
      <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">S\${{payment.amount}}</p>
    </td>
    <td style="padding: 20px; vertical-align: top;">
      <p style="margin: 0; font-size: 12px;">
        You are making payment for Individual Income Tax. As you have selected to pay via other offline modes, please quote the following Tax Ref No. when making payment:
      </p>
      <div style="background-color: #f8f9fa; border: 1px solid #ddd; padding: 10px; margin-top: 10px; display: inline-block;">
        <p style="margin: 0; font-size: 11px; font-weight: bold;">Tax Ref No.</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>{{taxpayer.taxRef}}</strong> <span style="color: #2d7bb9; cursor: pointer;">📋 COPY</span></p>
      </div>
    </td>
  </tr>
</table>

<p style="font-size: 12px; margin-bottom: 15px;">Pending payment for the following account(s):</p>
<p style="font-size: 11px; color: #666;">1 - 1 of 1 Record(s)</p>

<!-- Payment Table -->
<table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
  <tr style="background-color: #f8f9fa;">
    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Tax Account</th>
    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Amount Payable (S$)</th>
    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Amount Paid (S$)</th>
    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Balance (S$)</th>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;">Individual Income Tax</td>
    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">{{payment.amount}}</td>
    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">0.00</td>
    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">{{payment.amount}}</td>
  </tr>
</table>

<!-- Summary Row -->
<table style="width: 100%; font-size: 12px;">
  <tr>
    <td style="background-color: #fff3cd; padding: 10px; width: 33%;">
      <strong>Balance (S$)</strong><br>
      {{payment.amount}}
    </td>
    <td style="background-color: #fff3cd; padding: 10px; width: 33%;">
      <strong>Total Amount Payable (S$)</strong><br>
      {{payment.amount}}
    </td>
    <td style="background-color: #fff3cd; padding: 10px; width: 33%;">
      <strong>Total Amount Paid (S$)</strong><br>
      0.00
    </td>
  </tr>
</table>

<p style="font-size: 12px; margin-top: 30px;">
  Go to <a href="#" style="color: #2d7bb9;">Pay Taxes</a> if you want to make another payment.
</p>

<!-- Footer -->
<div style="margin-top: 40px; border-top: 3px solid #2d7bb9; padding-top: 20px;">
  <h4 style="margin: 0 0 10px 0; font-size: 14px;">Inland Revenue Authority of Singapore</h4>
  <p style="font-size: 11px; color: #666; margin: 0 0 20px 0;">
    myTax Portal is a secured and personalised portal for you to view and manage your tax transactions with IRAS.
  </p>
  <p style="font-size: 11px; text-align: right;">
    <a href="#" style="color: #2d7bb9;">Contact</a> &nbsp; 
    <a href="#" style="color: #2d7bb9;">Feedback</a> &nbsp; 
    <a href="#" style="color: #2d7bb9;">Technical FAQ</a>
  </p>
  <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px; font-size: 10px; color: #666;">
    <p style="margin: 0;">
      <a href="#" style="color: #666;">Report Vulnerability</a> &nbsp; 
      <a href="#" style="color: #666;">Privacy Statement</a> &nbsp; 
      <a href="#" style="color: #666;">Terms of Use</a>
    </p>
    <p style="margin: 10px 0 0 0; text-align: right;">
      © 2025, Government of Singapore<br>
      Last Updated on {{notice.date}}
    </p>
  </div>
</div>`
      },
      {
        id: 'system-general',
        name: 'General IRAS Notice',
        description: 'Blank template with IRAS letterhead for general communications',
        category: 'general',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- IRAS Header -->
<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 70%;">
      <p style="margin: 0; font-size: 11px;">Tax Reference Number: <strong>{{taxpayer.taxRef}}</strong></p>
      <p style="margin: 0; font-size: 11px;">Date: {{notice.date}}</p>
      <p style="margin-top: 10px; font-size: 11px;">Please quote the Tax Reference Number (e.g. NRIC, FIN etc.) in full when corresponding with us.</p>
      <p style="margin-top: 10px; font-size: 11px;">
        <strong>{{taxpayer.name}}</strong><br>
        {{taxpayer.address}}
      </p>
    </td>
    <td style="width: 30%; text-align: right; vertical-align: top;">
      <p style="font-size: 11px; color: #666; text-align: right;">
        <strong style="color: #2d7bb9;">INLAND REVENUE</strong><br>
        <strong style="color: #2d7bb9;">AUTHORITY</strong><br>
        <strong style="color: #2d7bb9;">OF SINGAPORE</strong>
      </p>
    </td>
  </tr>
</table>

<!-- Barcode placeholder -->
<p style="font-family: 'Libre Barcode 128', monospace; font-size: 40px; margin: 20px 0;">|||||||||||||||||||||||||||</p>

<!-- Title Banner - Customize the title -->
<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 12px 20px; margin: 30px 0 20px 0; border-radius: 4px;">
  <h2 style="margin: 0; font-size: 18px; font-weight: 500;">[Notice Title]</h2>
</div>

<p style="font-size: 12px;">Dear {{taxpayer.salutation}}</p>

<p style="font-size: 12px; line-height: 1.6;">
  [Your content here]
</p>

<div style="margin-top: 30px;">
  <p style="font-size: 12px;">Yours faithfully</p>
  <p style="margin: 20px 0 0 0; font-size: 12px;">
    <strong>[OFFICER NAME]</strong><br>
    [TITLE]<br>
    [DIVISION]<br>
    for COMPTROLLER OF INCOME TAX
  </p>
  <p style="font-size: 10px; color: #666; font-style: italic; margin-top: 10px;">
    This is a system-generated letter and no signature is required.
  </p>
</div>

<!-- Footer -->
<div style="margin-top: 60px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 6351 3551</p>
  <p style="margin: 5px 0;">Page 1 of 1 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
      }
    ];
  }
}
