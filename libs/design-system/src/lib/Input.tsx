import * as React from 'react';
import { cn } from './utils/helpers';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, id, onChange, value, placeholder, ...props }, ref) => {
    return (
      <input
        {...props}
        dir="auto"
        id={id}
        onChange={onChange}
        title={props.disabled ? 'Readonly. Cannot edit.' : props.title}
        placeholder={placeholder}
        value={value}
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input  px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
