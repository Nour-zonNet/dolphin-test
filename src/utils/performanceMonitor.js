/* eslint-disable no-undef */
// Performance monitoring utility
export const performanceMonitor = {
  // Measure Core Web Vitals
  measureWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((_entryList) => {
      const entries = _entryList.getEntries();
      // const lastEntry = entries[entries.length - 1];
      // Track LCP
      entries.forEach(() => {
        // Track performance
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(() => {
        // FID measurement
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    // let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          // clsValue += entry.value;
          // Track layout shift
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },

  // Measure bundle loading times
  measureBundlePerformance() {
    // const navigation = performance.getEntriesByType('navigation')[0];
    
    // Measure resource loading
    const resources = performance.getEntriesByType('resource');
    // const jsResources = resources.filter(r => r.name.includes('.js'));
    // const cssResources = resources.filter(r => r.name.includes('.css'));
    // Track resource performance
    resources.forEach(() => {
      // Track resources
    });
  },

  // Monitor memory usage
  monitorMemory() {
    if ('memory' in performance) {
      // const memory = performance.memory;
      // Memory monitoring
    }
  },

  // Initialize all monitoring
  init() {
    if (process.env.NODE_ENV === 'development') {
      this.measureWebVitals();
      this.measureBundlePerformance();
      this.monitorMemory();
      
      // Log performance metrics every 30 seconds
      setInterval(() => {
        this.monitorMemory();
      }, 30000);
    }
  }
};

// Auto-initialize in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  performanceMonitor.init();
}
