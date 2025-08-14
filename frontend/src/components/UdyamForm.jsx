// src/components/DynamicForm.jsx
import formSchema from "../../data/form-schema.json"; // The entire blueprint is now in the 'formSchema' variable
import { useState } from "react";
import { useForm } from "react-hook-form";
import Inputbox from "./Inputbox";
import SelectField from "./SelectField";
import "./UdyamForm.css";
import axios from "axios";
function UdyamForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const stepData = formSchema.steps.find((step) => step.step === currentStep);

  const onFinalSubmit = async (data) => {
    const backendapi = import.meta.env.VITE_API_BASE_URL;
    try {
      // Use the dynamic apiUrl variable here
      const response = await axios.post(`${backendapi}/register`, data);

      console.log("Server Response:", response.data);
      alert(`Success: ${response.data.message}`);
    } catch (error) {
      console.error("Submission Error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleNextStep = async () => {
    const fieldsToValidate = stepData.fields.map((field) => field.name);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="main-container">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit(onFinalSubmit)}>
        <div className="form-step">
          <p>
            Step {stepData.step} of {formSchema.steps.length}
          </p>
          <h3>{stepData.title}</h3>

          {stepData.fields.map((field) => {
            if (field.type === "select") {
              return (
                <SelectField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  name={field.name}
                  options={field.options}
                  register={register}
                  validation={field.validation}
                  errors={errors}
                />
              );
            }

            return (
              <Inputbox
                key={field.id}
                id={field.id}
                label={field.label}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                register={register}
                validation={field.validation}
                errors={errors}
              />
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {currentStep > 1 ? (
            <button
              type="button"
              className="prev-button"
              onClick={handlePrevStep}
            >
              Previous
            </button>
          ) : (
            // This is an empty div to keep the "Next" button on the right
            <div></div>
          )}

          {currentStep < formSchema.steps.length ? (
            <button
              type="button"
              className="next-button"
              onClick={handleNextStep}
            >
              Next
            </button>
          ) : (
            <button type="submit" className="submit-button">
              Submit Registration
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UdyamForm;
