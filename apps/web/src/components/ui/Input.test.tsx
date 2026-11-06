import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

it("keeps a required field's accessible name equal to its label", () => {
  render(<Input label="نام پلن" required />);
  expect(screen.getByRole("textbox", { name: "نام پلن" })).toBeRequired();
});

it.each([Input, Textarea])("connects repeated labels to distinct fields and retains external descriptions", (Control) => {
  render(<><p id="shared-help">راهنمای مشترک</p><Control label="یادداشت" hint="راهنمای فیلد" aria-describedby="shared-help" /><Control label="یادداشت" error="این فیلد الزامی است" aria-describedby="shared-help" /></>);
  const fields = screen.getAllByRole("textbox", { name: "یادداشت" });
  expect(fields[0].id).not.toBe(fields[1].id);
  expect(fields[0]).toHaveAccessibleDescription("راهنمای مشترک راهنمای فیلد");
  expect(fields[1]).toHaveAccessibleDescription("راهنمای مشترک این فیلد الزامی است");
});
