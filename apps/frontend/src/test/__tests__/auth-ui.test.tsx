import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Index from "../../pages/Index";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock window.location.hostname for branding tests
const setHostname = (hostname: string) => {
  Object.defineProperty(window, "location", {
    value: { ...window.location, hostname },
    writable: true,
  });
};

describe("Authentication UI", () => {
  beforeEach(() => {
    // Reset hostname before each test
    setHostname("login.withcaelo.ai");
  });

  it("shows Sign In form by default", () => {
    render(<Index />);
    expect(screen.getByText(/Sign In to Caelo/i)).toBeInTheDocument();
  });

  it("toggles to Sign Up form", () => {
    render(<Index />);
    // Click the Sign Up button in the navigation
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  it("validates required fields in Sign Up", async () => {
    render(<Index />);
    // Click the Sign Up button in the navigation
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    // Click the submit button (form button) - use getAllByRole and find the submit button
    const submitButtons = screen.getAllByRole("button", { name: /Sign Up/i });
    const submitButton = submitButtons.find(button => button.getAttribute('type') === 'submit');
    fireEvent.click(submitButton!);
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });

  it("shows role selection in Sign Up", () => {
    render(<Index />);
    // Click the Sign Up button in the navigation
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
  });

  it("shows demo user switcher in Sign In", () => {
    render(<Index />);
    expect(screen.getByLabelText(/Switch User/i)).toBeInTheDocument();
  });

  it("changes branding for cdfi subdomain", () => {
    setHostname("cdfi.withcaelo.ai");
    render(<Index />);
    // Use getAllByText and check the first occurrence (header)
    const cdfiElements = screen.getAllByText(/CDFI Lender/i);
    expect(cdfiElements.length).toBeGreaterThan(0);
  });

  it("shows admin dashboard after demo login", async () => {
    render(<Index />);
    // Select demo user
    fireEvent.change(screen.getByLabelText(/Switch User/i), {
      target: { value: "sarah@withcaelo.ai" },
    });
    // Click the submit button (form button) - use getAllByRole and find the submit button
    const submitButtons = screen.getAllByRole("button", { name: /Sign In/i });
    const submitButton = submitButtons.find(button => button.getAttribute('type') === 'submit');
    fireEvent.click(submitButton!);
    // Wait for dashboard
    expect(await screen.findByText(/Admin Dashboard/i)).toBeInTheDocument();
    // Wait for loading to complete and check for the tab button specifically
    await screen.findByRole("tab", { name: /Loan Products/i });
    // Check for loan products content instead of placeholder
    expect(screen.getByRole("tab", { name: /Loan Products/i })).toBeInTheDocument();
    expect(screen.getByText(/Create Loan Product/i)).toBeInTheDocument();
  });
}); 