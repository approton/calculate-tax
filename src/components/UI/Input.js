export const Input = ({ type, value, onChange, placeholder, className }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded w-full ${className}`}
    />
  );