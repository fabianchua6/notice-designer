import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IrasCardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

/**
 * IRAS Design System - Card Component
 * 
 * A flexible card container that follows IRAS design guidelines.
 * 
 * @example
 * <iras-card variant="elevated">
 *   <iras-card-header>
 *     <h3>Card Title</h3>
 *   </iras-card-header>
 *   <iras-card-content>
 *     Card content goes here
 *   </iras-card-content>
 * </iras-card>
 */
@Component({
  selector: 'iras-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    }
    
    :host(.hoverable):hover {
      box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
    }
  `]
})
export class IrasCard {
  @Input() variant: IrasCardVariant = 'default';
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'none';
  @Input() hoverable = false;
  @Input() clickable = false;
}

/**
 * Card Header Component
 */
@Component({
  selector: 'iras-card-header',
  standalone: true,
  template: `
    <div class="card-header">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-header {
      padding: 16px;
      
      ::ng-deep h1, ::ng-deep h2, ::ng-deep h3, ::ng-deep h4, ::ng-deep h5, ::ng-deep h6 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #1a1a2e;
      }
      
      ::ng-deep p, ::ng-deep .subtitle {
        margin: 4px 0 0;
        color: #666;
        font-size: 13px;
      }
    }
  `]
})
export class IrasCardHeader {}

/**
 * Card Content Component
 */
@Component({
  selector: 'iras-card-content',
  standalone: true,
  template: `
    <div class="card-content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-content {
      padding: 16px;
      padding-top: 0;
    }
  `]
})
export class IrasCardContent {}

/**
 * Card Actions Component
 */
@Component({
  selector: 'iras-card-actions',
  standalone: true,
  template: `
    <div class="card-actions" [class.align-right]="align === 'right'" [class.align-center]="align === 'center'">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      
      &.align-right {
        justify-content: flex-end;
      }
      
      &.align-center {
        justify-content: center;
      }
    }
  `]
})
export class IrasCardActions {
  @Input() align: 'left' | 'center' | 'right' = 'left';
}
