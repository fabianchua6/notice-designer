# IRAS Notice Designer

A professional PDF template designer for creating IRAS (Inland Revenue Authority of Singapore) tax notices. Built with Angular 21, Angular Material, and TinyMCE.

![Angular](https://img.shields.io/badge/Angular-21-red) ![TinyMCE](https://img.shields.io/badge/TinyMCE-8-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen)

## 🚀 Features

### Core Features
- **WYSIWYG Editor** - TinyMCE 8-powered rich text editor with full formatting capabilities
- **Live A4 Preview** - Real-time document preview with zoom controls and pagination
- **Template Variables** - Dynamic content insertion with 50+ predefined IRAS variables
- **List Variables** - Loop support with `{{#each}}...{{/each}}` syntax for repeating data
- **Conditional Logic** - `{{#if}}...{{/if}}` syntax for conditional content
- **Master Templates** - Pre-built IRAS notice templates ready to use
- **Print/PDF Export** - Professional PDF generation via browser print

### Template Management
- Browse and filter templates by category
- System templates (protected) and custom user templates
- Duplicate templates to create variations
- Use templates to quickly create new notices

### IRAS Notice Types Included
1. **Income Tax - Notice of Assessment (NOA)** - Tax bill with income/deductions summary
2. **Pre-Filled Income and Deduction Statement** - Detailed income breakdown
3. **No-Filing Service (NFS) Notification** - NFS eligibility letter
4. **Payment Acknowledgment** - Payment confirmation notice
5. **General IRAS Notice** - Blank letterhead template

### Variable Categories
| Category | Example Variables |
|----------|------------------|
| Taxpayer | `{{taxpayer.name}}`, `{{taxpayer.taxRef}}`, `{{taxpayer.address}}` |
| Assessment | `{{assessment.year}}`, `{{assessment.amount}}`, `{{assessment.dueDate}}` |
| Income | `{{income.total}}`, `{{income.employment}}`, `{{income.chargeable}}` |
| Deductions | `{{deductions.total}}`, `{{deductions.donations}}`, `{{deductions.reliefs}}` |
| Reliefs | `{{relief.earnedIncome}}`, `{{relief.cpf}}`, `{{relief.nsman}}` |
| Payment | `{{payment.amount}}`, `{{payment.dueDate}}`, `{{payment.ackNumber}}` |

## 🛠️ Tech Stack

- **Framework**: Angular 21 (Standalone Components with Signals)
- **UI Library**: Angular Material (Indigo-Pink theme with IRAS overrides)
- **Editor**: TinyMCE 8 (Self-hosted, LGPL licensed - no API key required)
- **Templating**: Custom Handlebars-like variable processor (lightweight, no dependencies)
- **Styling**: SCSS with CSS Variables
- **State**: Angular Signals + localStorage persistence
- **Build**: Angular CLI with esbuild

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/fabianchua6/notice-designer.git
cd notice-designer

# Install dependencies
npm install

# Start development server
ng serve
```

Open `http://localhost:4200` in your browser.

## 🎨 IRAS Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#2d7bb9` | Headers, buttons, links |
| Teal | `#20b4af` | Accents, gradients |
| Sapphire | `#1173c0` | Gradient endpoints |
| Dark | `#1a1a2e` | Text, headings |

## 📁 Project Structure

```
src/app/
├── components/
│   ├── notice-editor/      # Main WYSIWYG editor with preview
│   ├── notice-list/        # Dashboard with notice grid
│   ├── notice-preview/     # Standalone A4 preview component
│   ├── notice-comparison/  # Side-by-side notice comparison
│   └── template-manager/   # Master template management
├── models/
│   └── notice.model.ts     # Notice, Template, Variable interfaces
├── services/
│   ├── notice.ts           # Notice CRUD with localStorage
│   └── template.service.ts # Template management service
├── app.ts                  # Root component with sidenav
├── app.routes.ts           # Application routes
└── app.config.ts           # App configuration
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm start           # or ng serve

# Build for production
npm run build       # or ng build

# Run tests
npm test            # or ng test

# Lint code
npm run lint        # if configured
```

### Key Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | NoticeList | Dashboard with all notices |
| `/editor` | NoticeEditor | Create new notice |
| `/editor/:id` | NoticeEditor | Edit existing notice |
| `/editor?templateId=X&editTemplate=true` | NoticeEditor | Edit master template |
| `/templates` | TemplateManager | Browse master templates |
| `/compare/:id1/:id2` | NoticeComparison | Compare two notices |
| `/design-system` | DesignSystemShowcase | UI components demo |

## 🚧 Roadmap / TODO

### Completed ✅
- [x] Template variable system with Handlebars-like syntax
- [x] List/loop variable support (`{{#each}}`)
- [x] Conditional variable support (`{{#if}}`)
- [x] Separate template edit vs notice creation workflows
- [x] Material Design template cards
- [x] Standard A4 margins (20mm)

### Planned Features
- [ ] **Data Binding UI** - Upload JSON/CSV test data for preview
- [ ] **Approval Workflow** - Draft → Review → Approved states
- [ ] **Batch Processing** - Generate notices in bulk from data files
- [ ] **Template Import/Export** - JSON-based template sharing
- [ ] **Version History** - Track changes to notices and templates
- [ ] **Image Upload** - Embed custom images and logos
- [ ] **PDF Direct Export** - Generate PDF without browser print dialog

### Known Issues
- Preview may not perfectly match TinyMCE for complex layouts
- Page breaks need manual insertion via editor

## 📝 License

This project is licensed under the MIT License.

### Third-Party Licenses
- **TinyMCE**: LGPL 2.1 (self-hosted, no API key required)
- **Angular Material**: MIT
- **Angular**: MIT
- **JsBarcode**: MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/fabianchua6/notice-designer/issues) page.

---

**Built with ❤️ for IRAS Notice Management**

**Version 2.0.0** | © 2025 IRAS
