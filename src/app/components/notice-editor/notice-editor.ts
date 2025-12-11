import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NoticeService } from '../../services/notice';
import { NoticePreview } from '../notice-preview/notice-preview';

@Component({
  selector: 'app-notice-editor',
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NoticePreview,
  ],
  templateUrl: './notice-editor.html',
  styleUrl: './notice-editor.scss',
})
export class NoticeEditor {
  @ViewChild('noticePreview', { read: ElementRef }) noticePreviewElement!: ElementRef;
  
  title = signal('Official Notice Template');
  content = signal(`═══════════════════════════════════════════════════════════════
                    COMPANY LETTERHEAD
                       Acme Corporation
                    123 Business Avenue
                  City, State, ZIP 12345
                  Phone: (555) 123-4567
═══════════════════════════════════════════════════════════════

NOTICE NO: 2024-001                                  Date: December 11, 2024

TO: All Employees
FROM: Human Resources Department
RE: Important Company Update

═══════════════════════════════════════════════════════════════
                         MAIN CONTENT
═══════════════════════════════════════════════════════════════

Dear Team Members,

This notice serves as a template demonstrating the proper structure and formatting of official company communications.

SECTION 1: HEADER INFORMATION
------------------------------
The header contains essential identification details including:
• Document number and tracking reference
• Issue date and validity period
• Recipient information
• Subject matter

SECTION 2: BODY CONTENT
-----------------------
Key information should be organized in clear, numbered sections:

1. Primary Announcement
   - Main point of the notice
   - Relevant details and specifications
   - Action items required

2. Important Details
   - Deadlines and timelines
   - Contact information
   - Reference materials

3. Additional Information
   - Supporting documentation
   - FAQs and clarifications
   - Resources available

SECTION 3: BARCODE & TRACKING
------------------------------
Document Tracking: [BARCODE: *DOC2024001*]
Verification Code: ABC-123-XYZ-789
QR Code: [Scan for digital copy]

═══════════════════════════════════════════════════════════════
                         FOOTER SECTION
═══════════════════════════════════════════════════════════════

SIGNATURES:

_____________________              _____________________
Department Manager                 Date
John Smith

_____________________              _____________________
HR Director                        Date
Jane Doe

───────────────────────────────────────────────────────────────
CONFIDENTIALITY NOTICE: This document contains confidential 
information intended only for the designated recipients.
───────────────────────────────────────────────────────────────

Page 1 of 1                        Document ID: DOC-2024-001
Issued: 12/11/2024                 Valid Until: 12/31/2024

═══════════════════════════════════════════════════════════════`);
  backgroundColor = signal('#ffffff');
  textColor = signal('#000000');
  fontSize = signal(12); // Standard document font size
  fontFamily = signal('Arial');
  borderStyle = signal('none');
  borderColor = signal('#000000');
  borderWidth = signal(0);
  padding = signal(0);
  
  constructor(
    private noticeService: NoticeService,
    private router: Router
  ) {}
  
  saveNotice(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    this.noticeService.addNotice({
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
    });
    
    this.router.navigate(['/']);
  }
  
  printNotice(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    // Create a print-friendly window with A4 page styling
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
    
    // Build the HTML content for printing with proper A4 formatting
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
            
            * {
              box-sizing: border-box;
            }
            
            body {
              font-family: ${this.fontFamily()}, Arial, sans-serif;
              font-size: ${this.fontSize()}pt;
              margin: 0;
              padding: 0;
              color: ${this.textColor()};
              background-color: white;
              line-height: 1.6;
            }
            
            .page {
              page-break-after: always;
              min-height: 100vh;
            }
            
            .page:last-child {
              page-break-after: auto;
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
              white-space: pre-wrap;
              word-wrap: break-word;
              font-size: ${this.fontSize()}pt;
              line-height: 1.6;
            }
            
            .page-footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              text-align: center;
              font-size: 9pt;
              color: #666;
              padding: 10pt 25mm;
              border-top: 1pt solid #ddd;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .page-footer {
                position: fixed;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
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
            
            <div class="notice-content">${this.escapeHtml(this.content())}</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close after a delay to allow print dialog to appear
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
    this.title.set('');
    this.content.set('');
    this.backgroundColor.set('#ffffff');
    this.textColor.set('#000000');
    this.fontSize.set(12);
    this.fontFamily.set('Arial');
    this.borderStyle.set('none');
    this.borderColor.set('#000000');
    this.borderWidth.set(0);
    this.padding.set(0);
  }
}
