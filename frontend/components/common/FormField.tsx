import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type CommonProps = {
  label: string;
  name: string;
  error?: string;
  containerClassName?: string;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & CommonProps & { as?: 'input' };
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & CommonProps & { as: 'textarea' };
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & CommonProps & { as: 'select'; children: React.ReactNode };

type FormFieldProps = InputProps | TextareaProps | SelectProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, name, error, containerClassName = 'mb-4', ...rest } = props;

  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm";
  const errorInputClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";

  let fieldElement: React.ReactNode;

  if (props.as === 'textarea') {
    const { as, ...textareaProps } = props;
    fieldElement = <textarea {...textareaProps} id={name} name={name} className={`${commonInputClasses} ${error ? errorInputClasses : ''}`} />;
  } else if (props.as === 'select') {
    const { as, children, ...selectProps } = props;
    fieldElement = <select {...selectProps} id={name} name={name} className={`${commonInputClasses} ${error ? errorInputClasses : ''}`}>{children}</select>;
  } else {
    const { as, type = 'text', ...inputProps } = props as InputProps; // Explicitly cast for 'type'
    fieldElement = <input {...inputProps} type={type} id={name} name={name} className={`${commonInputClasses} ${error ? errorInputClasses : ''}`} />;
  }
  
  return (
    <div className={containerClassName}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {fieldElement}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;