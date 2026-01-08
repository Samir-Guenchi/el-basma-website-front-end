# El Basma Boutique - E-commerce Website

A modern, responsive e-commerce website for traditional Algerian clothing (djellabas, caftans, abayas). Built with React and optimized for performance, accessibility, and security.

Live Demo: https://el-basma-website.vercel.app

## Features

### Core Functionality
- Product catalog with category filtering
- Real-time delivery price lookup by wilaya
- Order management with multi-item support
- Color and size selection per item
- Responsive design for all devices

### Internationalization
- Arabic (Standard)
- Algerian Dialect (Darija)
- French
- English

### Performance Optimizations
- Code splitting with React.lazy()
- Optimized images via Cloudinary CDN
- LazyMotion for reduced Framer Motion bundle
- WebP images with JPG fallback
- Lighthouse Performance Score: 90+

### Accessibility (WCAG AA)
- Color contrast compliance
- Unique aria-labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Accessibility Score: 95+

### Security Features
- XSS prevention with input sanitization
- Rate limiting for form submissions
- Honeypot fields for bot detection
- Browser-based bot detection
- Secure local storage wrapper

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- i18next (internationalization)
- React Hot Toast
- React Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── core/               # Core infrastructure
│   ├── config/         # Application configuration
│   └── api/            # HTTP client
├── features/           # Feature modules
│   ├── products/       # Product domain
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom hooks
│   │   ├── utils/      # Helper functions
│   │   └── types/      # TypeScript types
│   └── orders/         # Order domain
│       ├── services/
│       ├── hooks/
│       └── types/
├── shared/             # Shared utilities
│   ├── utils/          # Validation, security
│   ├── hooks/          # Common hooks
│   └── types/          # Shared types
└── i18n.js             # Translation configuration
```

## Installation

```bash
# Clone the repository
git clone https://github.com/Samir-Guenchi/el-basma-website.git

# Navigate to project directory
cd el-basma-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_CLOUDINARY_CLOUD=your_cloudinary_cloud_name
```

## API Integration

The website connects to a backend API for:
- Product listing and details
- Order creation
- Delivery price lookup

API endpoints are configured in `src/core/config/app.config.ts`.

## Form Validation

Custom validation system with:
- Algerian phone number validation (05/06/07 formats)
- Arabic, French, and English name support
- Real-time field validation on blur
- Animated error messages
- Input sanitization

## Security Implementation

### Input Sanitization
All user inputs are sanitized to prevent XSS attacks by removing:
- HTML tags
- JavaScript protocols
- Event handlers
- Data URIs

### Rate Limiting
Order submissions are limited to 3 attempts per minute per client to prevent abuse.

### Bot Detection
- Honeypot fields that bots typically fill
- Browser indicator checks
- Client fingerprinting for rate limiting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

- Developer: Samir Guenchi
- Email: samir.guenchi@ensia.edu.dz
- Location: Maghnia, Algeria
