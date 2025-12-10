import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../services/notice';
import { NoticePreview } from '../notice-preview/notice-preview';

@Component({
  selector: 'app-notice-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    NoticePreview,
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
