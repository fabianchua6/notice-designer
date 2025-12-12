import { Component, OnInit, AfterViewChecked, signal, ViewEncapsulation, effect } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { NoticeService } from '../../services/notice';
import { TemplateService } from '../../services/template.service';
import { DocumentRendererService, DocumentHeaderData, PrintPage } from '../../services/document-renderer.service';
import { PaginationService, PaginationConfig } from '../../services/pagination.service';
import { TEMPLATE_VARIABLES, TemplateVariable, LetterHeader } from '../../models/notice.model';
import { IrasButton } from '../../design-system';
import { NoticePreviewEnhanced } from '../notice-preview-enhanced/notice-preview-enhanced';
import JsBarcode from 'jsbarcode';

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
    MatSlideToggleModule,
    EditorModule,
    IrasButton,
    NoticePreviewEnhanced,
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
export class NoticeEditor implements OnInit, AfterViewChecked {
  // Editor state
  isEditMode = false;
  noticeId: string | null = null;
  isTemplateEditMode = false;
  templateId: string | null = null;
  private barcodeInitialized = false;
  
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
  
  // Header settings
  showHeaderSettings = false;
  headerConfig = signal<LetterHeader>({
    showHeader: true,
    showHeaderOnAllPages: true, // Show condensed header on pages 2+
    taxRef: 'S1234567A',
    date: new Date().toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    recipientName: 'MR JOHN DOE',
    addressLine1: '123 SAMPLE STREET',
    addressLine2: '#01-23',
    addressLine3: 'SINGAPORE 123456',
    addressLine4: '',
    showQuoteNote: true,
    showBarcode: true
  });
  
  // Preview zoom
  zoom = 100; // Start at 100% for accurate preview
  
  // Toggle for showing variables vs sample data
  showSampleData = true;
  
  // Page break visualization
  showPageBreaks = signal(false);
  pageBreakPositions: number[] = [];
  private pageBreakUpdateTimeout: any;
  
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
    <td style="background-color: #f5f5f5; padding: 8px 12px; width: 40%;"><strong>Label 1</strong></td>
    <td style="padding: 8px 12px;">Value 1</td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5; padding: 8px 12px;"><strong>Label 2</strong></td>
    <td style="padding: 8px 12px;">Value 2</td>
  </tr>
  <tr>
    <td style="background-color: #f5f5f5; padding: 8px 12px;"><strong>Label 3</strong></td>
    <td style="padding: 8px 12px;">Value 3</td>
  </tr>
</table>`
        },
        {
          name: 'Data Table with Header',
          icon: 'grid_on',
          html: `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px;">
  <tr style="background-color: #2d7bb9; color: white;">
    <th style="padding: 10px; text-align: left;">Column 1</th>
    <th style="padding: 10px; text-align: right;">Amount (S$)</th>
  </tr>
  <tr>
    <td style="padding: 8px 10px;">Item 1</td>
    <td style="padding: 8px 10px; text-align: right;">1,000.00</td>
  </tr>
  <tr>
    <td style="padding: 8px 10px;">Item 2</td>
    <td style="padding: 8px 10px; text-align: right;">2,000.00</td>
  </tr>
  <tr style="background-color: #f5f5f5; font-weight: bold;">
    <td style="padding: 8px 10px;">Total</td>
    <td style="padding: 8px 10px; text-align: right;">3,000.00</td>
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
          html: `<div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666; padding-top: 15px;">
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
    private documentRenderer: DocumentRendererService,
    private paginationService: PaginationService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    // Get unique categories
    this.variableCategories = [...new Set(TEMPLATE_VARIABLES.map(v => v.category))];
    
    // Watch for content or header changes and update page breaks if visualization is on
    effect(() => {
      // Trigger recalculation when these change
      const _ = this.content();
      const __ = this.headerConfig();
      const ___ = this.showPageBreaks();
      
      if (this.showPageBreaks()) {
        this.updatePageBreakVisualization();
      }
    });
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
        // Check for template-related operations
        this.route.queryParams.subscribe(queryParams => {
          const templateId = queryParams['templateId'];
          const editTemplate = queryParams['editTemplate'];
          const newTemplate = queryParams['newTemplate'];
          
          if (editTemplate === 'true' && templateId) {
            // Editing an existing template
            this.isTemplateEditMode = true;
            this.templateId = templateId;
            this.loadTemplateForEdit(templateId);
          } else if (newTemplate === 'true') {
            // Creating a new template
            this.isTemplateEditMode = true;
            this.templateId = null;
            this.setDefaultTemplateContent();
          } else if (templateId) {
            // Using a template to create a new notice
            this.loadFromTemplate(templateId);
          } else {
            // Set default content for new notices
            this.setDefaultContent();
          }
        });
      }
    });
  }
  
  ngAfterViewChecked(): void {
    this.initializeBarcode();
  }
  
  private initializeBarcode(): void {
    const barcodeElement = document.getElementById('editor-barcode');
    if (barcodeElement && !this.barcodeInitialized) {
      try {
        JsBarcode('#editor-barcode', 'S1234567A', {
          format: 'CODE128',
          width: 1.5,
          height: 35,
          displayValue: false,
          margin: 0,
        });
        this.barcodeInitialized = true;
      } catch (e) {
        // Barcode element not ready yet
      }
    }
  }
  
  loadTemplateForEdit(templateId: string): void {
    const template = this.templateService.getTemplateById(templateId);
    if (template) {
      this.title.set(template.name);
      this.content.set(template.content);
      if (template.header) {
        this.headerConfig.set(template.header);
      }
    } else {
      this.router.navigate(['/templates']);
    }
  }
  
  setDefaultTemplateContent(): void {
    this.title.set('New Template');
    this.content.set(`<p>Dear <strong>{{taxpayer.name}}</strong>,</p>

<p>Enter your template content here...</p>

<p>Yours faithfully,<br><strong>IRAS</strong></p>`);
  }
  
  loadFromTemplate(templateId: string): void {
    const template = this.templateService.getTemplateById(templateId);
    if (template) {
      this.title.set(`New ${template.name}`);
      this.content.set(template.content);
      if (template.header) {
        this.headerConfig.set(template.header);
      }
    } else {
      this.setDefaultContent();
    }
  }
  
  loadNotice(id: string): void {
    const notice = this.noticeService.getNoticeById(id);
    if (notice) {
      this.title.set(notice.title);
      this.content.set(notice.content);
      if (notice.header) {
        this.headerConfig.set(notice.header);
      }
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
<table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
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
      this.showHeaderSettings = false;
    }
  }
  
  toggleComponentsPanel(): void {
    this.showComponentsPanel = !this.showComponentsPanel;
    if (this.showComponentsPanel) {
      this.showVariablePanel = false;
      this.showHeaderSettings = false;
    }
  }
  
  toggleHeaderSettings(): void {
    this.showHeaderSettings = !this.showHeaderSettings;
    if (this.showHeaderSettings) {
      this.showVariablePanel = false;
      this.showComponentsPanel = false;
    }
  }
  
  updateHeaderConfig(field: keyof LetterHeader, value: any): void {
    const current = this.headerConfig();
    this.headerConfig.set({ ...current, [field]: value });
    // Re-initialize barcode if barcode settings changed
    if (field === 'showBarcode' || field === 'taxRef') {
      this.barcodeInitialized = false;
    }
  }
  
  getHeaderDataFromConfig(): DocumentHeaderData {
    const config = this.headerConfig();
    const addressLines: string[] = [
      config.addressLine1,
      config.addressLine2 || '',
      config.addressLine3 || '',
      config.addressLine4 || ''
    ].filter(line => line && line.trim() !== '');
    
    return {
      taxRef: config.taxRef,
      date: config.date,
      recipientName: config.recipientName,
      recipientAddress: addressLines,
      showQuoteNote: config.showQuoteNote
    };
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
  
  // For editor preview - shows variables with highlighting
  getPreviewContentForPrint(): string {
    let content = this.content();
    
    if (this.showSampleData) {
      // Replace template variables with sample values (highlighted for preview)
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
    
    return content;
  }
  
  // For actual print/PDF - clean output without highlighting
  getContentForPrint(): string {
    let content = this.content();
    
    // Replace template variables with sample values (no highlighting for print)
    for (const variable of this.templateVariables) {
      content = content.replace(new RegExp(this.escapeRegex(variable.key), 'g'), 
        variable.sampleValue);
    }
    
    return content;
  }
  
  getPreviewContent(): SafeHtml {
    // Use DomSanitizer to trust the HTML and preserve inline styles
    return this.sanitizer.bypassSecurityTrustHtml(this.getPreviewContentForPrint());
  }
  
  toggleSampleData(): void {
    this.showSampleData = !this.showSampleData;
  }
  
  togglePageBreaksVisualization(): void {
    this.showPageBreaks.set(!this.showPageBreaks());
    if (this.showPageBreaks()) {
      this.updatePageBreakVisualization();
    }
  }
  
  /**
   * Calculate where page breaks occur based on pagination service
   * Returns character positions where breaks should be inserted
   */
  private updatePageBreakVisualization(): void {
    // Debounce to avoid excessive calculations
    clearTimeout(this.pageBreakUpdateTimeout);
    this.pageBreakUpdateTimeout = setTimeout(() => {
      this.calculatePageBreaks();
    }, 500);
  }
  
  private calculatePageBreaks(): void {
    const contentForCalculation = this.getContentForPrint();
    
    if (!contentForCalculation) {
      this.pageBreakPositions = [];
      return;
    }
    
    // Use same config as preview
    const config = this.headerConfig();
    const paginationConfig: PaginationConfig = {
      pageWidth: 794,
      pageHeight: 1123,
      marginTop: 56,
      marginBottom: 56,
      marginLeft: 56,
      marginRight: 56,
      headerHeight: config.showHeader ? 200 : 0,
      continuationHeaderHeight: (config.showHeader && config.showHeaderOnAllPages) ? 40 : 0,
      footerHeight: 60,
      fontSize: this.fontSize(),
      lineHeight: 1.6
    };
    
    const pages = this.paginationService.paginateHtmlContent(contentForCalculation, paginationConfig);
    
    // Calculate cumulative character positions for page breaks
    const positions: number[] = [];
    let cumulativePosition = 0;
    
    pages.forEach((page, index) => {
      if (index > 0) { // Don't add marker before first page
        positions.push(cumulativePosition);
      }
      // Strip HTML to count characters
      const temp = document.createElement('div');
      temp.innerHTML = page.content;
      cumulativePosition += (temp.textContent || '').length;
    });
    
    this.pageBreakPositions = positions;
    console.log('Page breaks at positions:', positions);
    console.log('Total pages:', pages.length);
  }
  
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  saveNotice(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    // If we're in template edit mode, save as template
    if (this.isTemplateEditMode) {
      this.saveTemplate();
      return;
    }
    
    const noticeData = {
      title: this.title(),
      content: this.content(),
      header: this.headerConfig(),
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
  
  saveTemplate(): void {
    if (!this.title() || !this.content()) {
      alert('Please provide both a title and content before saving.');
      return;
    }
    
    const templateData = {
      name: this.title(),
      description: 'Custom template',
      category: 'general' as const,
      content: this.content(),
      header: this.headerConfig(),
    };
    
    try {
      if (this.templateId) {
        // Update existing template
        this.templateService.updateTemplate(this.templateId, templateData);
        console.log('Template updated:', this.templateId);
      } else {
        // Add new template
        const newTemplate = this.templateService.addTemplate(templateData);
        console.log('Template saved:', newTemplate.id);
      }
      
      // Navigate back to templates list
      this.router.navigate(['/templates']);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    }
  }
  
  saveAsMasterTemplate(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    // Prompt user for template name and description
    const templateName = prompt('Enter template name:', this.title());
    if (!templateName) return;
    
    const templateDescription = prompt('Enter template description:', 'Custom template');
    if (!templateDescription) return;
    
    // Add as new master template
    this.templateService.addTemplate({
      name: templateName,
      description: templateDescription,
      category: 'general' as const,
      content: this.content(),
      header: this.headerConfig(),
    });
    
    alert(`Template "${templateName}" saved successfully!`);
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
    
    // Use clean content for print (no variable highlighting)
    const printableContent = this.getContentForPrint();
    const config = this.headerConfig();
    const headerData = config.showHeader ? this.getHeaderDataFromConfig() : undefined;
    
    // Paginate content using same service as preview
    const paginationConfig: PaginationConfig = {
      pageWidth: 794,
      pageHeight: 1123,
      marginTop: 56,
      marginBottom: 56,
      marginLeft: 56,
      marginRight: 56,
      headerHeight: config.showHeader ? 200 : 0,
      continuationHeaderHeight: (config.showHeader && config.showHeaderOnAllPages) ? 40 : 0,
      footerHeight: 60,
      fontSize: this.fontSize(),
      lineHeight: 1.6
    };
    
    const pages = this.paginationService.paginateHtmlContent(printableContent, paginationConfig);
    
    // Convert to PrintPage format
    const printPages: PrintPage[] = pages.map(p => ({
      pageNumber: p.pageNumber,
      content: p.content,
      isFirstPage: p.isFirstPage
    }));
    
    // Generate multi-page print HTML
    const printContent = this.documentRenderer.generateMultiPagePrintHTML(printPages, {
      title: this.title(),
      content: '', // Not used in multi-page
      header: headerData,
      showBarcode: config.showBarcode,
      barcodeValue: config.taxRef,
      fontSize: this.fontSize(),
      showFooter: true
    });
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Initialize barcode in print window after DOM is ready
    printWindow.onload = () => {
      const barcodeElements = printWindow.document.querySelectorAll('.barcode-svg');
      if (barcodeElements.length > 0 && config.showBarcode) {
        try {
          const script = printWindow.document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
          script.onload = () => {
            try {
              (printWindow as any).JsBarcode('.barcode-svg', config.taxRef, {
                format: 'CODE128',
                width: 2,
                height: 40,
                displayValue: false,
                margin: 0,
                background: '#ffffff',
                lineColor: '#000000'
              });
            } catch (e) {
              console.error('Barcode generation failed:', e);
            }
            printWindow.focus();
            printWindow.print();
            setTimeout(() => {
              printWindow.close();
            }, 250);
          };
          printWindow.document.head.appendChild(script);
        } catch (e) {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 250);
        }
      } else {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 250);
      }
    };
  }
  
  resetForm(): void {
    if (this.isEditMode && this.noticeId) {
      this.loadNotice(this.noticeId);
    } else {
      this.setDefaultContent();
    }
  }
}
