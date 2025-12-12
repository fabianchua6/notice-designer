import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type IrasBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type IrasBadgeSize = 'small' | 'medium' | 'large';

/**
 * IRAS Design System - Badge Component
 * 
 * A small status indicator component for labels, counts, and statuses.
 * 
 * @example
 * <iras-badge variant="success">Published</iras-badge>
 * <iras-badge variant="warning" icon="warning">Pending</iras-badge>
 */
@Component({
  selector: 'iras-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <span [class]="badgeClasses">
      @if (icon) {
        <mat-icon>{{ icon }}</mat-icon>
      }
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    @use '../styles/variables' as *;
    
    :host {
      display: inline-block;
    }
    
    span {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;
      font-family: $font-family-primary;
      font-weight: $font-weight-medium;
      line-height: 1;
      white-space: nowrap;
      vertical-align: middle;
      
      mat-icon {
        font-size: inherit;
        width: 1em;
        height: 1em;
      }
    }
    
    // ========================================
    // VARIANTS
    // ========================================
    
    .badge-primary {
      background-color: rgba($iras-primary, 0.1);
      color: $iras-primary-dark;
    }
    
    .badge-secondary {
      background-color: rgba($iras-teal, 0.1);
      color: $iras-teal-dark;
    }
    
    .badge-success {
      background-color: $success-light;
      color: $success-dark;
    }
    
    .badge-warning {
      background-color: $warning-light;
      color: $warning-dark;
    }
    
    .badge-danger {
      background-color: $danger-light;
      color: $danger-dark;
    }
    
    .badge-info {
      background-color: $info-light;
      color: $info-dark;
    }
    
    .badge-neutral {
      background-color: $neutral-grey-200;
      color: $neutral-grey-700;
    }
    
    // ========================================
    // SIZES
    // ========================================
    
    .badge-small {
      padding: 2px $spacing-sm;
      font-size: $font-size-xs;
      border-radius: $radius-sm;
    }
    
    .badge-medium {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-sm;
      border-radius: $radius-base;
    }
    
    .badge-large {
      padding: $spacing-sm $spacing-md;
      font-size: $font-size-base;
      border-radius: $radius-base;
    }
    
    // ========================================
    // DOT VARIANT
    // ========================================
    
    .badge-dot {
      padding: $spacing-xs $spacing-sm $spacing-xs $spacing-md;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        left: $spacing-sm;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: currentColor;
      }
    }
  `]
})
export class IrasBadge {
  @Input() variant: IrasBadgeVariant = 'neutral';
  @Input() size: IrasBadgeSize = 'medium';
  @Input() icon?: string;
  @Input() dot = false;
  
  get badgeClasses(): string {
    const classes = [
      `badge-${this.variant}`,
      `badge-${this.size}`,
    ];
    
    if (this.dot) {
      classes.push('badge-dot');
    }
    
    return classes.join(' ');
  }
}

/**
 * IRAS Pill Component - Rounded badge variant
 */
@Component({
  selector: 'iras-pill',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <span [class]="pillClasses">
      @if (icon) {
        <mat-icon>{{ icon }}</mat-icon>
      }
      <ng-content></ng-content>
      @if (removable) {
        <button class="pill-remove" (click)="onRemove()" aria-label="Remove">
          <mat-icon>close</mat-icon>
        </button>
      }
    </span>
  `,
  styles: [`
    @use '../styles/variables' as *;
    
    :host {
      display: inline-block;
    }
    
    span {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-xs $spacing-md;
      font-family: $font-family-primary;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      line-height: 1;
      border-radius: $radius-full;
      white-space: nowrap;
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      
      .pill-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: 0;
        margin-left: $spacing-xs;
        margin-right: -$spacing-xs;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        transition: opacity $duration-fast $timing-ease-out;
        
        &:hover {
          opacity: 1;
        }
        
        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }
    }
    
    // Variants
    .pill-primary {
      background-color: $iras-primary;
      color: $text-inverse;
    }
    
    .pill-secondary {
      background-color: $iras-teal;
      color: $text-inverse;
    }
    
    .pill-success {
      background-color: $success;
      color: $text-inverse;
    }
    
    .pill-warning {
      background-color: $warning;
      color: $warning-dark;
    }
    
    .pill-danger {
      background-color: $danger;
      color: $text-inverse;
    }
    
    .pill-info {
      background-color: $info;
      color: $text-inverse;
    }
    
    .pill-neutral {
      background-color: $neutral-grey-300;
      color: $neutral-grey-700;
    }
    
    // Outlined variant
    .pill-outlined {
      background-color: transparent;
      border: 1px solid currentColor;
    }
  `]
})
export class IrasPill {
  @Input() variant: IrasBadgeVariant = 'neutral';
  @Input() icon?: string;
  @Input() removable = false;
  @Input() outlined = false;
  @Output() remove = new EventEmitter<void>();
  
  get pillClasses(): string {
    const classes = [`pill-${this.variant}`];
    
    if (this.outlined) {
      classes.push('pill-outlined');
    }
    
    return classes.join(' ');
  }
  
  onRemove(): void {
    this.remove.emit();
  }
}
