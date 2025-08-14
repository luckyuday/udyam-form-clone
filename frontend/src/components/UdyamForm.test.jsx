import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import UdyamForm from "./UdyamForm";

// 'describe' creates a test suite to group related tests
describe("<DynamicForm />", () => {
  // 'it' defines an individual test case
  it("should render the first step on initial load", () => {
    // 1. Render the component in our virtual test environment
    render(<UdyamForm />);

    // 2. Assert that the title and field labels for Step 1 are on the screen
    expect(screen.getByText("Aadhaar Validation")).toBeInTheDocument();
    expect(screen.getByLabelText("Aadhaar Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Name as per Aadhaar")).toBeInTheDocument();
  });

  it("should show an error message for an invalid Aadhaar number", async () => {
    // This 'user' object will let us simulate typing
    const user = userEvent.setup();

    // 1. Render the component
    render(<UdyamForm />);

    // 2. Find the Aadhaar input field by its label text
    const aadhaarInput = screen.getByLabelText("Aadhaar Number");

    // 3. Simulate a user typing an invalid value into the input
    await user.type(aadhaarInput, "123"); // '123' is not a valid 12-digit number

    // 4. Assert that the error message from our schema now appears in the document.
    // We use 'findByText' because the error appears asynchronously after validation.
    const errorMessage = await screen.findByText(
      "Please enter a valid 12-digit Aadhaar number."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should not show an error message for a valid Aadhaar number", async () => {
    const user = userEvent.setup();
    render(<UdyamForm />);
    const aadhaarInput = screen.getByLabelText("Aadhaar Number");

    // Simulate typing a VALID value
    await user.type(aadhaarInput, "123456789012");

    // Assert that the error message does NOT appear in the document.
    // 'queryByText' is used for asserting an element is not present.
    const errorMessage = screen.queryByText(
      "Please enter a valid 12-digit Aadhaar number."
    );
    expect(errorMessage).not.toBeInTheDocument();
  });
});
