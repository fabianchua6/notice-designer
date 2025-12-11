import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaginationService, Page, PaginationConfig } from '../../services/pagination.service';

@Component({
  selector: 'app-notice-preview-enhanced',
  imports: [CommonModule],
  templateUrl: './notice-preview-enhanced.html',
  styleUrl: './notice-preview-enhanced.scss',
  encapsulation: ViewEncapsulation.None, // Allow HTML styles to work
})
export class NoticePreviewEnhanced implements OnChanges {
  @Input() title: string = '';
  @Input() content: string = ''; // HTML content
  @Input() backgroundColor: string = '#ffffff';
  @Input() textColor: string = '#000000';
  @Input() fontSize: number = 12;
  @Input() fontFamily: string = 'Arial';
  @Input() showPageNumbers: boolean = true;
  @Input() showRuler: boolean = false;
  
  zoom: number = 100;

  // A4 dimensions at 96 DPI: 794px x 1123px
  readonly pageWidth = 794;
  readonly pageHeight = 1123;
  readonly marginTop = 96; // ~1 inch
  readonly marginBottom = 96;
  readonly marginLeft = 96;
  readonly marginRight = 96;
  readonly headerHeight = 80;
  readonly footerHeight = 40;
  
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
    if (changes['content'] || changes['title'] || changes['fontSize'] || changes['fontFamily']) {
      this.paginateContent();
    }
  }
  
  paginateContent(): void {
    const config: PaginationConfig = {
      pageWidth: this.pageWidth,
      pageHeight: this.pageHeight,
      marginTop: this.marginTop,
      marginBottom: this.marginBottom,
      marginLeft: this.marginLeft,
      marginRight: this.marginRight,
      headerHeight: this.headerHeight,
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
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
