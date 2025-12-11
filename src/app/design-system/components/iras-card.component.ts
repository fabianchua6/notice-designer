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
    <div [class]="cardClasses" [class.hoverable]="hoverable" [class.clickable]="clickable">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    @import '../styles/variables';
    
    :host {
      display: block;
    }
    
    div {
      background: $bg-paper;
      border-radius: $radius-lg;
      transition: all $duration-base $timing-ease-out;
      
      &.hoverable:hover {
        transform: translateY(-2px);
      }
      
      &.clickable {
        cursor: pointer;
        
        &:active {
          transform: translateY(0);
        }
      }
    }
    
    // Default
    .card-default {
      box-shadow: $shadow-sm;
      border: 1px solid $border-default;
      
      &.hoverable:hover {
        box-shadow: $shadow-base;
      }
    }
    
    // Elevated
    .card-elevated {
      box-shadow: $shadow-base;
      border: none;
      
      &.hoverable:hover {
        box-shadow: $shadow-md;
      }
    }
    
    // Outlined
    .card-outlined {
      box-shadow: none;
      border: 2px solid $border-default;
      
      &.hoverable:hover {
        border-color: $iras-primary;
      }
    }
    
    // Filled
    .card-filled {
      box-shadow: none;
      border: 1px solid $border-light;
      background: $neutral-grey-100;
    }
    
    // Padding sizes
    .card-padding-sm {
      padding: $card-padding-sm;
    }
    
    .card-padding-md {
      padding: $card-padding-md;
    }
    
    .card-padding-lg {
      padding: $card-padding-lg;
    }
    
    .card-padding-none {
      padding: 0;
    }
  `]
})
export class IrasCard {
  @Input() variant: IrasCardVariant = 'default';
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  @Input() hoverable = false;
  @Input() clickable = false;
  
  get cardClasses(): string {
    const classes = [
      `card-${this.variant}`,
      `card-padding-${this.padding === 'small' ? 'sm' : this.padding === 'large' ? 'lg' : this.padding === 'none' ? 'none' : 'md'}`,
    ];
    
    return classes.join(' ');
  }
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
    @import '../styles/variables';
    
    .card-header {
      padding: $spacing-lg;
      border-bottom: 1px solid $border-default;
      
      ::ng-deep h1, ::ng-deep h2, ::ng-deep h3, ::ng-deep h4, ::ng-deep h5, ::ng-deep h6 {
        margin: 0;
        color: $text-primary;
        font-weight: $font-weight-semibold;
      }
      
      ::ng-deep p {
        margin: $spacing-xs 0 0;
        color: $text-secondary;
        font-size: $font-size-sm;
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
    @import '../styles/variables';
    
    .card-content {
      padding: $spacing-lg;
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
    @import '../styles/variables';
    
    .card-actions {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-md $spacing-lg;
      border-top: 1px solid $border-default;
      
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
