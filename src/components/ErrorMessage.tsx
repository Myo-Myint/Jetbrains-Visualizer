interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="error">
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  );
};
