import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallBackPage from "./pages/auth-callback/AuthCallBackPage";
// import { Button } from "./components/ui/button";
// import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";

export default function App() {
    return (
      <>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/auth-callback" element={<AuthCallBackPage />}/> 
        </Routes>
      </>
    )
}