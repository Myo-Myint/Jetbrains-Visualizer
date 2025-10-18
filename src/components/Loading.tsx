interface LoadingProps {
  message?: string;
  progress?: number; // 0 to 100
}

export const Loading = ({ message = 'Loading...', progress }: LoadingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4f3ee' }}>
      <div className="text-center max-w-md w-full px-4">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-transparent transition-transform duration-300"
              style={{ 
                borderColor: '#3a5a40',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }}
            ></div>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: '#3a5a40'
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">{Math.round(progress)}%</p>
          </div>
        )}
        
        <p className="text-xl text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};
