import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaginationService, Page, PaginationConfig } from '../../services/pagination.service';
import { LetterHeader } from '../../models/notice.model';

declare var JsBarcode: any;

@Component({
  selector: 'app-notice-preview-enhanced',
  imports: [CommonModule],
  templateUrl: './notice-preview-enhanced.html',
  styleUrl: './notice-preview-enhanced.scss',
  encapsulation: ViewEncapsulation.None, // Allow HTML styles to work
})
export class NoticePreviewEnhanced implements OnChanges, AfterViewChecked {
  @Input() title: string = '';
  @Input() content: string = ''; // HTML content
  @Input() backgroundColor: string = '#ffffff';
  @Input() textColor: string = '#000000';
  @Input() fontSize: number = 12;
  @Input() fontFamily: string = 'Arial';
  @Input() showPageNumbers: boolean = true;
  @Input() showRuler: boolean = false;
  
  // Header configuration from main
  @Input() headerConfig: LetterHeader = {
    showHeader: true,
    showHeaderOnAllPages: true,
    taxRef: '',
    date: '',
    recipientName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressLine4: '',
    showQuoteNote: true,
    showBarcode: false
  };
  
  zoom: number = 100;
  private barcodeInitialized = false;

  // A4 dimensions at 96 DPI: 794px x 1123px
  readonly pageWidth = 794;
  readonly pageHeight = 1123;
  readonly marginTop = 56; // Match 20mm standard margin
  readonly marginBottom = 56;
  readonly marginLeft = 56;
  readonly marginRight = 56;
  readonly headerHeight = 200; // Full IRAS header height for first page
  readonly continuationHeaderHeight = 60; // Condensed header for pages 2+
  readonly footerHeight = 60;
  
  readonly lineHeight = 1.6;
  
  pages: Page[] = [];
  
  constructor(
    private paginationService: PaginationService,
    private sanitizer: DomSanitizer
  ) {}
  
  zoomIn(): void {
    this.zoom = Math.min(150, this.zoom + 10);
  }
  
  zoomOut(): void {
    this.zoom = Math.max(25, this.zoom - 10);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] || changes['title'] || changes['fontSize'] || changes['fontFamily'] || changes['headerConfig']) {
      this.paginateContent();
    }
    // Reset barcode when header config changes
    if (changes['headerConfig']) {
      this.barcodeInitialized = false;
    }
  }
  
  ngAfterViewChecked(): void {
    this.initializeBarcode();
  }
  
  private initializeBarcode(): void {
    if (this.barcodeInitialized || !this.headerConfig?.showBarcode || !this.headerConfig?.taxRef) {
      return;
    }
    
    const barcodeElements = document.querySelectorAll('.preview-barcode');
    if (barcodeElements.length > 0 && typeof JsBarcode !== 'undefined') {
      try {
        barcodeElements.forEach((el) => {
          JsBarcode(el, this.headerConfig.taxRef, {
            format: 'CODE128',
            width: 1.5,
            height: 35,
            displayValue: false,
            margin: 0,
          });
        });
        this.barcodeInitialized = true;
      } catch (e) {
        console.error('Barcode generation failed:', e);
      }
    }
  }
  
  paginateContent(): void {
    // Calculate header heights based on settings
    const firstPageHeaderHeight = this.headerConfig?.showHeader ? this.headerHeight : 0;
    const continuationHeaderHeight = (this.headerConfig?.showHeader && this.headerConfig?.showHeaderOnAllPages) 
      ? this.continuationHeaderHeight 
      : 0;
    
    const config: PaginationConfig = {
      pageWidth: this.pageWidth,
      pageHeight: this.pageHeight,
      marginTop: this.marginTop,
      marginBottom: this.marginBottom,
      marginLeft: this.marginLeft,
      marginRight: this.marginRight,
      headerHeight: firstPageHeaderHeight,
      continuationHeaderHeight: continuationHeaderHeight,
      footerHeight: this.footerHeight,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight
    };
    
    this.pages = this.paginationService.paginateHtmlContent(this.content, config);
  }
  
  getPageStyle() {
    const scale = this.zoom / 100;
    return {
      'width': `${this.pageWidth}px`,
      'min-height': `${this.pageHeight}px`,
      'background-color': this.backgroundColor,
      'color': this.textColor,
      'font-size': `${this.fontSize}px`,
      'font-family': this.fontFamily,
      'transform': `scale(${scale})`,
      'transform-origin': 'top center'
    };
  }
  
  getContentStyle() {
    return {
      'padding': `${this.marginTop}px ${this.marginRight}px ${this.marginBottom}px ${this.marginLeft}px`,
      'line-height': this.lineHeight
    };
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  
  /**
   * Sanitize HTML content for safe rendering
   * Note: Using bypassSecurityTrustHtml as the content comes from TinyMCE editor
   * which is already within the application's trust boundary. In production,
   * consider adding server-side sanitization or using DomSanitizer.sanitize()
   * with SecurityContext.HTML for untrusted user content.
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
