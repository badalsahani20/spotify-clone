import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";
import AuthCallBackPage from "./pages/auth-callback/AuthCallBackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
// import { Button } from "./components/ui/button";
// import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";

export default function App() {
    return (
      <>
        <Routes>
          {/* //sso-callback is the temporary page Clerk redirects back to after Google (or any OAuth) login. */}
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth"} />}/>
          <Route path="/auth-callback" element={<AuthCallBackPage />}/>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />}/>
            <Route path="/chat" element={<ChatPage />}/>
          </Route>
        </Routes>
      </>
    )
}