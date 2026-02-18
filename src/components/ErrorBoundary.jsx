import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                    <p className="text-slate-400 mb-6 max-w-md">
                        The application encountered an unexpected error.
                    </p>
                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 text-left max-w-lg w-full overflow-auto max-h-60 mb-6">
                        <p className="text-red-400 font-mono text-xs mb-2">{this.state.error && this.state.error.toString()}</p>
                        <pre className="text-slate-500 font-mono text-[10px]">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
