import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {

    this.setState({
      error,
      errorInfo
    });

    // Send error to logging service (optional)
    // logErrorToService(error, errorInfo);
  }

  copyErrorToClipboard = () => {
    const { error, errorInfo } = this.state;

    const errorText = `
التطبيق: منصة الدلفين التعليمية
المتصفح: ${navigator.userAgent}
التاريخ: ${new Date().toLocaleString('ar-SA')}

الخطأ:
${error?.toString() || 'Unknown error'}

تفاصيل الخطأ:
${error?.stack || 'No stack trace'}

معلومات إضافية:
${errorInfo?.componentStack || 'No component stack'}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => {
        this.setState({ copied: false });
      }, 3000);
    }).catch(err => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = errorText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.setState({ copied: true });
        setTimeout(() => {
          this.setState({ copied: false });
        }, 3000);
      } catch (err) {
        // Fallback copy failed
      }
      document.body.removeChild(textArea);
    });
  };

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, copied } = this.state;
      const isRTL = document.documentElement.dir === 'rtl';

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            fontFamily: 'Cairo, sans-serif',
            direction: isRTL ? 'rtl' : 'ltr',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '30px',
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                backgroundColor: '#fee',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc3545"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error Title */}
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#dc3545',
                marginBottom: '10px',
              }}
            >
              {isRTL ? 'عذراً، حدث خطأ غير متوقع' : 'Sorry, an unexpected error occurred'}
            </h1>

            {/* Error Message */}
            <p
              style={{
                fontSize: '16px',
                color: '#6c757d',
                marginBottom: '20px',
                lineHeight: '1.5',
              }}
            >
              {isRTL
                ? 'نعتذر عن الإزعاج. حدث خطأ أثناء تشغيل التطبيق. يرجى المحاولة مرة أخرى.'
                : 'We apologize for the inconvenience. An error occurred while running the application. Please try again.'}
            </p>

            {/* Error Details (Collapsible) */}
            <details
              style={{
                textAlign: isRTL ? 'right' : 'left',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#495057',
                  marginBottom: '10px',
                  userSelect: 'none',
                }}
              >
                {isRTL ? 'عرض تفاصيل الخطأ' : 'Show Error Details'}
              </summary>
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#dc3545',
                  maxHeight: '200px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                <strong>{isRTL ? 'الخطأ:' : 'Error:'}</strong>
                <br />
                {error?.toString()}
                <br />
                <br />
                <strong>{isRTL ? 'تفاصيل:' : 'Details:'}</strong>
                <br />
                {error?.stack}
              </div>
            </details>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                justifyContent: 'center',
              }}
            >
              {/* Reload Button */}
              <button
                onClick={this.reloadPage}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#0c2d40',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#185a80')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#0c2d40')}
              >
                {isRTL ? '🔄 إعادة تحميل الصفحة' : '🔄 Reload Page'}
              </button>

              {/* Copy Error Button */}
              <button
                onClick={this.copyErrorToClipboard}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: copied ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseOver={(e) => {
                  if (!copied) e.target.style.backgroundColor = '#5a6268';
                }}
                onMouseOut={(e) => {
                  if (!copied) e.target.style.backgroundColor = '#6c757d';
                }}
              >
                {copied
                  ? isRTL
                    ? '✅ تم النسخ'
                    : '✅ Copied'
                  : isRTL
                  ? '📋 نسخ تفاصيل الخطأ'
                  : '📋 Copy Error Details'}
              </button>
            </div>

            {/* Help Text */}
            <p
              style={{
                marginTop: '20px',
                fontSize: '14px',
                color: '#6c757d',
                lineHeight: '1.5',
              }}
            >
              {isRTL
                ? 'إذا استمرت المشكلة، يرجى نسخ تفاصيل الخطأ والتواصل مع فريق الدعم الفني.'
                : 'If the problem persists, please copy the error details and contact technical support.'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
