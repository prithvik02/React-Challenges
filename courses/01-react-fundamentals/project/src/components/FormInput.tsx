type FormInputProps = {
  label?: string
  id: string
  value: string
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  type?: string
  placeholder?: string
  error?: string
}

export default function FormInput({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
}: FormInputProps) {
  return (
    <div className="form-input">
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <span className="form-error">
          {error}
        </span>
      )}
    </div>
  )
}