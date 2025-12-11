import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoticeService } from '../../services/notice';
import { Notice } from '../../models/notice.model';
import { NoticePreview } from '../notice-preview/notice-preview';

@Component({
  selector: 'app-notice-comparison',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NoticePreview,
  ],
  templateUrl: './notice-comparison.html',
  styleUrl: './notice-comparison.scss',
})
export class NoticeComparison implements OnInit {
  notice1 = signal<Notice | undefined>(undefined);
  notice2 = signal<Notice | undefined>(undefined);
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticeService: NoticeService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id1 = params['id1'];
      const id2 = params['id2'];
      
      if (id1 && id2) {
        this.notice1.set(this.noticeService.getNoticeById(id1));
        this.notice2.set(this.noticeService.getNoticeById(id2));
        
        if (!this.notice1() || !this.notice2()) {
          this.router.navigate(['/']);
        }
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }
  
  getDifferences(): string[] {
    const n1 = this.notice1();
    const n2 = this.notice2();
    
    if (!n1 || !n2) return [];
    
    const differences: string[] = [];
    
    if (n1.backgroundColor !== n2.backgroundColor) {
      differences.push('Background color differs');
    }
    if (n1.textColor !== n2.textColor) {
      differences.push('Text color differs');
    }
    if (n1.fontSize !== n2.fontSize) {
      differences.push(`Font size differs (${n1.fontSize}px vs ${n2.fontSize}px)`);
    }
    if (n1.fontFamily !== n2.fontFamily) {
      differences.push(`Font family differs (${n1.fontFamily} vs ${n2.fontFamily})`);
    }
    if (n1.borderStyle !== n2.borderStyle) {
      differences.push('Border style differs');
    }
    if (n1.borderColor !== n2.borderColor) {
      differences.push('Border color differs');
    }
    if (n1.borderWidth !== n2.borderWidth) {
      differences.push(`Border width differs (${n1.borderWidth}px vs ${n2.borderWidth}px)`);
    }
    if (n1.padding !== n2.padding) {
      differences.push(`Padding differs (${n1.padding}px vs ${n2.padding}px)`);
    }
    
    return differences;
  }
}
