const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false, className = ''}) => {
  const sizeClasses = { sm: 'spinner-border-sm', md: '', lg: 'spinner-border-lg'};
  const spinner = (
    <div className={`d-flex align-items-center ${className}`}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && ( <span className="ms-2 text-muted">{text}</span> )}
    </div>
  );

  if (fullScreen) { return (<div className="d-flex justify-content-center align-items-center min-vh-100">{spinner}</div>); }
  return spinner;
};

export default LoadingSpinner;