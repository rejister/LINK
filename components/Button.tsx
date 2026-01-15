
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  baseColor?: string; // New prop for base color
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  baseColor = 'indigo', // Default to indigo if not provided
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  let variantSpecificStyles: string;
  switch (variant) {
    case 'primary':
      variantSpecificStyles = `bg-${baseColor}-600 text-white hover:bg-${baseColor}-700 focus:ring-${baseColor}-500`;
      break;
    case 'secondary':
      variantSpecificStyles = `bg-${baseColor}-200 text-${baseColor}-800 hover:bg-${baseColor}-300 focus:ring-${baseColor}-400`;
      break;
    case 'outline':
      variantSpecificStyles = `bg-transparent border border-${baseColor}-600 text-${baseColor}-600 hover:bg-${baseColor}-50 focus:ring-${baseColor}-500`;
      break;
    case 'ghost':
      variantSpecificStyles = `bg-transparent text-${baseColor}-700 hover:bg-${baseColor}-100 focus:ring-${baseColor}-200`;
      break;
    default:
      variantSpecificStyles = `bg-${baseColor}-600 text-white hover:bg-${baseColor}-700 focus:ring-${baseColor}-500`; // Fallback to primary
  }

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantSpecificStyles} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
