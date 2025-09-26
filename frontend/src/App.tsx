import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ChatPage from "./pages/chat/ChatPage";
import AuthCallBackPage from "./pages/auth-callback/AuthCallBackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/home/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/not-found/NotFound";


export default function App() {
    return (
      <>
        <Routes>
          {/* //sso-callback is the temporary page Clerk redirects back to after Google (or any OAuth) login. */}
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth"} />}/>
          <Route path="/auth-callback" element={<AuthCallBackPage />}/>
          <Route path="/admin" element={<AdminPage />}/>

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />}/>
            <Route path="/chat" element={<ChatPage />}/>
            <Route path="/albums/:albumId" element={<AlbumPage />}/>
            <Route path="*" element={<NotFound />}/>
          </Route>
        </Routes>
        <Toaster />
      </>
    )
}