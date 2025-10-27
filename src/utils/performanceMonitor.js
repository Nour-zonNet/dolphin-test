// Performance monitoring utility
export const performanceMonitor = {
  // Measure Core Web Vitals
  measureWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // FID measurement
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },

  // Measure bundle loading times
  measureBundlePerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    // Measure resource loading
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));
  },

  // Monitor memory usage
  monitorMemory() {
    if ('memory' in performance) {
      const memory = performance.memory;
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
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  performanceMonitor.init();
}
