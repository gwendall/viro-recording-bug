import React from "react";

export default class ErrorBoundary extends React.Component<any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.log('ErrorBoundary caught an error:', error, info);
    }

    render() {
        // @ts-ignore
        if (this.state.hasError) {
            // @ts-ignore
            return this.props.fallback;
        }

        // @ts-ignore
        return this.props.children;
    }
}