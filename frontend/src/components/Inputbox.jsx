import "./Inputbox.css";

function Inputbox({
  id,
  label,
  name,
  type,
  placeholder,
  register,
  validation,
  errors,
}) {
  // Convert the validation rules from our JSON into the format React Hook Form expects
  const validationRules = {
    required: validation.required ? validation.errorMessage : false,
    pattern: validation.regex
      ? {
          value: new RegExp(validation.regex),
          message: validation.errorMessage,
        }
      : undefined,
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(name, validationRules)}
      />
      {errors[name] && (
        <p className="error-message error">{errors[name].message}</p>
      )}
    </div>
  );
}

export default Inputbox;
