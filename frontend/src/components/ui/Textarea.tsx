import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = false, className = '', rows = 4, ...props }, ref) => {
    const baseStyles =
      'border border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-y';
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
        <textarea
          ref={ref}
          rows={rows}
          className={`${baseStyles} ${errorStyles} ${widthStyles} ${disabledStyles} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
