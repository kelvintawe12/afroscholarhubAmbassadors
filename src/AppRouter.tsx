
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { AuthCallback } from "./components/AuthCallback";

export function AppRouter() {
  return <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
      </BrowserRouter>;
}
