# Performance Optimization Guide

This document details all performance optimizations implemented in the Letters.

## Database Optimizations

### Indexes

All critical query paths are indexed for optimal performance:

#### letters table

```sql
-- Recipient queries (inbox view)
CREATE INDEX idx_letters_recipient ON letters(recipient_id, created_at);

-- Author queries (sent view)
CREATE INDEX idx_letters_author ON letters(author_id, created_at);

-- Read status queries (unread/read filtering)
CREATE INDEX idx_letters_read_status ON letters(recipient_id, is_read, created_at);
```

#### contacts table

```sql
-- User's contacts lookup
CREATE INDEX idx_contacts_user ON contacts(user_id);

-- Reverse lookup for contact validation
CREATE INDEX idx_contacts_contact_user ON contacts(contact_user_id);
```

#### user_profiles table

```sql
-- Login timestamp queries
CREATE INDEX idx_user_profiles_last_login ON user_profiles(last_login_at);
```

### Query Optimization

- **Selective field fetching**: Only fetch required fields using `.select()`
- **Composite indexes**: Multi-column indexes for complex queries
- **Constraint checks**: Database-level constraints prevent invalid data
- **Cascading deletes**: Automatic cleanup when users are deleted

### Row Level Security

RLS policies are optimized to use indexes:

- Policies filter on indexed columns (user_id, author_id, recipient_id)
- Minimal policy complexity for fast evaluation
- Separate policies for different operations (SELECT, INSERT, UPDATE, DELETE)

## Frontend Optimizations

### Code Splitting

Next.js App Router provides automatic code splitting:

- Each route is a separate chunk
- Shared components are intelligently bundled
- Dynamic imports for heavy components (if needed)

### Font Optimization

```typescript
// Font subsetting and preloading
const cinzel = Cinzel({
  subsets: ["latin"], // Only Latin characters
  weight: ["400", "700"], // Only needed weights
  display: "swap", // Show fallback while loading
  preload: true, // Preload critical font
  fallback: ["serif"], // Fallback font stack
});
```

Benefits:

- Reduced font file size (Latin subset only)
- Faster initial render (display: swap)
- Preloaded critical fonts
- Graceful fallback fonts

### Image Optimization

```javascript
// next.config.mjs
images: {
  formats: ['image/avif', 'image/webp'],  // Modern formats
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

Benefits:

- AVIF/WebP for smaller file sizes
- Responsive images for different devices
- Lazy loading by default
- Automatic optimization

### Asset Optimization

#### Papyrus Texture

- **Format**: SVG (vector, scalable)
- **Size**: ~500 bytes (tiny!)
- **Benefits**:
  - Scales to any resolution
  - No pixelation
  - Instant loading
  - No HTTP request overhead when inlined

### Build Optimizations

```javascript
// next.config.mjs
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],  // Keep error/warn logs
  } : false,
},
swcMinify: true,                 // Fast Rust-based minification
optimizeFonts: true,             // Optimize font loading
```

Benefits:

- Smaller bundle size (no console.logs)
- Faster minification (SWC vs Terser)
- Optimized font delivery

### Package Optimization

```javascript
experimental: {
  optimizePackageImports: [
    'framer-motion',
    'date-fns',
    '@supabase/supabase-js'
  ],
}
```

Benefits:

- Tree-shaking for large packages
- Smaller bundle size
- Faster initial load

## Runtime Optimizations

### React Optimizations

- **Strict Mode**: Enabled for better development experience
- **Error Boundaries**: Prevent full app crashes
- **Memoization**: Used where appropriate (React.memo, useMemo, useCallback)
- **Lazy Loading**: Components loaded on demand

### State Management

- **Context API**: Lightweight state management
- **Local state**: Component-level state for UI
- **Server state**: Supabase handles data fetching
- **Optimistic updates**: Immediate UI feedback

### Animation Performance

Framer Motion optimizations:

- **GPU acceleration**: Transform and opacity animations
- **Will-change hints**: Browser optimization hints
- **Reduced motion**: Respect user preferences
- **60fps target**: Smooth animations

```typescript
// Optimized animation variants
const pageTurnVariants = {
  enter: { rotateY: 90, opacity: 0, scale: 0.8 },
  center: { rotateY: 0, opacity: 1, scale: 1 },
  exit: { rotateY: -90, opacity: 0, scale: 0.8 },
};

const transition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96], // Custom easing
};
```

## Network Optimizations

### Compression

- **Brotli/Gzip**: Automatic compression by Vercel
- **Asset compression**: Minified CSS/JS
- **Response compression**: Enabled in next.config.mjs

### Caching

- **Static assets**: Cached indefinitely (hashed filenames)
- **API responses**: Supabase handles caching
- **Browser caching**: Appropriate cache headers
- **CDN caching**: Vercel Edge Network

### Prefetching

- **Link prefetching**: Next.js prefetches visible links
- **DNS prefetching**: Enabled for external domains
- **Font preloading**: Critical fonts preloaded

## Responsive Design Optimizations

### Mobile-First Approach

- **Touch targets**: Minimum 44x44px
- **Viewport optimization**: Proper meta tags
- **Reduced animations**: Lighter animations on mobile
- **Simplified layouts**: Mobile-optimized UI

### Breakpoint Strategy

```css
/* Tailwind breakpoints */
sm: 640px   // Mobile landscape
md: 768px   // Tablets
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Adaptive Loading

- **Conditional rendering**: Show/hide based on screen size
- **Responsive images**: Different sizes for different devices
- **Touch gestures**: Enhanced for mobile devices

## Monitoring & Metrics

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTFB (Time to First Byte)**: < 600ms

### Performance Budget

- **Initial bundle**: < 200KB (gzipped)
- **Total page weight**: < 1MB
- **Time to Interactive**: < 3s
- **API response time**: < 1s

### Monitoring Tools

- **Vercel Analytics**: Real user monitoring
- **Lighthouse**: Performance audits
- **Chrome DevTools**: Performance profiling
- **Network tab**: Request analysis

## Best Practices

### Development

1. **Profile before optimizing**: Use Chrome DevTools
2. **Measure impact**: Compare before/after metrics
3. **Avoid premature optimization**: Focus on bottlenecks
4. **Test on real devices**: Emulators aren't enough

### Production

1. **Monitor continuously**: Track Core Web Vitals
2. **Set up alerts**: Get notified of performance regressions
3. **Regular audits**: Run Lighthouse monthly
4. **User feedback**: Listen to user reports

### Code Quality

1. **Avoid unnecessary re-renders**: Use React.memo wisely
2. **Debounce expensive operations**: Filter inputs, etc.
3. **Lazy load heavy components**: Split code strategically
4. **Optimize images**: Use Next.js Image component

## Future Optimizations

### Potential Improvements

1. **Service Worker**: Offline support and caching
2. **Virtual scrolling**: For large letter lists
3. **Pagination**: Cursor-based pagination for letters
4. **Prefetching**: Prefetch next letter in sequence
5. **Image CDN**: Dedicated CDN for user-uploaded images
6. **Edge functions**: Move API logic to edge
7. **Database connection pooling**: For high traffic
8. **Redis caching**: Cache frequently accessed data

### When to Implement

- **Service Worker**: When offline support is needed
- **Virtual scrolling**: When users have 100+ letters
- **Pagination**: When initial load is slow
- **Prefetching**: When navigation is slow
- **Image CDN**: When users upload images
- **Edge functions**: When API latency is high
- **Connection pooling**: When database connections are exhausted
- **Redis caching**: When database queries are slow

## Performance Testing

### Local Testing

```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run analyze

# Start production server
npm start

# Run Lighthouse
lighthouse http://localhost:3000 --view
```

### Production Testing

1. Deploy to Vercel
2. Run Lighthouse on production URL
3. Check Vercel Analytics
4. Test on real devices
5. Monitor for 24 hours

### Load Testing

For high-traffic scenarios:

- Use tools like k6, Artillery, or JMeter
- Test database performance under load
- Monitor Supabase metrics
- Check Vercel function execution times

## Troubleshooting

### Slow Initial Load

**Symptoms**: High TTFB, slow FCP
**Solutions**:

- Check Vercel region (should be close to users)
- Verify database indexes
- Review Supabase query performance
- Check for blocking scripts

### Janky Animations

**Symptoms**: Low FPS, stuttering
**Solutions**:

- Use transform and opacity only
- Avoid animating layout properties
- Reduce animation complexity
- Check for JavaScript blocking

### Large Bundle Size

**Symptoms**: Slow download, high TTI
**Solutions**:

- Analyze bundle with `npm run analyze`
- Remove unused dependencies
- Use dynamic imports
- Optimize package imports

### Slow Database Queries

**Symptoms**: High API response times
**Solutions**:

- Check Supabase query performance
- Verify indexes are used
- Simplify complex queries
- Add missing indexes

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance)
- [Core Web Vitals](https://web.dev/vitals/)
