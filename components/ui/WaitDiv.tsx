'use client'

import React from 'react';

const WaitDiv = React.forwardRef<HTMLDivElement, any>(({
                                                         className, children, ...props
                                                       }, ref) => {
  const [loading, setLoading] = React.useState(false);
  const handleClick = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000)
  };

  return (
    <div className={`relative ${className}`}
         onClick={handleClick}
         ref={ref}
         {...props}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center rounded-2xl bg-muted/50
              overflow-hidden transform transition-all shadow-md">
          <span className="text-white text-xl">加载中...</span>
        </div>
      )}
    </div>
  );
});
WaitDiv.displayName = "Div"

export default WaitDiv;