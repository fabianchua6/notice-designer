import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type IrasAlertType = 'info' | 'success' | 'warning' | 'danger';

/**
 * IRAS Design System - Alert Component
 * 
 * An alert/notification component for displaying important messages.
 * Follows IRAS design guidelines with proper semantic colors.
 * 
 * @example
 * <iras-alert type="success" [dismissible]="true">
 *   Your notice has been saved successfully!
 * </iras-alert>
 */
@Component({
  selector: 'iras-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (!dismissed) {
      <div [class]="alertClasses" role="alert">
        <div class="alert-icon">
          <mat-icon>{{ iconName }}</mat-icon>
        </div>
        <div class="alert-content">
          @if (title) {
            <div class="alert-title">{{ title }}</div>
          }
          <div class="alert-message">
            <ng-content></ng-content>
          </div>
        </div>
        @if (dismissible) {
          <button mat-icon-button class="alert-close" (click)="dismiss()" aria-label="Close alert">
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    @import '../styles/variables';
    
    :host {
      display: block;
      margin-bottom: $spacing-md;
    }
    
    div[role="alert"] {
      display: flex;
      align-items: flex-start;
      gap: $spacing-md;
      padding: $spacing-md $spacing-lg;
      border-radius: $radius-lg;
      border-left: 4px solid;
      position: relative;
      
      .alert-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
      
      .alert-content {
        flex: 1;
        min-width: 0;
        
        .alert-title {
          font-weight: $font-weight-semibold;
          font-size: $font-size-base;
          margin-bottom: $spacing-xs;
        }
        
        .alert-message {
          font-size: $font-size-sm;
          line-height: $line-height-relaxed;
        }
      }
      
      .alert-close {
        flex-shrink: 0;
        margin: -8px -8px -8px 0;
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
    
    // ========================================
    // ALERT TYPES
    // ========================================
    
    .alert-info {
      background-color: $info-light;
      border-left-color: $info;
      color: $info-dark;
      
      .alert-icon mat-icon {
        color: $info;
      }
      
      .alert-close {
        color: $info-dark;
      }
    }
    
    .alert-success {
      background-color: $success-light;
      border-left-color: $success;
      color: $success-dark;
      
      .alert-icon mat-icon {
        color: $success;
      }
      
      .alert-close {
        color: $success-dark;
      }
    }
    
    .alert-warning {
      background-color: $warning-light;
      border-left-color: $warning;
      color: $warning-dark;
      
      .alert-icon mat-icon {
        color: $warning-dark;
      }
      
      .alert-close {
        color: $warning-dark;
      }
    }
    
    .alert-danger {
      background-color: $danger-light;
      border-left-color: $danger;
      color: $danger-dark;
      
      .alert-icon mat-icon {
        color: $danger;
      }
      
      .alert-close {
        color: $danger-dark;
      }
    }
  `]
})
export class IrasAlert {
  @Input() type: IrasAlertType = 'info';
  @Input() title?: string;
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();
  
  dismissed_ = false;
  
  get alertClasses(): string {
    return `alert-${this.type}`;
  }
  
  get iconName(): string {
    const icons: Record<IrasAlertType, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      danger: 'error',
    };
    
    return icons[this.type];
  }
  
  dismiss(): void {
    this.dismissed_ = true;
    this.dismissed.emit();
  }
}

/**
 * IRAS Banner Component - For page-level notifications
 */
@Component({
  selector: 'iras-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (!dismissed) {
      <div [class]="bannerClasses" role="banner">
        <div class="banner-content">
          <mat-icon class="banner-icon">{{ iconName }}</mat-icon>
          <div class="banner-text">
            <ng-content></ng-content>
          </div>
        </div>
        @if (actionText) {
          <button mat-button class="banner-action" (click)="onAction()">
            {{ actionText }}
          </button>
        }
        @if (dismissible) {
          <button mat-icon-button class="banner-close" (click)="dismiss()" aria-label="Close banner">
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    @import '../styles/variables';
    
    :host {
      display: block;
    }
    
    div[role="banner"] {
      display: flex;
      align-items: center;
      gap: $spacing-lg;
      padding: $spacing-md $spacing-lg;
      min-height: 60px;
      
      .banner-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: $spacing-md;
        
        .banner-icon {
          flex-shrink: 0;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
        
        .banner-text {
          font-size: $font-size-base;
          line-height: $line-height-relaxed;
        }
      }
      
      .banner-action {
        flex-shrink: 0;
        font-weight: $font-weight-semibold;
      }
      
      .banner-close {
        flex-shrink: 0;
        margin-right: -8px;
      }
    }
    
    // ========================================
    // BANNER TYPES
    // ========================================
    
    .banner-info {
      background: linear-gradient(135deg, lighten($info-light, 3%) 0%, $info-light 100%);
      color: $info-dark;
      border-bottom: 1px solid $info;
      
      .banner-icon,
      .banner-action,
      .banner-close {
        color: $info;
      }
    }
    
    .banner-success {
      background: linear-gradient(135deg, lighten($success-light, 3%) 0%, $success-light 100%);
      color: $success-dark;
      border-bottom: 1px solid $success;
      
      .banner-icon,
      .banner-action,
      .banner-close {
        color: $success;
      }
    }
    
    .banner-warning {
      background: linear-gradient(135deg, lighten($warning-light, 3%) 0%, $warning-light 100%);
      color: $warning-dark;
      border-bottom: 1px solid $warning;
      
      .banner-icon,
      .banner-action,
      .banner-close {
        color: $warning-dark;
      }
    }
    
    .banner-danger {
      background: linear-gradient(135deg, lighten($danger-light, 3%) 0%, $danger-light 100%);
      color: $danger-dark;
      border-bottom: 1px solid $danger;
      
      .banner-icon,
      .banner-action,
      .banner-close {
        color: $danger;
      }
    }
  `]
})
export class IrasBanner {
  @Input() type: IrasAlertType = 'info';
  @Input() dismissible = false;
  @Input() actionText?: string;
  @Output() action = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
  
  dismissed_ = false;
  
  get bannerClasses(): string {
    return `banner-${this.type}`;
  }
  
  get iconName(): string {
    const icons: Record<IrasAlertType, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      danger: 'error',
    };
    
    return icons[this.type];
  }
  
  onAction(): void {
    this.action.emit();
  }
  
  dismiss(): void {
    this.dismissed_ = true;
    this.dismissed.emit();
  }
}
