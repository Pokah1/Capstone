'use client'
import { Provider } from "@supabase/supabase-js";
import {Button} from '@/components/ui/button'
import { oAuthSignIn } from "./actions";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

export function OAuthButton() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
    },
    {
        name: "google",
      displayName: "Google",
    },
    {
        name: "facebook",
      displayName: "Facebook",
    }
  
  ];

  return <>
  {oAuthProviders.map(provider => <Button className="flex items-center justify-center gap-2 " 
  variant="outline"
  size='mtNeg10'
  onClick={async() =>{
    await oAuthSignIn(provider.name);
  }}
  >
    Login with {provider.displayName}
  </Button>)}
  </>
}


