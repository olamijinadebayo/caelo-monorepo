export function getBranding() {
  const host = window.location.hostname;
  if (host.startsWith("cdfi.")) {
    return {
      name: "CDFI Lender",
      logo: "/cdfi-logo.svg", // Place a logo in public/ if you have one
      theme: "blue",
    };
  }
  // Default: login.withcaelo.ai or others
  return {
    name: "Caelo",
    logo: "/favicon.ico",
    theme: "indigo",
  };
} 