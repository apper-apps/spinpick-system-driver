const Text = ({ 
  children, 
  variant = 'body', 
  size = 'base', 
  weight = 'normal',
  className = '', 
  as: Component = 'p',
  ...props 
}) => {
  const variants = {
    display: 'font-display text-surface-900',
    heading: 'font-heading text-surface-900',
    body: 'font-sans text-surface-700',
    caption: 'font-sans text-surface-500'
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const textClasses = `${variants[variant]} ${sizes[size]} ${weights[weight]} ${className}`;

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
};

export default Text;