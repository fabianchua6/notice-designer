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
        template.id === id
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
    return `template-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  
  private saveTemplates(): void {
    try {
      // Save user templates
      const userTemplates = this.templates().filter(t => !t.isSystem);
      localStorage.setItem('masterTemplates', JSON.stringify(userTemplates));
      
      // Save modified system templates (for demo purposes - allows editing master templates)
      const systemTemplates = this.templates().filter(t => t.isSystem);
      localStorage.setItem('systemTemplatesOverrides', JSON.stringify(systemTemplates));
    } catch (error) {
      console.error('Failed to save templates to localStorage:', error);
    }
  }
  
  private loadTemplates(): void {
    // Start with system templates (from code)
    let systemTemplates = this.getSystemTemplates();
    
    // Check for saved overrides of system templates (demo: allows editing master templates)
    try {
      const overrides = localStorage.getItem('systemTemplatesOverrides');
      if (overrides) {
        const savedSystemTemplates = JSON.parse(overrides).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          isSystem: true,
        }));
        // Use saved versions instead of hardcoded ones
        systemTemplates = savedSystemTemplates;
      }
    } catch (error) {
      console.error('Failed to load system template overrides:', error);
    }
    
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
        name: 'Notice of Assessment (NOA)',
        description: 'Complete NOA with income summary, tax computation, and payment details',
        category: 'assessment',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<!-- Action Box -->
<div style="background-color: #e8f4fc; border-left: 4px solid #2d7bb9; padding: 15px 20px; margin-bottom: 20px;">
  <h3 style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 16px;">What do you need to do?</h3>
  <p style="margin: 0; font-size: 14px;">
    Please pay <strong style="font-size: 20px;">{{payment.amount}}</strong> by <strong>{{payment.dueDate}}</strong>.
  </p>
</div>

<!-- Year of Assessment Header -->
<h3 style="text-align: center; margin: 25px 0 15px 0; font-size: 14px; font-weight: bold;">YEAR OF ASSESSMENT {{assessment.year}}</h3>

<!-- Income/Deductions/Tax Summary Table -->
<table style="width: 100%; border-collapse: collapse; font-size: 11px;">
  <tr>
    <!-- Income Column -->
    <td style="width: 33%; vertical-align: top; padding-right: 10px;">
      <div style="border: 2px solid #2d7bb9; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #2d7bb9; color: white; padding: 8px; text-align: center;">
          <strong>+ INCOME</strong>
        </div>
        <div style="padding: 8px;">
          <p style="margin: 0; text-align: right; font-size: 14px;"><strong>{{income.total}}</strong></p>
          <table style="width: 100%; margin-top: 8px; font-size: 10px;">
            <tr style="background-color: #e8f4fc;">
              <td style="padding: 4px;"><strong>EMPLOYMENT</strong></td>
              <td style="text-align: right; padding: 4px;">{{income.employment}}</td>
            </tr>
          </table>
        </div>
      </div>
    </td>
    
    <!-- Deductions Column -->
    <td style="width: 33%; vertical-align: top; padding: 0 5px;">
      <div style="border: 2px solid #ff9800; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #ff9800; color: white; padding: 8px; text-align: center;">
          <strong>- DEDUCTIONS</strong>
        </div>
        <div style="padding: 8px;">
          <p style="margin: 0; text-align: right; font-size: 14px;"><strong>{{deductions.total}}</strong></p>
          <table style="width: 100%; margin-top: 8px; font-size: 10px;">
            <tr style="background-color: #fff8e1;">
              <td style="padding: 4px;"><strong>RELIEFS</strong></td>
              <td style="text-align: right; padding: 4px;">{{deductions.reliefs}}</td>
            </tr>
          </table>
        </div>
      </div>
    </td>
    
    <!-- Chargeable Income Column -->
    <td style="width: 33%; vertical-align: top; padding-left: 10px;">
      <div style="border: 2px solid #4caf50; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #4caf50; color: white; padding: 8px; text-align: center;">
          <strong>= CHARGEABLE</strong>
        </div>
        <div style="padding: 8px;">
          <p style="margin: 0; text-align: right; font-size: 14px;"><strong>{{income.chargeable}}</strong></p>
          <table style="width: 100%; margin-top: 8px; font-size: 10px;">
            <tr style="background-color: #ffeb3b;">
              <td style="padding: 6px;"><strong>Tax Payable</strong></td>
              <td style="text-align: right; padding: 6px; font-size: 14px;"><strong>{{payment.amount}}</strong></td>
            </tr>
          </table>
        </div>
      </div>
    </td>
  </tr>
</table>

<!-- Instructions -->
<div style="margin-top: 30px;">
  <h4 style="margin: 0 0 8px 0; font-size: 13px;">How to Pay?</h4>
  <p style="font-size: 12px; margin-bottom: 20px;">
    Please login to myTax Portal and apply GIRO to enjoy up to 12 interest-free monthly instalments or pay in full via PayNow QR or AXS by the due date.
  </p>
</div>

<p style="font-size: 12px; line-height: 1.6;">
  Yours faithfully,<br><br>
  <strong>COMPTROLLER OF INCOME TAX</strong>
</p>`
      },
      {
        id: 'system-blank',
        name: 'Simple Letter with Table',
        description: 'Clean blank template with a basic data table and standard closing',
        category: 'general',
        isSystem: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        content: `<p style="font-size: 12px;">Dear {{taxpayer.salutation}}</p>

<p style="font-size: 12px; line-height: 1.6;">
  [Your introductory text here]
</p>

<!-- Simple Data Table -->
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px;">
  <tr style="background-color: #f5f5f5;">
    <th style="padding: 10px; text-align: left; width: 40%;">Description</th>
    <th style="padding: 10px; text-align: right;">Amount (S$)</th>
  </tr>
  <tr>
    <td style="padding: 10px;">Item 1</td>
    <td style="padding: 10px; text-align: right;">0.00</td>
  </tr>
  <tr>
    <td style="padding: 10px;">Item 2</td>
    <td style="padding: 10px; text-align: right;">0.00</td>
  </tr>
  <tr style="background-color: #f5f5f5; font-weight: bold;">
    <td style="padding: 10px;">Total</td>
    <td style="padding: 10px; text-align: right;">0.00</td>
  </tr>
</table>

<p style="font-size: 12px; line-height: 1.6;">
  [Additional details or instructions here]
</p>

<div style="margin-top: 30px;">
  <p style="font-size: 12px;">Yours faithfully</p>
  <p style="margin: 20px 0 0 0; font-size: 12px;">
    <strong>[OFFICER NAME]</strong><br>
    [TITLE]<br>
    for COMPTROLLER OF INCOME TAX
  </p>
</div>`
      }
    ];
  }
}
