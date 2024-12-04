import React, { Component } from "react";

import { ErrorModal } from "./modals";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error);
        console.error("Error info:", errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorModal
                    onClose={() => this.setState({ hasError: false })}
                />
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
