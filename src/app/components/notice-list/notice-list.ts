import { Component, computed } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../services/notice';
import { Notice } from '../../models/notice.model';
import { IrasButton, IrasCard, IrasCardHeader, IrasCardContent, IrasCardActions, IrasBadge } from '../../design-system';

@Component({
  selector: 'app-notice-list',
  imports: [
    CommonModule,
    SlicePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule,
    IrasButton,
    IrasCard,
    IrasCardHeader,
    IrasCardContent,
    IrasCardActions,
    IrasBadge,
  ],
  templateUrl: './notice-list.html',
  styleUrl: './notice-list.scss',
})
export class NoticeList {
  selectedNotices = new Set<string>();
  
  canCompare = computed(() => this.selectedNotices.size === 2);
  
  constructor(
    private noticeService: NoticeService,
    private router: Router
  ) {}
  
  get notices() {
    return this.noticeService.getNotices();
  }
  
  toggleSelection(noticeId: string): void {
    if (this.selectedNotices.has(noticeId)) {
      this.selectedNotices.delete(noticeId);
    } else {
      this.selectedNotices.add(noticeId);
    }
  }
  
  isSelected(noticeId: string): boolean {
    return this.selectedNotices.has(noticeId);
  }
  
  deleteNotice(noticeId: string): void {
    if (confirm('Are you sure you want to delete this notice?')) {
      this.noticeService.deleteNotice(noticeId);
      this.selectedNotices.delete(noticeId);
    }
  }
  
  duplicateNotice(notice: Notice): void {
    this.noticeService.addNotice({
      title: `${notice.title} (Copy)`,
      content: notice.content,
      backgroundColor: notice.backgroundColor,
      textColor: notice.textColor,
      fontSize: notice.fontSize,
      fontFamily: notice.fontFamily,
      borderStyle: notice.borderStyle,
      borderColor: notice.borderColor,
      borderWidth: notice.borderWidth,
      padding: notice.padding,
    });
  }
  
  compareSelected(): void {
    if (this.selectedNotices.size === 2) {
      const ids = Array.from(this.selectedNotices);
      this.router.navigate(['/compare', ids[0], ids[1]]);
    }
  }
  
  createNew(): void {
    this.router.navigate(['/editor']);
  }
}
