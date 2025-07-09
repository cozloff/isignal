import { useEffect, useState } from "react";
import {
  redirect,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useSearchParams,
  useNavigate,
  data,
} from "react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { RightSideDecal } from "~/components/Login/RightSideDecal";
import { RegisterHeader } from "~/components/Login/RegisterHeader";
import { useHeight } from "~/hooks/useHeight";
import { getSession, commitSession } from "~/auth/sessions.server";
import loginGradient from "~/assets/login-gradient.jpg";
import { type Registration } from "~/types/Auth/Registration";
import { AxiosError } from "~/api/axios-error";

const passwordValidation = {
  lowerCase: /[a-z]/,
  upperCase: /[A-Z]/,
  number: /[0-9]/,
  specialChar: /[^a-zA-Z0-9]/,
};

const RegisterSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, "First name must be at least 2 characters")
      .max(100, "First name must be less than 100 characters"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(2, "Last name must be at least 2 characters")
      .max(100, "Last name must be less than 100 characters"),
    phone: z
      .string({ required_error: "Phone number is required" })
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits"),
    institution: z
      .string({ required_error: "Institution is required" })
      .min(2, "Institution must be at least 2 characters")
      .max(100, "Institution must be less than 100 characters"),
    title: z
      .string({ required_error: "Title is required" })
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be less than 100 characters"),
    workStreetAddress: z
      .string({ required_error: "Street address is required" })
      .min(2, "Street address must be at least 2 characters")
      .max(100, "Street address must be less than 100 characters"),
    workCity: z
      .string({ required_error: "City is required" })
      .min(2, "City must be at least 2 characters")
      .max(100, "City must be less than 100 characters"),
    workState: z
      .string({ required_error: "State is required" })
      .min(2, "State must be at least 2 characters")
      .max(100, "State must be less than 100 characters"),
    workZip: z
      .string({ required_error: "Zip code is required" })
      .regex(/^\d{5}(?:[-]\d{4})?$/, {
        message: "Zip code must be valid (e.g., 12345)",
      }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Email must be a valid address" }),
    password: z
      .string({ required_error: "Password is required" })
      .regex(
        passwordValidation.lowerCase,
        "Password must include at least one lowercase letter"
      )
      .regex(
        passwordValidation.upperCase,
        "Password must include at least one uppercase letter"
      )
      .regex(
        passwordValidation.number,
        "Password must include at least one number"
      )
      .regex(
        passwordValidation.specialChar,
        "Password must include at least one special character"
      ),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) return redirect("/");

  return data(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { registerUser } = await import("~/api/services/auth");
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());
    const parsed = RegisterSchema.safeParse(rawData);

    if (!parsed.success) return redirect("/register?error=1");

    await registerUser(parsed.data as Registration);

    return redirect(`/register/confirm-email?email=${parsed.data.email}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.message) {
        case "AUTH_EMAIL_ALREADY_EXISTS":
          return redirect("/register?error=email");
        case "AUTH_REGISTRATION_FAILED":
          return redirect("/register?error=failed");
        default:
          return redirect("/register?error=1");
      }
    }
    return redirect("/register?error=1");
  }
}

export default function RegisterForm() {
  const { h800 } = useHeight();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [currentTab, setCurrentTab] = useState("basic");
  const [formData, setFormData] = useState<z.infer<typeof RegisterSchema>>({
    firstName: "",
    lastName: "",
    phone: "",
    institution: "",
    title: "",
    workStreetAddress: "",
    workCity: "",
    workState: "",
    workZip: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const tabMeta: [string, string, string[]][] = [
    ["basic", "Basic Info", ["firstName", "lastName", "phone"]],
    [
      "work",
      "Work Info",
      [
        "institution",
        "title",
        "workStreetAddress",
        "workCity",
        "workState",
        "workZip",
      ],
    ],
    ["login", "Login Info", ["email", "password", "confirmPassword"]],
  ];

  const getTabErrorCount = (fields: string[]) =>
    fields.filter((field) => formErrors[field]).length;

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderInput = (
    field: keyof typeof formData,
    placeholder: string,
    type: string = "text"
  ) => {
    const isNumeric = field === "phone" || field === "workZip";

    return (
      <div className="my-3 text-sm">
        <Input
          placeholder={placeholder}
          type={type}
          className="border-2 border-solid"
          value={formData[field]}
          onChange={(e) =>
            handleChange(
              field,
              isNumeric ? e.target.value.replace(/\D/g, "") : e.target.value
            )
          }
          inputMode={isNumeric ? "numeric" : undefined}
        />
        {formErrors[field] && (
          <div className="mt-1 text-xs text-red-600">{formErrors[field]}</div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (searchParams.get("error")) {
      let error = searchParams.get("error");
      console.log(error);
      switch (error) {
        case "email":
          toast.error("User with that email already exists.");
          break;
        case "failed":
          toast.error("Registration Failed.");
          break;
        default:
          toast.error("Unexpected Error");
          break;
      }
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = RegisterSchema.safeParse(formData);

    if (!parsed.success) {
      toast.error("Validation failed");

      const flatErrors = parsed.error.flatten().fieldErrors;
      const extracted = Object.fromEntries(
        Object.entries(flatErrors).map(([k, v]) => [k, v?.[0] || ""])
      );
      setFormErrors(extracted);
      return;
    }

    setFormErrors({});
    submit(parsed.data, { action: "/register", method: "post" });
  };

  return (
    <div
      className="relative z-10 flex h-[80%] w-[90%] min-w-80 overflow-hidden rounded-3xl bg-[#ede9e6] bg-cover xl:w-[65%]"
      style={{ backgroundImage: `url(${loginGradient})` }}
    >
      <div
        className={`${
          h800 ? "text-sm" : "text-md"
        } flex w-full flex-col items-center bg-[#f2f0eb] p-15 text-center lg:w-1/2`}
      >
        <RegisterHeader />
        <div className="w-full">
          <form onSubmit={handleSubmit} className="mb-10">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              defaultValue="basic"
            >
              <TabsList>
                {tabMeta.map(([key, label, fields]) => {
                  const errorCount = getTabErrorCount(fields);

                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="relative flex cursor-pointer items-center gap-1"
                    >
                      {label}
                      {errorCount > 0 && (
                        <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                          {errorCount}
                        </span>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="basic">
                {renderInput("firstName", "First Name")}
                {renderInput("lastName", "Last Name")}
                {renderInput("phone", "Phone Number", "tel")}
                <Button
                  className="float-end mt-3 mb-2 cursor-pointer"
                  onClick={() => setCurrentTab("work")}
                  type="button"
                >
                  Next
                </Button>
              </TabsContent>

              <TabsContent value="work">
                <div className="grid grid-cols-2 gap-x-4">
                  {renderInput("institution", "Institution")}
                  {renderInput("title", "Title")}
                  {renderInput("workStreetAddress", "Street Address")}
                  {renderInput("workCity", "City")}
                  {renderInput("workState", "State")}
                  {renderInput("workZip", "Zip Code", "tel")}
                </div>
                <div className="mt-3 flex justify-between">
                  <Button
                    className="cursor-pointer"
                    onClick={() => setCurrentTab("basic")}
                    type="button"
                  >
                    Back
                  </Button>
                  <Button
                    className="cursor-pointer"
                    onClick={() => setCurrentTab("login")}
                    type="button"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="login">
                {renderInput("email", "Email", "email")}
                {renderInput("password", "Password", "password")}
                {renderInput("confirmPassword", "Confirm Password", "password")}
                <div className="mt-3 flex justify-between">
                  <Button
                    className="cursor-pointer"
                    onClick={() => setCurrentTab("work")}
                    type="button"
                  >
                    Back
                  </Button>
                  <Button className="cursor-pointer" type="submit">
                    Create account
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>

          <span className="text-sm">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              className="cursor-pointer text-blue-500"
            >
              Login
            </a>
          </span>
        </div>
      </div>
      <RightSideDecal />
    </div>
  );
}
