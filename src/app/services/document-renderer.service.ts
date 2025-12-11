import { Injectable } from '@angular/core';

/**
 * Document Header Data - Information displayed in the document header
 */
export interface DocumentHeaderData {
  taxRef: string;
  date: string;
  recipientName: string;
  recipientAddress: string[];
  showQuoteNote: boolean;
}

/**
 * Document Render Options - Configuration for rendering
 */
export interface DocumentRenderOptions {
  title: string;
  content: string;
  header?: DocumentHeaderData;
  showBarcode?: boolean;
  barcodeValue?: string;
  fontSize?: number;
  pageNumber?: number;
  totalPages?: number;
  showFooter?: boolean;
  isForPrint?: boolean;
}

/**
 * DocumentRendererService
 * 
 * Single source of truth for all document rendering.
 * Used by: Editor Preview, Notice Preview Component, Print/PDF
 * 
 * This ensures pixel-perfect consistency between preview and print output.
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentRendererService {
  
  // IRAS Logo as base64 for print (can't use relative URLs in print window)
  private readonly IRAS_LOGO_BASE64 = 'data:image/png;base64,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';

  // Local logo path for preview (relative URL works in Angular app)
  private readonly IRAS_LOGO_PATH = '/assets/images/iras-logo.png';

  /**
   * Get the complete document CSS styles
   * Single source of truth for all styling
   */
  getDocumentStyles(): string {
    return `
      * { box-sizing: border-box; }
      
      .document-page {
        font-family: 'Source Sans Pro', Arial, sans-serif;
        font-size: 12px;
        line-height: 1.6;
        color: #333;
        background-color: white;
      }
      
      /* Document Header */
      .document-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      
      .header-left {
        flex: 1;
      }
      
      .header-left p {
        margin: 0;
        font-size: 11px;
        line-height: 1.6;
      }
      
      .header-left .tax-ref,
      .header-left .date-line {
        font-size: 11px;
        color: #333;
      }
      
      .header-left strong {
        font-weight: 600;
      }
      
      .header-left .quote-note {
        margin: 16px 0 12px 0;
        font-size: 10px;
        color: #333;
        line-height: 1.4;
      }
      
      .header-left .taxpayer-info {
        margin: 12px 0 16px 0;
      }
      
      .header-left .taxpayer-info p {
        margin: 0;
        font-size: 11px;
        line-height: 1.5;
      }
      
      .header-left .barcode-container {
        margin-top: 16px;
      }
      
      .header-left .barcode-container svg {
        max-height: 40px;
      }
      
      .header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      
      .header-right .iras-logo {
        height: 80px;
        width: auto;
      }
      
      /* Document Title */
      .document-title {
        margin: 20px 0 24px 0;
      }
      
      .document-title h1 {
        margin: 0;
        background: #015AAD;
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        font-family: 'Source Sans Pro', Arial, sans-serif;
        text-align: left;
      }
      
      /* Document Body */
      .document-body {
        font-family: 'Source Sans Pro', Arial, sans-serif;
        font-size: 12px;
        line-height: 1.6;
      }
      
      .document-body table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .document-body td,
      .document-body th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      
      /* Variable Highlighting */
      .variable-value {
        background-color: #e8f5e9;
        border: 1px solid #4caf50;
        border-radius: 3px;
        padding: 1px 4px;
        color: #2e7d32;
        font-weight: 500;
      }
      
      .variable-placeholder {
        background-color: #fff3e0;
        border: 1px solid #ff9800;
        border-radius: 3px;
        padding: 1px 4px;
        color: #e65100;
        font-weight: 500;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 0.9em;
      }
      
      /* Document Footer */
      .document-footer {
        margin-top: 40px;
        padding-top: 16px;
        border-top: 1px solid #ddd;
        font-size: 10px;
        color: #666;
        text-align: center;
      }
      
      .document-footer a {
        color: #015AAD;
        text-decoration: none;
      }
      
      .document-footer .page-number {
        margin-top: 8px;
      }
      
      /* Print-specific */
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
  }

  /**
   * Generate the document header HTML
   */
  generateHeaderHTML(data: DocumentHeaderData, isForPrint: boolean = false): string {
    const logoSrc = isForPrint ? this.IRAS_LOGO_BASE64 : this.IRAS_LOGO_PATH;
    
    return `
      <div class="document-header">
        <div class="header-left">
          <p class="tax-ref">Tax Reference Number: <strong>${this.escapeHtml(data.taxRef)}</strong></p>
          <p class="date-line">Date: ${this.escapeHtml(data.date)}</p>
          ${data.showQuoteNote ? `
            <p class="quote-note">Please quote the Tax Reference Number (e.g. NRIC, FIN etc.) in full when corresponding with us.</p>
          ` : ''}
          <div class="taxpayer-info">
            <p><strong>${this.escapeHtml(data.recipientName)}</strong></p>
            ${data.recipientAddress.map(line => `<p>${this.escapeHtml(line)}</p>`).join('')}
          </div>
          <div class="barcode-container">
            <svg class="barcode-svg"></svg>
          </div>
        </div>
        <div class="header-right">
          <img src="${logoSrc}" alt="IRAS Logo" class="iras-logo" onerror="this.style.display='none'">
        </div>
      </div>
    `;
  }

  /**
   * Generate the document title HTML
   */
  generateTitleHTML(title: string): string {
    if (!title) return '';
    return `
      <div class="document-title">
        <h1>${this.escapeHtml(title)}</h1>
      </div>
    `;
  }

  /**
   * Generate the document footer HTML
   */
  generateFooterHTML(pageNumber?: number, totalPages?: number): string {
    const pageInfo = pageNumber && totalPages 
      ? `<p class="page-number">Page ${pageNumber} of ${totalPages}</p>` 
      : '';
    
    return `
      <div class="document-footer">
        <p>Website: <a href="https://www.iras.gov.sg">www.iras.gov.sg</a> • myTax Portal: <a href="https://mytax.iras.gov.sg">mytax.iras.gov.sg</a></p>
        ${pageInfo}
      </div>
    `;
  }

  /**
   * Generate complete document HTML for preview
   */
  generateDocumentHTML(options: DocumentRenderOptions): string {
    const header = options.header 
      ? this.generateHeaderHTML(options.header, options.isForPrint || false)
      : '';
    
    const title = this.generateTitleHTML(options.title);
    const footer = options.showFooter !== false 
      ? this.generateFooterHTML(options.pageNumber, options.totalPages) 
      : '';
    
    return `
      <div class="document-page">
        ${header}
        ${title}
        <div class="document-body">${options.content}</div>
        ${footer}
      </div>
    `;
  }

  /**
   * Generate complete print-ready HTML document
   * Includes DOCTYPE, head with styles, and body
   */
  generatePrintHTML(options: DocumentRenderOptions): string {
    const documentContent = this.generateDocumentHTML({
      ...options,
      isForPrint: true
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.escapeHtml(options.title)}</title>
          <meta charset="UTF-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 25mm;
            }
            
            body {
              margin: 0;
              padding: 0;
            }
            
            ${this.getDocumentStyles()}
          </style>
        </head>
        <body>
          ${documentContent}
        </body>
      </html>
    `;
  }

  /**
   * Get default header data with sample values
   */
  getDefaultHeaderData(): DocumentHeaderData {
    return {
      taxRef: 'S1234567A',
      date: new Date().toLocaleDateString('en-SG', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      recipientName: 'MR JOHN DOE',
      recipientAddress: [
        '123 SAMPLE STREET',
        '#01-23',
        'SINGAPORE 123456'
      ],
      showQuoteNote: true
    };
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
