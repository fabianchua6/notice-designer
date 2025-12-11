import { Injectable } from '@angular/core';

/**
 * VariableProcessorService
 * 
 * Processes template variables including:
 * - Simple variables: {{variable.name}}
 * - List/loop variables: {{#each items}}...{{/each}}
 * - Conditionals: {{#if condition}}...{{/if}}
 * 
 * Usage:
 * const template = `
 *   <p>Hello {{taxpayer.name}}</p>
 *   {{#each incomeItems}}
 *   <tr>
 *     <td>{{source}}</td>
 *     <td>{{amount}}</td>
 *   </tr>
 *   {{/each}}
 * `;
 * 
 * const data = {
 *   taxpayer: { name: 'John' },
 *   incomeItems: [
 *     { source: 'Employment', amount: '30,000' },
 *     { source: 'Rental', amount: '5,000' }
 *   ]
 * };
 * 
 * const result = processor.processTemplate(template, data);
 */
@Injectable({
  providedIn: 'root'
})
export class VariableProcessorService {
  
  /**
   * Process a template with the given data context
   */
  processTemplate(template: string, data: Record<string, any>): string {
    if (!template) return '';
    
    let result = template;
    
    // Step 1: Process {{#each}}...{{/each}} loops
    result = this.processLoops(result, data);
    
    // Step 2: Process {{#if}}...{{/if}} conditionals
    result = this.processConditionals(result, data);
    
    // Step 3: Process simple {{variable}} replacements
    result = this.processSimpleVariables(result, data);
    
    return result;
  }
  
  /**
   * Process {{#each array}}...{{/each}} loops
   * Supports nested properties like {{#each income.items}}
   */
  private processLoops(template: string, data: Record<string, any>): string {
    // Match {{#each arrayName}}...{{/each}}
    const eachRegex = /\{\{#each\s+([a-zA-Z0-9_.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    
    return template.replace(eachRegex, (match, arrayPath, innerTemplate) => {
      const array = this.getNestedValue(data, arrayPath);
      
      if (!Array.isArray(array)) {
        console.warn(`VariableProcessor: "${arrayPath}" is not an array`);
        return `<!-- ${arrayPath} is not an array -->`;
      }
      
      // Process each item in the array
      return array.map((item, index) => {
        // Create context for this iteration
        const itemContext = {
          ...data,
          ...item,
          '@index': index,
          '@first': index === 0,
          '@last': index === array.length - 1,
          'this': item
        };
        
        // Process the inner template with item context
        return this.processSimpleVariables(innerTemplate, itemContext);
      }).join('');
    });
  }
  
  /**
   * Process {{#if condition}}...{{/if}} conditionals
   * Supports {{#if variable}} and {{#if variable.nested}}
   * Also supports {{else}} blocks
   */
  private processConditionals(template: string, data: Record<string, any>): string {
    // Match {{#if condition}}...{{else}}...{{/if}} or {{#if condition}}...{{/if}}
    const ifElseRegex = /\{\{#if\s+([a-zA-Z0-9_.]+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g;
    const ifOnlyRegex = /\{\{#if\s+([a-zA-Z0-9_.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    
    // First process if-else blocks
    let result = template.replace(ifElseRegex, (match, conditionPath, ifContent, elseContent) => {
      const value = this.getNestedValue(data, conditionPath);
      return this.isTruthy(value) ? ifContent : elseContent;
    });
    
    // Then process if-only blocks
    result = result.replace(ifOnlyRegex, (match, conditionPath, ifContent) => {
      const value = this.getNestedValue(data, conditionPath);
      return this.isTruthy(value) ? ifContent : '';
    });
    
    return result;
  }
  
  /**
   * Process simple {{variable}} and {{nested.variable}} replacements
   */
  private processSimpleVariables(template: string, data: Record<string, any>): string {
    // Match {{variable}} or {{nested.variable}} but not {{#each}} or {{/each}}
    const variableRegex = /\{\{(?!#|\/|else)([a-zA-Z0-9_.@]+)\}\}/g;
    
    return template.replace(variableRegex, (match, variablePath) => {
      const value = this.getNestedValue(data, variablePath);
      
      if (value === undefined || value === null) {
        // Return the original placeholder if value not found
        return match;
      }
      
      return String(value);
    });
  }
  
  /**
   * Get a nested value from an object using dot notation
   * e.g., getNestedValue({ a: { b: 'value' } }, 'a.b') => 'value'
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    if (!path) return undefined;
    
    const parts = path.split('.');
    let current: any = obj;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }
  
  /**
   * Check if a value is "truthy" for conditionals
   */
  private isTruthy(value: any): boolean {
    if (value === undefined || value === null || value === false || value === '') {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  }
  
  /**
   * Extract all variable keys from a template
   * Useful for showing what variables are available/used
   */
  extractVariables(template: string): { simple: string[], loops: string[], conditionals: string[] } {
    const simple: string[] = [];
    const loops: string[] = [];
    const conditionals: string[] = [];
    
    // Extract loop variables
    const eachRegex = /\{\{#each\s+([a-zA-Z0-9_.]+)\}\}/g;
    let match;
    while ((match = eachRegex.exec(template)) !== null) {
      loops.push(match[1]);
    }
    
    // Extract conditional variables
    const ifRegex = /\{\{#if\s+([a-zA-Z0-9_.]+)\}\}/g;
    while ((match = ifRegex.exec(template)) !== null) {
      conditionals.push(match[1]);
    }
    
    // Extract simple variables (excluding loop/conditional markers)
    const variableRegex = /\{\{(?!#|\/|else)([a-zA-Z0-9_.@]+)\}\}/g;
    while ((match = variableRegex.exec(template)) !== null) {
      if (!simple.includes(match[1])) {
        simple.push(match[1]);
      }
    }
    
    return { simple, loops, conditionals };
  }
  
  /**
   * Validate a template for syntax errors
   */
  validateTemplate(template: string): { valid: boolean, errors: string[] } {
    const errors: string[] = [];
    
    // Check for unmatched {{#each}}
    const eachOpens = (template.match(/\{\{#each\s+/g) || []).length;
    const eachCloses = (template.match(/\{\{\/each\}\}/g) || []).length;
    if (eachOpens !== eachCloses) {
      errors.push(`Unmatched {{#each}} blocks: ${eachOpens} opens, ${eachCloses} closes`);
    }
    
    // Check for unmatched {{#if}}
    const ifOpens = (template.match(/\{\{#if\s+/g) || []).length;
    const ifCloses = (template.match(/\{\{\/if\}\}/g) || []).length;
    if (ifOpens !== ifCloses) {
      errors.push(`Unmatched {{#if}} blocks: ${ifOpens} opens, ${ifCloses} closes`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
