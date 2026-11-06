import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Input } from "./Input";

it("keeps a required field's accessible name equal to its label", () => {
  render(<Input label="نام پلن" required />);
  expect(screen.getByRole("textbox", { name: "نام پلن" })).toBeRequired();
});
