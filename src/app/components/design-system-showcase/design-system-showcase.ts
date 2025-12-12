import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IrasButton, 
  IrasCard, 
  IrasCardHeader, 
  IrasCardContent, 
  IrasCardActions,
  IrasAlert,
  IrasBanner,
  IrasBadge,
  IrasPill
} from '../../design-system';

/**
 * Design System Showcase Component
 * 
 * Displays all design system components for reference and testing
 */
@Component({
  selector: 'app-design-system-showcase',
  standalone: true,
  imports: [
    CommonModule,
    IrasButton,
    IrasCard,
    IrasCardHeader,
    IrasCardContent,
    IrasCardActions,
    IrasAlert,
    IrasBanner,
    IrasBadge,
    IrasPill,
  ],
  templateUrl: './design-system-showcase.html',
  styleUrl: './design-system-showcase.scss',
})
export class DesignSystemShowcase {
  showAlert = true;
  showBanner = true;
  loadingButton = false;
  
  simulateLoading(): void {
    this.loadingButton = true;
    setTimeout(() => {
      this.loadingButton = false;
    }, 2000);
  }
  
  onBannerAction(): void {
    // Banner action handler - implement as needed
  }
  
  onPillRemove(): void {
    // Pill remove handler - implement as needed
  }
}
