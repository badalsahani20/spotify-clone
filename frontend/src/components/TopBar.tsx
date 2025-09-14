import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const TopBar = () => {
    const { isAdmin } = useAuthStore();
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
    backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" alt="spotify logo" className="w-8"/>
        Spotify
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
            <Link
            className={cn(
              buttonVariants({variant:"outline"})
            )} to={"/admin"}>
                <LayoutDashboardIcon className="size-4 mr-2" />
                Admin DashBoard
            </Link>
        )}

        {/* <SignedIn>
            <SignOutButton />
        </SignedIn> */}

        <SignedOut>
            <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  )
}

export default TopBar
