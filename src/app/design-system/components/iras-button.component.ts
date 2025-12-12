import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type IrasButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
export type IrasButtonSize = 'small' | 'medium' | 'large';

/**
 * IRAS Design System - Button Component
 * 
 * A customizable button component that follows IRAS design guidelines.
 * 
 * @example
 * <iras-button variant="primary" size="medium">Click me</iras-button>
 * <iras-button variant="secondary" [loading]="isLoading" icon="save">Save</iras-button>
 */
@Component({
  selector: 'iras-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading">
      @if (loading) {
        <mat-spinner diameter="16" class="button-spinner"></mat-spinner>
      } @else if (icon && iconPosition === 'left') {
        <mat-icon>{{ icon }}</mat-icon>
      }
      
      <span class="button-content" #content>
        <ng-content></ng-content>
      </span>
      
      @if (!loading && icon && iconPosition === 'right') {
        <mat-icon>{{ icon }}</mat-icon>
      }
    </button>
  `,
  styles: [`
    @use 'sass:color' as color;
    @use '../styles/variables' as *;
    
    :host {
      display: inline-block;
    }
    
    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      font-family: $font-family-primary;
      font-weight: $font-weight-medium;
      letter-spacing: $letter-spacing-wide;
      border: none;
      cursor: pointer;
      transition: all $duration-base $timing-ease-out;
      white-space: nowrap;
      user-select: none;
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      
      &:focus-visible {
        @include focus-ring;
      }
      
      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        
        &.icon-only {
          margin: 0;
        }
      }
      
      .button-spinner {
        ::ng-deep circle {
          stroke: currentColor;
        }
      }
      
      .button-content:empty {
        display: none;
      }
    }
    
    // ========================================
    // VARIANTS
    // ========================================
    
    // Primary
    .btn-primary {
      background: linear-gradient(135deg, $iras-primary 0%, $iras-sapphire 100%);
      color: $text-inverse;
      box-shadow: $shadow-sm;
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, $iras-primary-dark 0%, color.adjust($iras-sapphire, $lightness: -5%) 100%);
        box-shadow: $shadow-base;
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: $shadow-sm;
      }
    }
    
    // Secondary
    .btn-secondary {
      background: linear-gradient(135deg, $iras-teal 0%, $iras-teal-dark 100%);
      color: $text-inverse;
      box-shadow: $shadow-sm;
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, color.adjust($iras-teal, $lightness: -5%) 0%, color.adjust($iras-teal-dark, $lightness: -5%) 100%);
        box-shadow: $shadow-base;
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: $shadow-sm;
      }
    }
    
    // Tertiary (Outlined)
    .btn-tertiary {
      background: transparent;
      color: $iras-primary;
      border: 2px solid $iras-primary;
      
      &:hover:not(:disabled) {
        background: $iras-primary-lighter;
        border-color: $iras-primary-dark;
      }
      
      &:active:not(:disabled) {
        background: color.adjust($iras-primary-lighter, $lightness: -5%);
      }
    }
    
    // Danger
    .btn-danger {
      background: $danger;
      color: $text-inverse;
      box-shadow: $shadow-sm;
      
      &:hover:not(:disabled) {
        background: $danger-dark;
        box-shadow: $shadow-base;
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: $shadow-sm;
      }
    }
    
    // Ghost
    .btn-ghost {
      background: transparent;
      color: $text-primary;
      
      &:hover:not(:disabled) {
        background: $neutral-grey-100;
      }
      
      &:active:not(:disabled) {
        background: $neutral-grey-200;
      }
    }
    
    // ========================================
    // SIZES
    // ========================================
    
    .btn-small {
      height: $button-height-sm;
      padding: $button-padding-sm;
      font-size: $font-size-sm;
      border-radius: $radius-base;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }
    
    .btn-medium {
      height: $button-height-md;
      padding: $button-padding-md;
      font-size: $font-size-base;
      border-radius: $radius-lg;
    }
    
    .btn-large {
      height: $button-height-lg;
      padding: $button-padding-lg;
      font-size: $font-size-lg;
      border-radius: $radius-lg;
      
      mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
    
    // ========================================
    // FULL WIDTH
    // ========================================
    
    .btn-full-width {
      width: 100%;
    }
  `]
})
export class IrasButton {
  @Input() variant: IrasButtonVariant = 'primary';
  @Input() size: IrasButtonSize = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  
  get buttonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`,
    ];
    
    if (this.fullWidth) {
      classes.push('btn-full-width');
    }
    
    return classes.join(' ');
  }
}
