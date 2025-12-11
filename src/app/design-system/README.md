# IRAS Design System

A comprehensive design system for the IRAS Notice Designer application, built with Angular and inspired by Singapore government design principles and the IRAS brand guidelines.

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Getting Started](#getting-started)
4. [Design Tokens](#design-tokens)
5. [Components](#components)
6. [Accessibility](#accessibility)
7. [Contributing](#contributing)

## Overview

The IRAS Design System provides a unified set of design tokens, components, and patterns to ensure consistency across the Notice Designer application. It follows best practices for accessibility, usability, and maintainability.

### Key Features

- 🎨 **Consistent Branding** - Aligned with IRAS brand guidelines
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 📱 **Responsive** - Mobile-first approach
- 🔧 **Flexible** - Highly customizable components
- 📚 **Well-documented** - Comprehensive documentation and examples
- 🚀 **Performance** - Optimized for speed and efficiency

## Design Principles

### 1. Clarity
Information should be clear, concise, and easy to understand for all users.

### 2. Consistency
Visual elements, interactions, and terminology should be consistent throughout the application.

### 3. Efficiency
Users should be able to complete tasks quickly and with minimal effort.

### 4. Accessibility
The design should be inclusive and accessible to all users, regardless of their abilities.

### 5. Trust
Build user confidence through professional, reliable design that reflects the authority of IRAS.

## Getting Started

### Installation

The design system is already integrated into the Notice Designer application. To use components in your Angular files:

```typescript
import { IrasButton, IrasCard, IrasAlert } from './design-system';

@Component({
  selector: 'my-component',
  standalone: true,
  imports: [IrasButton, IrasCard, IrasAlert],
  // ...
})
```

### Using Design Tokens

#### In TypeScript

```typescript
import { Colors, Typography, Spacing } from './design-system/tokens/design-tokens';

const primaryColor = Colors.primary.main; // #2d7bb9
const fontSize = Typography.fontSize.base; // 1rem
const spacing = Spacing.md; // 1rem
```

#### In SCSS

```scss
@import '../design-system/styles/variables';

.my-component {
  color: $iras-primary;
  font-size: $font-size-base;
  padding: $spacing-md;
  border-radius: $radius-lg;
  box-shadow: $shadow-base;
}
```

## Design Tokens

Design tokens are the foundational building blocks of the design system. They define colors, typography, spacing, and other visual properties.

### Colors

#### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `$iras-primary` | #2d7bb9 | Primary actions, links, and key UI elements |
| `$iras-primary-dark` | #1e5a8a | Hover states for primary elements |
| `$iras-primary-light` | #4a9fd4 | Light backgrounds and accents |
| `$iras-teal` | #20b4af | Secondary actions and highlights |
| `$iras-sapphire` | #1173c0 | Complementary accents |

#### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `$success` | #28a745 | Success messages, confirmations |
| `$warning` | #ffc107 | Warnings, cautions |
| `$danger` | #dc3545 | Errors, destructive actions |
| `$info` | #17a2b8 | Informational messages |

#### Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| `$neutral-black` | #1a1a2e | Primary text |
| `$neutral-grey-700` | #5c5c6d | Secondary text |
| `$neutral-grey-500` | #a7a9ac | Disabled text, placeholders |
| `$neutral-grey-200` | #e8e8e8 | Borders, dividers |
| `$neutral-grey-100` | #f5f5f5 | Backgrounds |
| `$neutral-white` | #ffffff | White backgrounds |

### Typography

#### Font Family

```scss
$font-family-primary: 'Roboto', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
```

#### Font Sizes

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `$font-size-xs` | 0.75rem | 12px | Fine print, captions |
| `$font-size-sm` | 0.875rem | 14px | Small text, labels |
| `$font-size-base` | 1rem | 16px | Body text |
| `$font-size-lg` | 1.125rem | 18px | Subheadings |
| `$font-size-xl` | 1.25rem | 20px | Section headings |
| `$font-size-2xl` | 1.5rem | 24px | Page headings |
| `$font-size-3xl` | 1.875rem | 30px | Large headings |

#### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `$font-weight-regular` | 400 | Body text |
| `$font-weight-medium` | 500 | Buttons, labels |
| `$font-weight-semibold` | 600 | Subheadings |
| `$font-weight-bold` | 700 | Headings, emphasis |

### Spacing

Consistent spacing creates rhythm and visual hierarchy.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `$spacing-xs` | 0.25rem | 4px | Tight spacing |
| `$spacing-sm` | 0.5rem | 8px | Small gaps |
| `$spacing-md` | 1rem | 16px | Standard spacing |
| `$spacing-lg` | 1.5rem | 24px | Large spacing |
| `$spacing-xl` | 2rem | 32px | Extra large spacing |
| `$spacing-2xl` | 3rem | 48px | Section spacing |

### Border Radius

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `$radius-sm` | 0.25rem | 4px | Small elements |
| `$radius-base` | 0.5rem | 8px | Buttons, inputs |
| `$radius-lg` | 0.75rem | 12px | Cards, containers |
| `$radius-xl` | 1rem | 16px | Large containers |
| `$radius-full` | 9999px | - | Pills, circular elements |

### Shadows

| Token | Usage |
|-------|-------|
| `$shadow-sm` | Subtle elevation |
| `$shadow-base` | Default card shadow |
| `$shadow-md` | Elevated cards, dropdowns |
| `$shadow-lg` | Modals, popovers |

## Components

### IrasButton

A customizable button component with multiple variants and sizes.

#### Usage

```html
<!-- Primary Button -->
<iras-button variant="primary" size="medium">
  Save Notice
</iras-button>

<!-- Button with Icon -->
<iras-button variant="secondary" icon="save" iconPosition="left">
  Save
</iras-button>

<!-- Loading State -->
<iras-button variant="primary" [loading]="isLoading">
  Submit
</iras-button>

<!-- Full Width -->
<iras-button variant="primary" [fullWidth]="true">
  Continue
</iras-button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger' \| 'ghost'` | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `disabled` | `boolean` | `false` | Disable button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `icon` | `string` | - | Material icon name |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `fullWidth` | `boolean` | `false` | Full width button |
| `ariaLabel` | `string` | - | Accessibility label |

### IrasCard

A flexible card container for grouping related content.

#### Usage

```html
<!-- Basic Card -->
<iras-card variant="elevated">
  <iras-card-header>
    <h3>Card Title</h3>
    <p>Optional subtitle</p>
  </iras-card-header>
  <iras-card-content>
    Card content goes here
  </iras-card-content>
  <iras-card-actions align="right">
    <iras-button variant="ghost">Cancel</iras-button>
    <iras-button variant="primary">Save</iras-button>
  </iras-card-actions>
</iras-card>

<!-- Hoverable Card -->
<iras-card variant="outlined" [hoverable]="true" [clickable]="true">
  <!-- Content -->
</iras-card>
```

#### Props

**IrasCard**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined' \| 'filled'` | `'default'` | Card style variant |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Card padding |
| `hoverable` | `boolean` | `false` | Enable hover effect |
| `clickable` | `boolean` | `false` | Show clickable cursor |

**IrasCardActions**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Actions alignment |

### IrasAlert

Display important messages and notifications.

#### Usage

```html
<!-- Success Alert -->
<iras-alert type="success" [dismissible]="true">
  Your notice has been saved successfully!
</iras-alert>

<!-- Alert with Title -->
<iras-alert type="warning" title="Warning" [dismissible]="true">
  Please review the content before publishing.
</iras-alert>

<!-- Banner (Page-level) -->
<iras-banner type="info" actionText="Learn More" (action)="onLearnMore()">
  New features are now available in the Notice Designer.
</iras-banner>
```

#### Props

**IrasAlert**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Alert type |
| `title` | `string` | - | Optional title |
| `dismissible` | `boolean` | `false` | Show dismiss button |

**IrasBanner**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Banner type |
| `dismissible` | `boolean` | `false` | Show dismiss button |
| `actionText` | `string` | - | Action button text |

#### Events

| Event | Description |
|-------|-------------|
| `dismissed` | Emitted when alert is dismissed |
| `action` | Emitted when action button is clicked (banner only) |

### IrasBadge

Small status indicators for labels and counts.

#### Usage

```html
<!-- Status Badge -->
<iras-badge variant="success">Published</iras-badge>

<!-- Badge with Icon -->
<iras-badge variant="warning" icon="warning">Pending</iras-badge>

<!-- Dot Badge -->
<iras-badge variant="primary" [dot]="true">Active</iras-badge>

<!-- Pill -->
<iras-pill variant="primary">Tax Notice</iras-pill>

<!-- Removable Pill -->
<iras-pill variant="secondary" [removable]="true" (remove)="onRemove()">
  Filter Tag
</iras-pill>
```

#### Props

**IrasBadge**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Badge variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Badge size |
| `icon` | `string` | - | Material icon name |
| `dot` | `boolean` | `false` | Show status dot |

**IrasPill**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | Same as IrasBadge | `'neutral'` | Pill variant |
| `icon` | `string` | - | Material icon name |
| `removable` | `boolean` | `false` | Show remove button |
| `outlined` | `boolean` | `false` | Outlined style |

## Accessibility

The IRAS Design System is built with accessibility in mind, following WCAG 2.1 AA guidelines.

### Key Features

- **Keyboard Navigation** - All interactive elements are keyboard accessible
- **Focus Management** - Clear focus indicators for keyboard users
- **ARIA Labels** - Proper ARIA attributes for screen readers
- **Color Contrast** - Meets WCAG AA contrast requirements
- **Touch Targets** - Minimum 44px touch targets for mobile users
- **Reduced Motion** - Respects `prefers-reduced-motion` preference

### Best Practices

1. **Use Semantic HTML** - Use appropriate HTML elements (buttons, headings, etc.)
2. **Provide Alt Text** - Add descriptive alt text for images
3. **Label Form Inputs** - Ensure all inputs have associated labels
4. **Keyboard Testing** - Test all interactions with keyboard only
5. **Screen Reader Testing** - Test with screen readers like NVDA or JAWS

## Contributing

### Adding New Components

1. Create component file in `/src/app/design-system/components/`
2. Follow existing component patterns
3. Add SCSS using design tokens
4. Export component in `index.ts`
5. Document the component in this README

### Modifying Design Tokens

1. Update tokens in `/src/app/design-system/tokens/design-tokens.ts`
2. Update SCSS variables in `/src/app/design-system/styles/_variables.scss`
3. Test changes across all components
4. Update documentation

### Code Style

- Use TypeScript strict mode
- Follow Angular style guide
- Use SCSS variables from design tokens
- Write descriptive comments
- Include JSDoc for public APIs

## Support

For questions or issues with the design system:

1. Check this documentation
2. Review component examples
3. Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Maintained by:** IRAS Notice Designer Team
