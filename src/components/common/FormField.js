const FormField = ({ id, name, type = 'text', label, placeholder, value, onChange, required = false, disabled = false, autoComplete, minLength, maxLength, error, className = '', ...props }) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && ( <label htmlFor={id} className="form-label"> {label} {required && <span className="text-danger ms-1">*</span>} </label> )}
      
      <input type={type} className={`form-control ${error ? 'is-invalid' : ''}`} id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} disabled={disabled} autoComplete={autoComplete} minLength={minLength} maxLength={maxLength} {...props} />
      
      {error && ( <div className="invalid-feedback d-block"> {error} </div> )}
    </div>
  );
};

export default FormField;