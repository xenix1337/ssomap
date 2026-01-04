import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home page by default", () => {
  render(<App />);
  const element = screen.getByText(/Filtry/i);
  expect(element).toBeInTheDocument();
});
