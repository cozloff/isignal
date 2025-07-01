import { Button } from "~/components/ui/button";
import { useHeight } from "~/hooks/useHeight";
import microsoftLogo from "~/assets/microsoft-logo.png";

export function InternalLogin({
  handleLoginRedirect,
}: {
  handleLoginRedirect: () => void;
}) {
  const { h800, h1000, h1100 } = useHeight();

  return (
    <>
      <Button
        id="login"
        type="button"
        onClick={handleLoginRedirect}
        className={`group w-full bg-transparent text-gray-800 ${
          h800
            ? "w-[120%] py-5 text-sm"
            : h1000
            ? "w-[120%] py-6 text-sm"
            : h1100
            ? "text-md w-[120%] py-8 2xl:text-xl"
            : "text-md py-8 2xl:text-xl"
        } cursor-pointer rounded-md border border-2 border-gray-300 hover:text-white`}
      >
        Login using
        <img
          src={microsoftLogo}
          alt="Microsoft Logo"
          className={`w-auto ${
            h800 ? "h-8" : h1000 ? "h-10" : "h-12 2xl:h-15"
          } transition duration-150 group-hover:invert -ml-2`}
        />
      </Button>
    </>
  );
}
