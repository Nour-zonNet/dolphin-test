import { Component } from 'react';
import GeneralError from './GeneralError';

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
    }).catch(_err => {
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
      } catch (_err2) {
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
      return (
        <GeneralError 
          onRetry={this.reloadPage}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
