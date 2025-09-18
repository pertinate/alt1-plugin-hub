import type { ReactNode } from 'react';

function Spinner() {
    return <div className='border-muted-foreground h-6 w-6 animate-spin rounded-full border-2 border-t-transparent' />;
}

interface LoadingWrapperProps {
    loading: boolean;
    children: ReactNode;
}

export function Loading({ loading, children }: LoadingWrapperProps) {
    return (
        <div className='relative'>
            {/* Your normal content */}
            {children}

            {loading && (
                <div className='bg-background/50 absolute inset-0 flex items-center justify-center'>
                    <Spinner />
                </div>
            )}
        </div>
    );
}
