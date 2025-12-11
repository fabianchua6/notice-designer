import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { NoticeService } from '../../services/notice';
import { TemplateService } from '../../services/template.service';
import { TEMPLATE_VARIABLES, TemplateVariable } from '../../models/notice.model';

@Component({
  selector: 'app-notice-editor',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    MatTabsModule,
    EditorModule,
  ],
  providers: [
    // Self-hosted TinyMCE - no API key required, fully open source (LGPL)
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  templateUrl: './notice-editor.html',
  styleUrl: './notice-editor.scss',
  // Use None to allow TinyMCE inline styles to render in preview
  encapsulation: ViewEncapsulation.None,
})
export class NoticeEditor implements OnInit {
  // Editor state
  isEditMode = false;
  noticeId: string | null = null;
  
  // Form fields
  title = signal('');
  content = signal('');
  backgroundColor = signal('#ffffff');
  textColor = signal('#000000');
  fontSize = signal(12);
  fontFamily = signal('Arial');
  borderStyle = signal('none');
  borderColor = signal('#000000');
  borderWidth = signal(0);
  padding = signal(0);
  
  // Preview zoom
  zoom = 100; // Start at 100% for accurate preview
  
  // Toggle for showing variables vs sample data
  showSampleData = true;
  
  // Variable insertion
  templateVariables = TEMPLATE_VARIABLES;
  variableCategories: string[] = [];
  showVariablePanel = false;
  showComponentsPanel = false;
  
  // Reusable components library
  componentLibrary = [
    {
      category: 'Headers',
      icon: 'title',
      items: [
        {
          name: 'IRAS Letterhead',
          icon: 'business',
          html: `<table style="width: 100%; border: none; margin-bottom: 20px;">
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
</table>`
        },
        {
          name: 'Title Banner (Blue)',
          icon: 'label',
          html: `<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 12px 20px; margin: 20px 0; border-radius: 4px;">
  <h2 style="margin: 0; font-size: 18px; font-weight: 500;">[Title Here]</h2>
</div>`
        },
        {
          name: 'Section Header',
          icon: 'text_fields',
          html: `<h3 style="margin: 16px 0 8px; color: #1a1a2e; font-size: 14px; border-bottom: 2px solid #2d7bb9; padding-bottom: 4px;">[Section Title]</h3>`
        }
      ]
    },
    {
      category: 'Tables',
      icon: 'table_chart',
      items: [
        {
          name: 'Key-Value Table',
          icon: 'view_list',
          html: `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
  <tr>
    <td style="background-color: #f5f5f5; padding: 8px 12px; border: 1px solid #ddd; width: 40%;"><strong>Label 1</strong></td>
    <td style="padding: 8px 12px; border: 1px solid #ddd;">Value 1</td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5; padding: 8px 12px; border: 1px solid #ddd;"><strong>Label 2</strong></td>
    <td style="padding: 8px 12px; border: 1px solid #ddd;">Value 2</td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5; padding: 8px 12px; border: 1px solid #ddd;"><strong>Label 3</strong></td>
    <td style="padding: 8px 12px; border: 1px solid #ddd;">Value 3</td>
  </tr>
</table>`
        },
        {
          name: 'Data Table with Header',
          icon: 'grid_on',
          html: `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px;">
  <tr style="background-color: #2d7bb9; color: white;">
    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Column 1</th>
    <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Amount (S$)</th>
  </tr>
  <tr>
    <td style="padding: 8px 10px; border: 1px solid #ddd;">Item 1</td>
    <td style="padding: 8px 10px; border: 1px solid #ddd; text-align: right;">1,000.00</td>
  </tr>
  <tr>
    <td style="padding: 8px 10px; border: 1px solid #ddd;">Item 2</td>
    <td style="padding: 8px 10px; border: 1px solid #ddd; text-align: right;">2,000.00</td>
  </tr>
  <tr style="background-color: #f5f5f5; font-weight: bold;">
    <td style="padding: 8px 10px; border: 1px solid #ddd;">Total</td>
    <td style="padding: 8px 10px; border: 1px solid #ddd; text-align: right;">3,000.00</td>
  </tr>
</table>`
        },
        {
          name: 'Income Summary (3-Column)',
          icon: 'account_balance',
          html: `<table style="width: 100%; border-collapse: collapse; font-size: 11px;">
  <tr>
    <td style="width: 33%; vertical-align: top; padding-right: 10px;">
      <div style="border: 2px solid #2d7bb9; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #2d7bb9; color: white; padding: 8px; text-align: center;">
          <strong>+ INCOME</strong>
        </div>
        <div style="padding: 8px; text-align: right; font-size: 14px;"><strong>$30,000.00</strong></div>
      </div>
    </td>
    <td style="width: 33%; vertical-align: top; padding: 0 5px;">
      <div style="border: 2px solid #ff9800; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #ff9800; color: white; padding: 8px; text-align: center;">
          <strong>- DEDUCTIONS</strong>
        </div>
        <div style="padding: 8px; text-align: right; font-size: 14px;"><strong>$5,000.00</strong></div>
      </div>
    </td>
    <td style="width: 33%; vertical-align: top; padding-left: 10px;">
      <div style="border: 2px solid #4caf50; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #4caf50; color: white; padding: 8px; text-align: center;">
          <strong>= CHARGEABLE</strong>
        </div>
        <div style="padding: 8px; text-align: right; font-size: 14px;"><strong>$25,000.00</strong></div>
      </div>
    </td>
  </tr>
</table>`
        }
      ]
    },
    {
      category: 'Boxes & Callouts',
      icon: 'crop_square',
      items: [
        {
          name: 'Info Box (Blue)',
          icon: 'info',
          html: `<div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
  <p style="margin: 0; font-size: 12px; color: #1565c0;"><strong>Note:</strong> [Your information here]</p>
</div>`
        },
        {
          name: 'Warning Box (Yellow)',
          icon: 'warning',
          html: `<div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
  <p style="margin: 0; font-size: 12px; color: #856404;"><strong>⚠️ Important:</strong> [Your warning here]</p>
</div>`
        },
        {
          name: 'Success Box (Green)',
          icon: 'check_circle',
          html: `<div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
  <p style="margin: 0; font-size: 12px; color: #155724;"><strong>✓</strong> [Success message here]</p>
</div>`
        },
        {
          name: 'Action Required Box',
          icon: 'assignment',
          html: `<div style="background: linear-gradient(135deg, #2d7bb9, #1173c0); color: white; padding: 10px 15px; margin: 20px 0 0 0; border-radius: 4px 4px 0 0;">
  <h3 style="margin: 0; font-size: 14px; font-weight: 500;">What do you need to do?</h3>
</div>
<div style="background-color: #e8f4fc; padding: 15px; border: 1px solid #2d7bb9; border-top: none; margin-bottom: 20px;">
  <ul style="font-size: 12px; line-height: 1.8; margin: 0; padding-left: 20px;">
    <li>Action item 1</li>
    <li>Action item 2</li>
    <li>Action item 3</li>
  </ul>
</div>`
        },
        {
          name: 'Payment Due Box',
          icon: 'payment',
          html: `<div style="background-color: #e8f4fc; border-left: 4px solid #2d7bb9; padding: 15px 20px; margin: 20px 0;">
  <h3 style="margin: 0 0 8px 0; color: #1a1a2e; font-size: 16px;">What do you need to do?</h3>
  <p style="margin: 0; font-size: 14px;">
    Please pay <strong style="font-size: 20px;">{{payment.amount}}</strong> by <strong>{{payment.dueDate}}</strong>.
  </p>
</div>`
        }
      ]
    },
    {
      category: 'Signatures',
      icon: 'draw',
      items: [
        {
          name: 'Officer Signature Block',
          icon: 'person',
          html: `<div style="margin-top: 30px;">
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
</div>`
        },
        {
          name: 'Comptroller Signature',
          icon: 'verified',
          html: `<div style="margin-top: 40px;">
  <p style="font-family: 'Brush Script MT', cursive; font-size: 28px; margin: 0;">OwFookChuen</p>
  <p style="margin: 10px 0 0 0; font-size: 12px;">
    <strong>OW FOOK CHUEN</strong><br>
    COMPTROLLER OF INCOME TAX
  </p>
</div>`
        }
      ]
    },
    {
      category: 'Footers',
      icon: 'call_to_action',
      items: [
        {
          name: 'IRAS Footer',
          icon: 'web',
          html: `<div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
  <p style="margin: 0;">Website: <a href="https://www.iras.gov.sg" style="color: #2d7bb9;">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg" style="color: #2d7bb9;">mytax.iras.gov.sg</a></p>
  <p style="margin: 5px 0;">Tel: 6351 3551</p>
  <p style="margin: 5px 0;">Page 1 of 1 &nbsp;&nbsp;&nbsp; {{notice.number}}</p>
</div>`
        },
        {
          name: 'Page Break',
          icon: 'insert_page_break',
          html: `<div style="page-break-after: always;"></div>
<p style="margin-top: 40px;">&nbsp;</p>`
        }
      ]
    }
  ];
  
  // TinyMCE configuration - Self-hosted open source version (LGPL)
  editorConfig: any = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'pagebreak'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | ' +
      'bold italic underline strikethrough | forecolor backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | ' +
      'table | pagebreak | removeformat | help',
    content_style: `
      body { 
        font-family: Arial, sans-serif; 
        font-size: 12pt; 
        line-height: 1.6;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .variable {
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
        border-radius: 3px;
        padding: 1px 4px;
        color: #1565c0;
        font-family: monospace;
        font-size: 0.9em;
      }
    `,
    pagebreak_separator: '<div style="page-break-after: always;"></div>',
    formats: {
      variable: { inline: 'span', classes: 'variable' }
    },
    fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt 36pt',
    font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace; Georgia=georgia,palatino,serif; Verdana=verdana,geneva,sans-serif',
    branding: false,
    promotion: false,
    license_key: 'gpl',  // Open source license
  };
  
  constructor(
    private noticeService: NoticeService,
    private templateService: TemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    // Get unique categories
    this.variableCategories = [...new Set(TEMPLATE_VARIABLES.map(v => v.category))];
  }
  
  ngOnInit(): void {
    // Check if we're editing an existing notice
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.noticeId = id;
        this.loadNotice(id);
      } else {
        // Check for template to use
        this.route.queryParams.subscribe(queryParams => {
          const templateId = queryParams['templateId'];
          if (templateId) {
            this.loadFromTemplate(templateId);
          } else {
            // Set default content for new notices
            this.setDefaultContent();
          }
        });
      }
    });
  }
  
  loadFromTemplate(templateId: string): void {
    const template = this.templateService.getTemplateById(templateId);
    if (template) {
      this.title.set(`New ${template.name}`);
      this.content.set(template.content);
    } else {
      this.setDefaultContent();
    }
  }
  
  loadNotice(id: string): void {
    const notice = this.noticeService.getNoticeById(id);
    if (notice) {
      this.title.set(notice.title);
      this.content.set(notice.content);
      this.backgroundColor.set(notice.backgroundColor || '#ffffff');
      this.textColor.set(notice.textColor || '#000000');
      this.fontSize.set(notice.fontSize || 12);
      this.fontFamily.set(notice.fontFamily || 'Arial');
      this.borderStyle.set(notice.borderStyle || 'none');
      this.borderColor.set(notice.borderColor || '#000000');
      this.borderWidth.set(notice.borderWidth || 0);
      this.padding.set(notice.padding || 0);
    } else {
      // Notice not found, redirect to list
      this.router.navigate(['/']);
    }
  }
  
  setDefaultContent(): void {
    this.title.set('Tax Assessment Notice');
    this.content.set(`<p>Dear <strong>{{taxpayer.name}}</strong>,</p>

<p><strong>RE: Notice of Assessment for Year of Assessment {{assessment.year}}</strong></p>

<p>This notice is to inform you of your tax assessment for the Year of Assessment {{assessment.year}}.</p>

<h3>Assessment Details</h3>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="background-color: #f5f5f5;"><strong>Reference Number</strong></td>
    <td>{{assessment.refNumber}}</td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5;"><strong>Assessment Type</strong></td>
    <td>{{assessment.type}}</td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5;"><strong>Tax Amount Payable</strong></td>
    <td><strong>{{assessment.amount}}</strong></td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5;"><strong>Due Date</strong></td>
    <td>{{assessment.dueDate}}</td>
  </tr>
</table>

<h3>Payment Instructions</h3>
<p>Please make payment by <strong>{{assessment.dueDate}}</strong> to avoid any late payment penalties.</p>

<p><strong>Payment Methods:</strong></p>
<ul>
  <li>PayNow: Use reference {{payment.payNowRef}}</li>
  <li>Bank Transfer: {{payment.bankName}} - {{payment.accountNo}}</li>
  <li>GIRO: If you have existing GIRO arrangement</li>
</ul>

<h3>Important Notes</h3>
<ol>
  <li>Late payment will incur a 5% penalty.</li>
  <li>If you disagree with this assessment, please file an objection within 30 days.</li>
  <li>Keep this notice for your records.</li>
</ol>

<p>If you have any questions, please contact us at 1800-356-8300 or visit <a href="https://www.iras.gov.sg">www.iras.gov.sg</a>.</p>

<p>Thank you for your cooperation.</p>

<p><br></p>
<p>Yours faithfully,</p>
<p><strong>Inland Revenue Authority of Singapore</strong></p>
<p>Notice Date: {{notice.date}}<br>Notice Number: {{notice.number}}</p>`);
  }
  
  getVariablesByCategory(category: string): TemplateVariable[] {
    return this.templateVariables.filter(v => v.category === category);
  }
  
  // Zoom controls for preview
  zoomIn(): void {
    this.zoom = Math.min(150, this.zoom + 10);
  }
  
  zoomOut(): void {
    this.zoom = Math.max(25, this.zoom - 10);
  }
  
  getCurrentDate(): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  insertVariable(variable: TemplateVariable): void {
    const currentContent = this.content();
    this.content.set(currentContent + ` ${variable.key} `);
  }
  
  toggleVariablePanel(): void {
    this.showVariablePanel = !this.showVariablePanel;
    if (this.showVariablePanel) {
      this.showComponentsPanel = false;
    }
  }
  
  toggleComponentsPanel(): void {
    this.showComponentsPanel = !this.showComponentsPanel;
    if (this.showComponentsPanel) {
      this.showVariablePanel = false;
    }
  }
  
  insertComponent(component: { name: string; html: string }): void {
    const currentContent = this.content();
    this.content.set(currentContent + '\n' + component.html + '\n');
  }
  
  getPlainTextContent(): string {
    const temp = document.createElement('div');
    temp.innerHTML = this.content();
    return temp.textContent || temp.innerText || '';
  }
  
  getPreviewContent(): SafeHtml {
    let content = this.content();
    
    if (this.showSampleData) {
      // Replace template variables with sample values
      for (const variable of this.templateVariables) {
        content = content.replace(new RegExp(this.escapeRegex(variable.key), 'g'), 
          `<span class="variable-value">${variable.sampleValue}</span>`);
      }
    } else {
      // Show variables as-is but styled
      for (const variable of this.templateVariables) {
        content = content.replace(new RegExp(this.escapeRegex(variable.key), 'g'), 
          `<span class="variable-placeholder">${variable.key}</span>`);
      }
    }
    
    // Use DomSanitizer to trust the HTML and preserve inline styles
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  
  toggleSampleData(): void {
    this.showSampleData = !this.showSampleData;
  }
  
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  saveNotice(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    const noticeData = {
      title: this.title(),
      content: this.content(),
      backgroundColor: this.backgroundColor(),
      textColor: this.textColor(),
      fontSize: this.fontSize(),
      fontFamily: this.fontFamily(),
      borderStyle: this.borderStyle(),
      borderColor: this.borderColor(),
      borderWidth: this.borderWidth(),
      padding: this.padding(),
    };
    
    if (this.isEditMode && this.noticeId) {
      this.noticeService.updateNotice(this.noticeId, noticeData);
    } else {
      this.noticeService.addNotice(noticeData);
    }
    
    this.router.navigate(['/']);
  }
  
  printNotice(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    const printWindow = window.open('', '', 'width=900,height=700');
    
    if (!printWindow) {
      alert('Please allow popups to print/save as PDF');
      return;
    }
    
    const currentDate = new Date().toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    const previewContent = this.getPreviewContent();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.title()}</title>
          <style>
            @page {
              size: A4;
              margin: 25mm 25mm 25mm 25mm;
            }
            
            * { box-sizing: border-box; }
            
            body {
              font-family: ${this.fontFamily()}, Arial, sans-serif;
              font-size: ${this.fontSize()}pt;
              margin: 0;
              padding: 0;
              color: ${this.textColor()};
              background-color: white;
              line-height: 1.6;
            }
            
            .document-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 24pt;
              padding-bottom: 12pt;
              border-bottom: 2pt solid #2d7bb9;
            }
            
            .iras-logo {
              display: flex;
              align-items: center;
              gap: 12pt;
            }
            
            .logo-icon {
              background: linear-gradient(135deg, #2d7bb9, #20b4af);
              color: white;
              font-weight: 700;
              font-size: 14pt;
              padding: 6pt 10pt;
              border-radius: 3pt;
              letter-spacing: 1pt;
            }
            
            .ministry {
              font-size: 11pt;
              font-weight: 600;
              color: #1a1a2e;
            }
            
            .document-date {
              font-size: 10pt;
              color: #666;
            }
            
            .document-title {
              text-align: center;
              margin-bottom: 20pt;
            }
            
            .document-title h1 {
              margin: 0;
              font-size: 16pt;
              font-weight: 600;
              color: #1a1a2e;
              text-transform: uppercase;
              letter-spacing: 1pt;
              padding: 12pt 0;
              border-top: 1pt solid #ddd;
              border-bottom: 1pt solid #ddd;
              background: #fafafa;
            }
            
            .notice-content {
              font-size: ${this.fontSize()}pt;
              line-height: 1.6;
            }
            
            .notice-content table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .notice-content td, .notice-content th {
              border: 1px solid #ddd;
              padding: 8px;
            }
            
            .variable-value {
              font-weight: 500;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="document-header">
            <div class="iras-logo">
              <div class="logo-icon">IRAS</div>
              <div class="logo-text">
                <span class="ministry">Inland Revenue Authority of Singapore</span>
              </div>
            </div>
            <div class="document-date">${currentDate}</div>
          </div>
          
          <div class="document-title">
            <h1>${this.escapeHtml(this.title())}</h1>
          </div>
          
          <div class="notice-content">${previewContent}</div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 250);
    };
  }
  
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  resetForm(): void {
    if (this.isEditMode && this.noticeId) {
      this.loadNotice(this.noticeId);
    } else {
      this.setDefaultContent();
    }
  }
}
