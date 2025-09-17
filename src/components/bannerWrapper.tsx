export const BannerWrapper: React.FC<{ text: string; children: React.ReactNode; key?: string }> = ({
    text,
    children,
    key,
}) => (
    <div className='relative inline-block' key={key}>
        <div className='absolute top-0 left-0 rotate-[-15deg] bg-red-500 px-2 py-1 text-xs font-bold text-white'>
            {text}
        </div>
        {children}
    </div>
);
