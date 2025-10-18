interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4f3ee' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" style={{ borderTopColor: '#3a5a40', borderBottomColor: '#3a5a40' }}></div>
        <p className="text-xl text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};
