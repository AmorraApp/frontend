import PropTypes from 'prop-types';
import { Component } from "react";
import { warn } from 'common/utils';

// Error boundaries currently have to be classes.
class ErrorBoundary extends Component {

  state = { hasError: false, error: null };

  static propTypes = {
    fallback: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),

    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  }

  static getDerivedStateFromError (error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch (error, errorInfo) {
    // Log error to an error reporting service like Sentry
    warn({ error, errorInfo });
  }

  render () {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
