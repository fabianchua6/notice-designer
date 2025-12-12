import { Injectable, signal } from '@angular/core';
import { Notice } from '../models/notice.model';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private notices = signal<Notice[]>([]);
  
  constructor() {
    // Load from localStorage if available
    this.loadNotices();
  }
  
  getNotices() {
    return this.notices.asReadonly();
  }
  
  addNotice(notice: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>): Notice {
    const newNotice: Notice = {
      ...notice,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.notices.update(notices => [...notices, newNotice]);
    this.saveNotices();
    return newNotice;
  }
  
  updateNotice(id: string, updates: Partial<Notice>): void {
    this.notices.update(notices =>
      notices.map(notice =>
        notice.id === id
          ? { ...notice, ...updates, updatedAt: new Date() }
          : notice
      )
    );
    this.saveNotices();
  }
  
  deleteNotice(id: string): void {
    this.notices.update(notices => notices.filter(notice => notice.id !== id));
    this.saveNotices();
  }
  
  getNoticeById(id: string): Notice | undefined {
    return this.notices().find(notice => notice.id === id);
  }
  
  private generateId(): string {
    return `notice-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  
  private saveNotices(): void {
    try {
      localStorage.setItem('notices', JSON.stringify(this.notices()));
    } catch (error) {
      console.error('Failed to save notices to localStorage:', error);
    }
  }
  
  private loadNotices(): void {
    try {
      const stored = localStorage.getItem('notices');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const notices = parsed.map((notice: any) => ({
          ...notice,
          createdAt: new Date(notice.createdAt),
          updatedAt: new Date(notice.updatedAt),
        }));
        this.notices.set(notices);
      }
    } catch (error) {
      console.error('Failed to load notices from localStorage:', error);
    }
  }
}
