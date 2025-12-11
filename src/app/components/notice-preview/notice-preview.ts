import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PageContent {
  lines: string[];
  isFirstPage: boolean;
  pageNumber: number;
}

@Component({
  selector: 'app-notice-preview',
  imports: [CommonModule],
  templateUrl: './notice-preview.html',
  styleUrl: './notice-preview.scss',
})
export class NoticePreview implements OnChanges {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() backgroundColor: string = '#ffffff';
  @Input() textColor: string = '#000000';
  @Input() fontSize: number = 12;
  @Input() fontFamily: string = 'Arial';
  @Input() borderStyle: string = 'none';
  @Input() borderColor: string = '#000000';
  @Input() borderWidth: number = 0;
  @Input() padding: number = 0;
  @Input() showPageNumbers: boolean = true;
  @Input() showRuler: boolean = true;
  
  zoom: number = 70; // Default to 70% to fit better in preview panel

  // A4 dimensions at 96 DPI: 794px x 1123px
  readonly pageWidth = 794;
  readonly pageHeight = 1123;
  readonly marginTop = 96; // ~1 inch
  readonly marginBottom = 96;
  readonly marginLeft = 96;
  readonly marginRight = 96;
  readonly headerHeight = 80;
  readonly footerHeight = 40;
  
  // Approximate lines per page based on font size and line height
  readonly lineHeight = 1.6;
  
  pages: PageContent[] = [];
  
  zoomIn(): void {
    this.zoom = Math.min(150, this.zoom + 10);
  }
  
  zoomOut(): void {
    this.zoom = Math.max(25, this.zoom - 10);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] || changes['title'] || changes['fontSize']) {
      this.paginateContent();
    }
  }
  
  get contentAreaHeight(): number {
    return this.pageHeight - this.marginTop - this.marginBottom - this.headerHeight - this.footerHeight;
  }
  
  get linesPerPage(): number {
    const lineHeightPx = this.fontSize * this.lineHeight;
    // First page has title, so fewer lines
    return Math.floor(this.contentAreaHeight / lineHeightPx);
  }
  
  get firstPageLines(): number {
    // Account for title taking up space
    const titleLines = 3; // Title + spacing
    return this.linesPerPage - titleLines;
  }
  
  paginateContent(): void {
    this.pages = [];
    
    if (!this.content) {
      // Always show at least one page
      this.pages.push({
        lines: [],
        isFirstPage: true,
        pageNumber: 1
      });
      return;
    }
    
    // Split content by newlines and handle word wrapping (approximate)
    const rawLines = this.content.split('\n');
    const allLines: string[] = [];
    
    // Approximate characters per line based on font size and page width
    const contentWidth = this.pageWidth - this.marginLeft - this.marginRight;
    const avgCharWidth = this.fontSize * 0.6; // Approximate average character width
    const charsPerLine = Math.floor(contentWidth / avgCharWidth);
    
    rawLines.forEach(line => {
      if (line.length <= charsPerLine || line.trim() === '') {
        allLines.push(line);
      } else {
        // Simple word wrap
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
            currentLine = (currentLine + ' ' + word).trim();
          } else {
            if (currentLine) allLines.push(currentLine);
            currentLine = word;
          }
        });
        
        if (currentLine) allLines.push(currentLine);
      }
    });
    
    let currentIndex = 0;
    let pageNumber = 1;
    
    while (currentIndex < allLines.length || pageNumber === 1) {
      const isFirstPage = pageNumber === 1;
      const maxLines = isFirstPage ? this.firstPageLines : this.linesPerPage;
      const pageLines = allLines.slice(currentIndex, currentIndex + maxLines);
      
      this.pages.push({
        lines: pageLines,
        isFirstPage,
        pageNumber
      });
      
      currentIndex += maxLines;
      pageNumber++;
      
      // Safety check to prevent infinite loop
      if (currentIndex >= allLines.length && pageNumber > 1) break;
    }
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
}
