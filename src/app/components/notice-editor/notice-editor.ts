import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { Router } from '@angular/router';
import { NoticeService } from '../../services/notice';
import { NoticePreview } from '../notice-preview/notice-preview';

@Component({
  selector: 'app-notice-editor',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSliderModule,
    NoticePreview,
  ],
  templateUrl: './notice-editor.html',
  styleUrl: './notice-editor.scss',
})
export class NoticeEditor {
  title = signal('');
  content = signal('');
  backgroundColor = signal('#ffffff');
  textColor = signal('#000000');
  fontSize = signal(16);
  fontFamily = signal('Arial');
  borderStyle = signal('solid');
  borderColor = signal('#000000');
  borderWidth = signal(1);
  padding = signal(16);
  
  fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'];
  borderStyles = ['solid', 'dashed', 'dotted', 'double', 'none'];
  
  constructor(
    private noticeService: NoticeService,
    private router: Router
  ) {}
  
  saveNotice(): void {
    if (!this.title() || !this.content()) {
      return;
    }
    
    this.noticeService.addNotice({
      title: this.title(),
      content: this.content(),
      backgroundColor: this.backgroundColor(),
      textColor: this.textColor(),
      fontSize: this.fontSize(),
      fontFamily: this.fontFamily(),
      borderStyle: this.borderStyle(),
      borderColor: this.borderColor(),
      borderWidth: this.borderWidth(),
      padding: this.padding(),
    });
    
    this.router.navigate(['/']);
  }
  
  resetForm(): void {
    this.title.set('');
    this.content.set('');
    this.backgroundColor.set('#ffffff');
    this.textColor.set('#000000');
    this.fontSize.set(16);
    this.fontFamily.set('Arial');
    this.borderStyle.set('solid');
    this.borderColor.set('#000000');
    this.borderWidth.set(1);
    this.padding.set(16);
  }
}
