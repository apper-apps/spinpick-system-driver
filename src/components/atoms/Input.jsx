const Input = ({ 
  label, 
  error, 
  className = '', 
  disabled = false,
  type = 'text',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 bg-surface-50 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;