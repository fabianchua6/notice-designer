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
  
  // Advanced configuration
  headingOrphanThreshold?: number; // Height threshold for heading orphan prevention (default: 50px)
  pageBottomThreshold?: number; // Percentage of page height to consider "near bottom" (default: 0.8)
  imageMargin?: number; // Margin to leave around scaled images (default: 40px)
  defaultImageHeight?: number; // Fallback height for images without dimensions (default: 400px)
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
    
    for (let i = 0; i < measurements.length; i++) {
      const measurement = measurements[i];
      const isFirstPage = currentPageNumber === 1;
      const availableHeight = isFirstPage ? firstPageContentHeight : subsequentPageContentHeight;
      const remainingHeight = availableHeight - currentPageHeight;
      
      // Check if element fits on current page
      if (currentPageHeight + measurement.height <= availableHeight) {
        // Element fits, add to current page
        currentPageContent.push(measurement.element);
        currentPageHeight += measurement.height;
      } else {
        // Element doesn't fit - need to handle based on type
        
        if (measurement.type === 'heading') {
          // Headings should not be orphaned - move to next page if near bottom
          // Also check if next element is small enough to keep with heading
          const orphanThreshold = config.headingOrphanThreshold || 50;
          const bottomThreshold = config.pageBottomThreshold || 0.8;
          const keepWithNext = i < measurements.length - 1 && remainingHeight < orphanThreshold;
          
          if (keepWithNext || currentPageHeight > availableHeight * bottomThreshold) {
            // Move heading to next page
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            currentPageNumber++;
            currentPageContent = [measurement.element];
            currentPageHeight = measurement.height;
          } else {
            // Add to current page
            currentPageContent.push(measurement.element);
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            currentPageNumber++;
            currentPageContent = [];
            currentPageHeight = 0;
          }
        } else if (measurement.type === 'image') {
          // Images cannot be split - move entirely to next page
          this.finalizePage(pages, currentPageNumber, currentPageContent);
          currentPageNumber++;
          
          // Check if image is too large for a single page
          if (measurement.height > subsequentPageContentHeight) {
            // Scale image down to fit
            const scaledImage = this.scaleImage(measurement.element as HTMLImageElement, subsequentPageContentHeight);
            currentPageContent = [scaledImage];
            currentPageHeight = subsequentPageContentHeight;
          } else {
            currentPageContent = [measurement.element];
            currentPageHeight = measurement.height;
          }
        } else if (measurement.canSplit && measurement.type === 'table') {
          // Try to split table
          const splitResult = this.splitTable(measurement.element as HTMLTableElement, remainingHeight, config);
          
          if (splitResult.firstPart) {
            currentPageContent.push(splitResult.firstPart);
            // Save current page
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            
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
        } else if (measurement.canSplit && measurement.type === 'list') {
          // Try to split list
          const splitResult = this.splitList(measurement.element as HTMLUListElement | HTMLOListElement, remainingHeight, config);
          
          if (splitResult.firstPart) {
            currentPageContent.push(splitResult.firstPart);
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            
            currentPageNumber++;
            currentPageContent = splitResult.secondPart ? [splitResult.secondPart] : [];
            currentPageHeight = splitResult.secondPart ? this.measureElement(splitResult.secondPart, config).height : 0;
          } else {
            // Couldn't split, move entire list to next page
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            currentPageNumber++;
            currentPageContent = [measurement.element];
            currentPageHeight = measurement.height;
          }
        } else {
          // Default: move element to next page
          if (currentPageContent.length > 0) {
            this.finalizePage(pages, currentPageNumber, currentPageContent);
            currentPageNumber++;
          }
          
          currentPageContent = [measurement.element];
          currentPageHeight = measurement.height;
        }
      }
    }
    
    // Add final page if there's content
    if (currentPageContent.length > 0) {
      this.finalizePage(pages, currentPageNumber, currentPageContent);
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
   * Split a list between items
   */
  private splitList(
    list: HTMLUListElement | HTMLOListElement,
    availableHeight: number,
    config: PaginationConfig
  ): { firstPart: HTMLElement | null; secondPart: HTMLElement | null } {
    const items = Array.from(list.querySelectorAll(':scope > li'));
    
    if (items.length === 0) {
      return { firstPart: list, secondPart: null };
    }
    
    // Create temporary list to measure items
    const tempList = list.cloneNode(true) as HTMLElement;
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${config.pageWidth - config.marginLeft - config.marginRight}px`;
    tempContainer.appendChild(tempList);
    document.body.appendChild(tempContainer);
    
    try {
      const tempItems = Array.from(tempList.querySelectorAll(':scope > li'));
      let cumulativeHeight = 0;
      let splitIndex = -1;
      
      // Find where to split
      for (let i = 0; i < tempItems.length; i++) {
        const itemHeight = (tempItems[i] as HTMLElement).offsetHeight;
        if (cumulativeHeight + itemHeight > availableHeight) {
          splitIndex = i;
          break;
        }
        cumulativeHeight += itemHeight;
      }
      
      // If we can't fit even the first item, don't split
      if (splitIndex <= 0) {
        return { firstPart: null, secondPart: list };
      }
      
      // Create two list parts
      const firstList = list.cloneNode(false) as HTMLElement;
      const secondList = list.cloneNode(false) as HTMLElement;
      
      // Split items
      for (let i = 0; i < items.length; i++) {
        if (i < splitIndex) {
          firstList.appendChild(items[i].cloneNode(true));
        } else {
          secondList.appendChild(items[i].cloneNode(true));
        }
      }
      
      // For ordered lists, adjust the start attribute on the second part
      if (list.tagName.toLowerCase() === 'ol') {
        (secondList as HTMLOListElement).start = splitIndex + 1;
      }
      
      return { firstPart: firstList, secondPart: secondList };
    } finally {
      document.body.removeChild(tempContainer);
    }
  }
  
  /**
   * Scale an image to fit within available height
   */
  private scaleImage(image: HTMLImageElement, maxHeight: number): HTMLElement {
    const scaledImage = image.cloneNode(true) as HTMLImageElement;
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.margin = '16px 0';
    
    // Try to get actual image dimensions
    // Priority: naturalHeight > offsetHeight > style.height > fallback
    const originalHeight = image.naturalHeight || 
                          image.offsetHeight || 
                          (image.style.height ? parseInt(image.style.height) : 0) || 
                          400; // Fallback for images without dimensions
    
    const scale = maxHeight / originalHeight;
    const imageMargin = 40; // Leave margin around image
    
    if (scale < 1) {
      scaledImage.style.maxHeight = `${maxHeight - imageMargin}px`;
      scaledImage.style.height = 'auto';
      scaledImage.style.width = 'auto';
    }
    
    container.appendChild(scaledImage);
    return container;
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
