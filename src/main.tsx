import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";
import { GoogleOAuthProvider } from '@react-oauth/google';
// import "pretendard/dist/web/static/pretendard.css";

async function enableMocking() {
  if (!import.meta.env.DEV || (import.meta.env.VITE_ENABLE_MOCK || 'true') !== 'true') {
    return;
  }

  const { worker } = await import("./mock/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={CLIENT_ID || ""}>
          <App />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
});
