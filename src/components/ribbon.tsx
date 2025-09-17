import React from 'react';
import { cn } from '~/lib/utils';

type RibbonPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface RibbonProps {
    label: string;
    position?: RibbonPosition;
    className?: string;
    children: React.ReactNode;
}

export function Ribbon({ label, position = 'top-left', className, children }: RibbonProps) {
    const base = 'absolute w-[150px] h-[150px] overflow-hidden';
    const spanBase =
        'absolute block w-[225px] py-[15px] bg-blue-500 text-white uppercase text-[14px] md:text-[18px] font-bold text-center shadow-md';

    const positions: Record<RibbonPosition, string> = {
        'top-left': '-top-2.5 -left-2.5',
        'top-right': '-top-2.5 -right-2.5',
        'bottom-left': '-bottom-2.5 -left-2.5',
        'bottom-right': '-bottom-2.5 -right-2.5',
    };

    const spans: Record<RibbonPosition, string> = {
        'top-left': 'right-[-25px] top-[30px] rotate-[-45deg]',
        'top-right': 'left-[-25px] top-[30px] rotate-[45deg]',
        'bottom-left': 'right-[-25px] bottom-[30px] rotate-[225deg]',
        'bottom-right': 'left-[-25px] bottom-[30px] rotate-[-225deg]',
    };

    return (
        <div className={cn('relative overflow-hidden rounded-xl bg-white shadow-lg', className)}>
            {/* Ribbon */}
            <div className={cn(base, positions[position], 'z-10')}>
                <span className={cn(spanBase, spans[position])}>{label}</span>
            </div>

            {/* Card content */}
            {children}
        </div>
    );
}
