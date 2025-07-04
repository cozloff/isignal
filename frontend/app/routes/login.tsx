import { useEffect } from "react";
import {
  redirect,
  data,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useSearchParams,
  useNavigate,
  useSubmit,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMsal } from "@azure/msal-react";
import { LoginHeader } from "~/components/Login/LoginHeader";
import { RightSideDecal } from "~/components/Login/RightSideDecal";
import { InternalLogin } from "~/components/Login/InternalLogin";
import { ExternalLogin } from "~/components/Login/ExternalLogin";
import { getSession, commitSession } from "~/auth/sessions.server";
import { useHeight } from "~/hooks/useHeight";
import { loginUser } from "~/api/services/auth";
import apiClient from "~/api/axios.server";
import loginGradient from "~/assets/login-gradient.jpg";
import { type CustomJwtPayload } from "~/types/Auth/CustomJwtPayload";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, {
    message: "Invalid password.",
  }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) return redirect("/");

  return data(
    { error: session.get("error") },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { jwtDecode } = await import("jwt-decode")
    const session = await getSession(request.headers.get("Cookie"));
    const formData = await request.formData();
    const userData = Object.fromEntries(formData.entries());
    const outcome = await loginUser(
      userData.email as string,
      userData.password as string
    );

    if (outcome.jwtToken) {
      const decoded = jwtDecode<CustomJwtPayload>(outcome.jwtToken);
      session.set("jwtToken", outcome.jwtToken);
      session.set("refreshToken", outcome.refreshToken);
      session.set("userId", decoded.sub || "");
      session.set("name", `${decoded.FirstName} ${decoded.LastName}` || "");
      session.set( 
        "role", 
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
          .map((role: string) => role.toLowerCase())
      );

      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${outcome.jwtToken}`;

      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    if (outcome.message == "user") return "user";
    else if (outcome.message == "password") return "password";
  } catch (error) {
    console.error("Error in action:", error);
    return redirect("/login?error=1");
  }
}

export default function Login() {
  const { h1000, h800 } = useHeight();
  const [searchParams, setSearchParams] = useSearchParams();
  const { instance } = useMsal();
  const submit = useSubmit();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginRedirect = () => {
    sessionStorage.clear();
    instance
      .loginRedirect({
        ...{ scopes: [] },
        redirectUri: "/login/callback",
      })
      .catch((error) => console.log(error));
  };

  const handleExternalLogin = (data: z.infer<typeof FormSchema>) => {
    const loginEntry = {
      email: data.email,
      password: data.password,
    };
    submit(loginEntry, { action: "/login", method: "post" });
  };

  useEffect(() => {
    if (searchParams.get("error")) {
      toast.error("Failed to login. Please try again.");
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`
          relative z-10 flex h-[80%] w-[90%] min-w-80 overflow-hidden rounded-3xl 
          bg-[#ede9e6] bg-cover xl:w-[65%]
        `}
        style={{
          backgroundImage: `url(${loginGradient})`,
        }}
      >
        <div
          className={`
            flex w-full flex-col items-center bg-[#f2f0eb] p-15 
            text-center lg:w-1/2
          `}
        >
          <LoginHeader />
          <div
            className={`
              flex w-[120%] flex-col items-center lg:w-[90%] xl:w-[80%] 
              ${h800 ? "my-10 gap-6" : h1000 ? "my-20 gap-7" : "my-30 gap-8"}
            `}
          >
            <p
              className={`
                text-gray-800
                ${h800 ? "text-xs" : h1000 ? "text-xs" : "text-sm"} 
              `}
            >
              Login to manage tenant.
            </p>
            <InternalLogin handleLoginRedirect={handleLoginRedirect} />
            <ExternalLogin
              form={form}
              handleExternalLogin={handleExternalLogin}
            />
            <span className="text-sm">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/register")}
                className="cursor-pointer text-blue-500"
              >
                Sign up
              </a>
            </span>
          </div>
        </div>
        <RightSideDecal />
      </div>
    </div>
  );
}
