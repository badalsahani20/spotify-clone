import { useSignIn } from '@clerk/clerk-react'
import { Button } from './ui/button';

const SignInOAuthButtons = () => {

    // singIn = “hey Clerk, gimme tools for signing in” ,
    // isLoaded = are you ready yet or still loading?
    const {signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const SignInWithGoogle = async () => {
        await signIn.authenticateWithRedirect({  //“please redirect me to Google to sign in”
            strategy: "oauth_google", // → “I'm using Google login, not Facebook,not Github
            redirectUrl: "/sso-callback", //-> “where to send me right after Google says yes/no”
            redirectUrlComplete: "/auth-callback", //“the final page after everything is done (like a success page or dashboard)”
        })
    }
  return (
    <Button onClick={SignInWithGoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
      Continue With Google
    </Button>
  )
}

export default SignInOAuthButtons
