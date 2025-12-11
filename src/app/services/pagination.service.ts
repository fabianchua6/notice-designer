import { Injectable } from '@angular/core';

/**
 * Represents a single page of content
 */
export interface Page {
  pageNumber: number;
  content: string; // HTML content for this page
  isFirstPage: boolean;
  hasOverflow: boolean; // If content was cut off
}

/**
 * Configuration for pagination
 */
export interface PaginationConfig {
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  headerHeight: number;
  footerHeight: number;
  fontSize: number;
  lineHeight: number;
}

/**
 * Result of measuring content
 */
interface ContentMeasurement {
  element: HTMLElement;
  height: number;
  canSplit: boolean; // Can this element be split across pages?
  type: 'text' | 'table' | 'image' | 'heading' | 'list' | 'other';
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  
  /**
   * Paginate HTML content into multiple pages
   */
  paginateHtmlContent(htmlContent: string, config: PaginationConfig): Page[] {
    const pages: Page[] = [];
    
    if (!htmlContent || htmlContent.trim() === '') {
      // Return single empty page
      return [{
        pageNumber: 1,
        content: '',
        isFirstPage: true,
        hasOverflow: false
      }];
    }
    
    // Calculate available content height per page
    const firstPageContentHeight = config.pageHeight - config.marginTop - config.marginBottom - config.headerHeight - config.footerHeight;
    const subsequentPageContentHeight = config.pageHeight - config.marginTop - config.marginBottom - config.footerHeight;
    
    // Create a temporary container to measure content
    const measurements = this.measureContent(htmlContent, config);
    
    // Split content into pages
    let currentPageNumber = 1;
    let currentPageContent: HTMLElement[] = [];
    let currentPageHeight = 0;
    const maxHeight = firstPageContentHeight;
    
    for (let i = 0; i < measurements.length; i++) {
      const measurement = measurements[i];
      const isFirstPage = currentPageNumber === 1;
      const availableHeight = isFirstPage ? firstPageContentHeight : subsequentPageContentHeight;
      
      // Check if element fits on current page
      if (currentPageHeight + measurement.height <= availableHeight) {
        // Element fits, add to current page
        currentPageContent.push(measurement.element);
        currentPageHeight += measurement.height;
      } else {
        // Element doesn't fit
        if (measurement.canSplit && measurement.type === 'table') {
          // Try to split table
          const splitResult = this.splitTable(measurement.element as HTMLTableElement, availableHeight - currentPageHeight, config);
          
          if (splitResult.firstPart) {
            currentPageContent.push(splitResult.firstPart);
            // Save current page
            pages.push({
              pageNumber: currentPageNumber,
              content: this.serializeElements(currentPageContent),
              isFirstPage: currentPageNumber === 1,
              hasOverflow: false
            });
            
            // Start new page with remaining part
            currentPageNumber++;
            currentPageContent = splitResult.secondPart ? [splitResult.secondPart] : [];
            currentPageHeight = splitResult.secondPart ? this.measureElement(splitResult.secondPart, config).height : 0;
          } else {
            // Couldn't split, move entire table to next page
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            currentPageNumber++;
            currentPageContent = [measurement.element];
            currentPageHeight = measurement.height;
          }
        } else {
          // Save current page and start new page with this element
          if (currentPageContent.length > 0) {
            pages.push({
              pageNumber: currentPageNumber,
              content: this.serializeElements(currentPageContent),
              isFirstPage: currentPageNumber === 1,
              hasOverflow: false
            });
            currentPageNumber++;
          }
          
          currentPageContent = [measurement.element];
          currentPageHeight = measurement.height;
        }
      }
    }
    
    // Add final page if there's content
    if (currentPageContent.length > 0) {
      pages.push({
        pageNumber: currentPageNumber,
        content: this.serializeElements(currentPageContent),
        isFirstPage: currentPageNumber === 1,
        hasOverflow: false
      });
    }
    
    // Ensure at least one page
    if (pages.length === 0) {
      pages.push({
        pageNumber: 1,
        content: '',
        isFirstPage: true,
        hasOverflow: false
      });
    }
    
    return pages;
  }
  
  /**
   * Measure all elements in HTML content
   */
  private measureContent(htmlContent: string, config: PaginationConfig): ContentMeasurement[] {
    const measurements: ContentMeasurement[] = [];
    
    // Create temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = `${config.pageWidth - config.marginLeft - config.marginRight}px`;
    container.style.fontSize = `${config.fontSize}px`;
    container.style.lineHeight = `${config.lineHeight}`;
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    
    try {
      // Measure each top-level element
      const children = Array.from(container.children);
      
      for (const child of children) {
        const element = child as HTMLElement;
        const measurement = this.measureElement(element, config);
        measurements.push(measurement);
      }
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
    
    return measurements;
  }
  
  /**
   * Measure a single element
   */
  private measureElement(element: HTMLElement, config: PaginationConfig): ContentMeasurement {
    const tagName = element.tagName.toLowerCase();
    const height = element.offsetHeight;
    
    let type: ContentMeasurement['type'] = 'other';
    let canSplit = false;
    
    switch (tagName) {
      case 'table':
        type = 'table';
        canSplit = true;
        break;
      case 'img':
        type = 'image';
        canSplit = false;
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        type = 'heading';
        canSplit = false;
        break;
      case 'ul':
      case 'ol':
        type = 'list';
        canSplit = true;
        break;
      case 'p':
      case 'div':
        type = 'text';
        canSplit = true;
        break;
      default:
        type = 'other';
        canSplit = false;
    }
    
    return {
      element: element.cloneNode(true) as HTMLElement,
      height,
      canSplit,
      type
    };
  }
  
  /**
   * Split a table between rows
   */
  private splitTable(
    table: HTMLTableElement, 
    availableHeight: number, 
    config: PaginationConfig
  ): { firstPart: HTMLTableElement | null; secondPart: HTMLTableElement | null } {
    const rows = Array.from(table.querySelectorAll('tr'));
    
    if (rows.length === 0) {
      return { firstPart: table, secondPart: null };
    }
    
    // Create temporary table to measure rows
    const tempTable = table.cloneNode(true) as HTMLTableElement;
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${config.pageWidth - config.marginLeft - config.marginRight}px`;
    tempContainer.appendChild(tempTable);
    document.body.appendChild(tempContainer);
    
    try {
      const tempRows = Array.from(tempTable.querySelectorAll('tr'));
      let cumulativeHeight = 0;
      let splitIndex = -1;
      
      // Find where to split
      for (let i = 0; i < tempRows.length; i++) {
        const rowHeight = tempRows[i].offsetHeight;
        if (cumulativeHeight + rowHeight > availableHeight) {
          splitIndex = i;
          break;
        }
        cumulativeHeight += rowHeight;
      }
      
      // If we can't fit even the first row, don't split
      if (splitIndex <= 0) {
        return { firstPart: null, secondPart: table };
      }
      
      // Create two table parts
      const firstTable = table.cloneNode(false) as HTMLTableElement;
      const secondTable = table.cloneNode(false) as HTMLTableElement;
      
      // Preserve table structure (thead, tbody, etc.)
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      const tfoot = table.querySelector('tfoot');
      
      if (thead) {
        firstTable.appendChild(thead.cloneNode(true));
        secondTable.appendChild(thead.cloneNode(true)); // Repeat header on next page
      }
      
      const firstTbody = document.createElement('tbody');
      const secondTbody = document.createElement('tbody');
      
      // Split rows
      for (let i = 0; i < rows.length; i++) {
        if (i < splitIndex) {
          firstTbody.appendChild(rows[i].cloneNode(true));
        } else {
          secondTbody.appendChild(rows[i].cloneNode(true));
        }
      }
      
      firstTable.appendChild(firstTbody);
      secondTable.appendChild(secondTbody);
      
      if (tfoot && splitIndex >= rows.length) {
        firstTable.appendChild(tfoot.cloneNode(true));
      } else if (tfoot) {
        secondTable.appendChild(tfoot.cloneNode(true));
      }
      
      return { firstPart: firstTable, secondPart: secondTable };
    } finally {
      document.body.removeChild(tempContainer);
    }
  }
  
  /**
   * Serialize elements to HTML string
   */
  private serializeElements(elements: HTMLElement[]): string {
    return elements.map(el => el.outerHTML).join('');
  }
  
  /**
   * Finalize and add page to pages array
   */
  private finalizePage(pages: Page[], pageNumber: number, content: HTMLElement[]): void {
    if (content.length > 0) {
      pages.push({
        pageNumber,
        content: this.serializeElements(content),
        isFirstPage: pageNumber === 1,
        hasOverflow: false
      });
    }
  }
}
