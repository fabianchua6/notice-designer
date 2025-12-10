import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notice-preview',
  imports: [CommonModule],
  templateUrl: './notice-preview.html',
  styleUrl: './notice-preview.scss',
})
export class NoticePreview {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() backgroundColor: string = '#ffffff';
  @Input() textColor: string = '#000000';
  @Input() fontSize: number = 16;
  @Input() fontFamily: string = 'Arial';
  @Input() borderStyle: string = 'solid';
  @Input() borderColor: string = '#000000';
  @Input() borderWidth: number = 1;
  @Input() padding: number = 16;
  
  getNoticeStyle() {
    return {
      'background-color': this.backgroundColor,
      'color': this.textColor,
      'font-size': `${this.fontSize}px`,
      'font-family': this.fontFamily,
      'border-style': this.borderStyle,
      'border-color': this.borderColor,
      'border-width': `${this.borderWidth}px`,
      'padding': `${this.padding}px`
    };
  }
}
