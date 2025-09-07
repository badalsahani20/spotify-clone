import { Button } from "./components/ui/button";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";

export default function App() {
    return (
      <>
      <h1 className="text-red-500 text-5xl">Hello</h1> 
      {/* <Button>Click Me</Button> */}
      <header>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
      </>
    )
}