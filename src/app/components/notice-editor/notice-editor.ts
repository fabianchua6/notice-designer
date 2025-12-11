import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
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
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js' }
  ],
  templateUrl: './notice-editor.html',
  styleUrl: './notice-editor.scss',
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
  
  // Variable insertion
  templateVariables = TEMPLATE_VARIABLES;
  variableCategories: string[] = [];
  showVariablePanel = false;
  
  // TinyMCE configuration
  editorConfig: any = {
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
    license_key: 'gpl',
  };
  
  constructor(
    private noticeService: NoticeService,
    private router: Router,
    private route: ActivatedRoute
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
        // Set default content for new notices
        this.setDefaultContent();
      }
    });
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
  
  insertVariable(variable: TemplateVariable): void {
    const currentContent = this.content();
    this.content.set(currentContent + ` ${variable.key} `);
  }
  
  toggleVariablePanel(): void {
    this.showVariablePanel = !this.showVariablePanel;
  }
  
  getPlainTextContent(): string {
    const temp = document.createElement('div');
    temp.innerHTML = this.content();
    return temp.textContent || temp.innerText || '';
  }
  
  getPreviewContent(): string {
    let content = this.content();
    for (const variable of this.templateVariables) {
      content = content.replace(new RegExp(this.escapeRegex(variable.key), 'g'), 
        `<span class="variable-value">${variable.sampleValue}</span>`);
    }
    return content;
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
