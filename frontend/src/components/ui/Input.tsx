import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles =
      'border border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors';
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = props.disabled
      ? 'bg-gray-100 cursor-not-allowed'
      : 'bg-white';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${widthStyles} ${disabledStyles} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
