// We can reuse the same CSS file if the styling is similar, or create a new one.
import "./Inputbox.css";

function SelectField({
  id,
  label,
  name,
  options,
  register,
  validation,
  errors,
}) {
  // The validation for a select is usually just checking if it's required.
  const validationRules = {
    required: validation.required ? validation.errorMessage : false,
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      {/* Instead of an <input>, we use a <select> tag */}
      <select
        id={id}
        // We register it with React Hook Form, just like the input
        {...register(name, validationRules)}
      >
        {/* A default, empty option is good practice */}
        <option value="">-- Please Select --</option>

        {/* Now, we loop over the 'options' array passed in via props */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* The error message works exactly the same way */}
      {errors[name] && <p className="error-message">{errors[name].message}</p>}
    </div>
  );
}

export default SelectField;
