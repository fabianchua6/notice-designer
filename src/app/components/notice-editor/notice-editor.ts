import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { NoticeService } from '../../services/notice';
import { NoticePreview } from '../notice-preview/notice-preview';

@Component({
  selector: 'app-notice-editor',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NoticePreview,
  ],
  templateUrl: './notice-editor.html',
  styleUrl: './notice-editor.scss',
})
export class NoticeEditor {
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
  fontSize = signal(16);
  fontFamily = signal('Arial');
  borderStyle = signal('solid');
  borderColor = signal('#000000');
  borderWidth = signal(1);
  padding = signal(16);
  
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
  
  resetForm(): void {
    this.title.set('');
    this.content.set('');
    this.backgroundColor.set('#ffffff');
    this.textColor.set('#000000');
    this.fontSize.set(16);
    this.fontFamily.set('Arial');
    this.borderStyle.set('solid');
    this.borderColor.set('#000000');
    this.borderWidth.set(1);
    this.padding.set(16);
  }
}
