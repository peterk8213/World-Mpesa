import SignInButton from "@/components/SignInButton";

import { MetallicSphere } from "@/components/MetallicSphere";
import { BackgroundPaths } from "@/components/BackgroundPath";

export default function SignIn() {
  return (
    <>
      <div className=" overscroll-none h-screen overflow-auto items-center">
        <div>
          <BackgroundPaths title="Welcome to Nekron" />
        </div>
        <div className=" fixed  bottom-12 left-0 right-0 z-50 flex flex-col items-center justify-center">
          <SignInButton />
        </div>
      </div>
    </>
  );
}
