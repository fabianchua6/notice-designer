import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';
import { MasterTemplate, TEMPLATE_CATEGORIES, TemplateCategory } from '../../models/notice.model';

@Component({
  selector: 'app-template-manager',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatDialogModule,
  ],
  templateUrl: './template-manager.html',
  styleUrl: './template-manager.scss',
})
export class TemplateManager {
  categories = TEMPLATE_CATEGORIES;
  selectedCategory = signal<TemplateCategory | 'all'>('all');
  
  constructor(
    private templateService: TemplateService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  
  get templates() {
    return this.templateService.getTemplates();
  }
  
  get filteredTemplates(): MasterTemplate[] {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.templates();
    }
    return this.templates().filter(t => t.category === category);
  }
  
  selectCategory(category: TemplateCategory | 'all'): void {
    this.selectedCategory.set(category);
  }
  
  getCategoryLabel(category: TemplateCategory): string {
    return TEMPLATE_CATEGORIES.find(c => c.value === category)?.label || category;
  }
  
  getCategoryIcon(category: TemplateCategory): string {
    return TEMPLATE_CATEGORIES.find(c => c.value === category)?.icon || 'description';
  }
  
  useTemplate(template: MasterTemplate): void {
    // Create a duplicate notice from this template for editing
    this.router.navigate(['/editor'], { 
      queryParams: { templateId: template.id } 
    });
  }
  
  editTemplate(template: MasterTemplate): void {
    // Edit the template directly (opens in template edit mode)
    this.router.navigate(['/editor'], { 
      queryParams: { templateId: template.id, editTemplate: 'true' } 
    });
  }
  
  deleteTemplate(template: MasterTemplate): void {
    if (!template.isSystem && confirm(`Are you sure you want to delete "${template.name}"?`)) {
      this.templateService.deleteTemplate(template.id);
    }
  }
  
  duplicateTemplate(template: MasterTemplate): void {
    this.templateService.addTemplate({
      name: `${template.name} (Copy)`,
      description: template.description,
      category: template.category,
      content: template.content,
    });
  }
  
  createNewTemplate(): void {
    this.router.navigate(['/editor'], { 
      queryParams: { newTemplate: 'true' } 
    });
  }
}
