import { useState, useEffect } from "react";
import {
  useSearchParams,
  type ActionFunctionArgs,
  useSubmit,
  redirect,
} from "react-router";
import { toast } from "sonner";
import { RightSideDecal } from "~/components/Login/RightSideDecal";
import { useHeight } from "~/hooks/useHeight";
import { AxiosError } from "~/api/axios-error";
import loginGradient from "~/assets/login-gradient.jpg";
import logo from "~/assets/logo-hidoe.png";
import emailIcon from "~/assets/3d-mail.png";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { resendConfirmation } = await import("~/api/services/email");
    const formData = await request.formData();
    const resendReq = Object.fromEntries(formData.entries());
    await resendConfirmation(resendReq.email as string);
    return redirect(
      `/register/confirm-email?email=${resendReq.email}&message=resent`
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.message) {
        case "AUTH_USER_NOT_FOUND":
          return redirect("/register/confirm-email?error=email");
        case "AUTH_USER_ALREADY_CONFIRMED":
          return redirect("/register/confirm-email?error=confirmed");
        default:
          return redirect("/register/confirm-email?error=1");
      }
    }
  }
}

export default function ConfirmEmail() {
  const { h1100, h1000, h800 } = useHeight();
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email") || "INVALID EMAIL";
  const submit = useSubmit();
  const [cooldown, setCooldown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleResendConfirmation = () => {
    if (isDisabled) return;

    submit({ email }, { action: "/register/confirm-email", method: "post" });

    // Start cooldown
    setCooldown(60);
    setIsDisabled(true);
  };

  useEffect(() => {
    if (cooldown === 0) {
      setIsDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (searchParams.get("error")) {
      let error = searchParams.get("error");
      switch (error) {
        case "email":
          toast.error("No user with that email.");
          break;
        case "confirmed":
          toast.error("Email already confirmed.");
          break;
        default:
          toast.error("Unexpected Error");
          break;
      }
      searchParams.delete("error");
    } else if (searchParams.get("message")) {
      let message = searchParams.get("message");
      switch (message) {
        case "resent":
          toast.success("Confirmation email resent.");
          break;
      }
      searchParams.delete("message");
    }

    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <div
      className={`relative z-10 flex h-[80%] w-[90%] min-w-80 overflow-hidden rounded-3xl bg-[#ede9e6] bg-cover xl:w-[65%]`}
      style={{
        backgroundImage: `url(${loginGradient})`,
      }}
    >
      <div className="flex w-full flex-col items-center bg-[#f2f0eb] p-10 text-center lg:w-1/2">
        <img
          src={logo}
          alt="HSR Logo"
          className={`w-auto self-start ${
            h800 ? "h-8" : h1000 ? "h-10" : h1100 ? "h-12" : "h-20 md:h-15"
          }`}
        />

        <div
          className={`flex w-full flex-col items-center lg:w-[90%] xl:w-[80%] ${
            h800
              ? "my-8 gap-4 text-sm"
              : h1000
              ? "text-md my-10 gap-5"
              : "text-md my-15 gap-6"
          }`}
        >
          <img src={emailIcon} alt="Email Icon" className="h-30 w-auto" />

          <h2 className="text-xl font-semibold">Email Confirmation</h2>

          <p className="text-center text-sm leading-relaxed text-gray-700">
            We have sent an email to{" "}
            <span className="font-medium text-blue-600">{email}</span> to
            confirm the validity of our email address. After receiving the
            email, follow the link provided to complete your registration.
          </p>

          <div className="mt-4 w-full border-t border-gray-300"></div>

          <p className="text-sm text-gray-700">
            If you did not get any mail,{" "}
            <a
              onClick={() => handleResendConfirmation()}
              className={`cursor-pointer font-medium ${
                isDisabled ? "text-gray-400" : "text-blue-600 hover:underline"
              }`}
            >
              {isDisabled
                ? `Try again in ${cooldown}s`
                : "Resend confirmation mail"}
            </a>
          </p>
        </div>
      </div>
      <RightSideDecal />
    </div>
  );
}
