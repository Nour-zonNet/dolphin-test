import React, { Component } from 'react';
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
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Log additional context
    if (error.message?.includes('Activity')) {
      console.error('Activity-related error detected. This may be related to react-konva and React 19 compatibility.');
    }

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
Application: منصة الدلفين التعليمية
Browser: ${navigator.userAgent}
Date: ${new Date().toLocaleString('ar-SA')}

Error:
${error?.toString() || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace'}

Component Stack:
${errorInfo?.componentStack || 'No component stack'}

React Version: ${React.version}
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
          onCopyError={this.copyErrorToClipboard}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          copied={this.state.copied}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
