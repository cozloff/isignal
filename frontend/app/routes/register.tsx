import { useEffect, useState } from "react";
import {
  redirect,
  useSubmit,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useSearchParams,
  useNavigate,
  Form as ReactRouterForm,
  data,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { RightSideDecal } from "~/components/Login/RightSideDecal";
import { RegisterHeader } from "~/components/Login/RegisterHeader";
import { useHeight } from "~/hooks/useHeight";
import { getSession, commitSession } from "~/auth/sessions.server";
import loginGradient from "~/assets/login-gradient.jpg";
import { type Registration } from "~/types/Auth/Registration";

const passwordValidation = {
  lowerCase: /[a-z]/,
  upperCase: /[A-Z]/,
  number: /[0-9]/,
  specialChar: /[^a-zA-Z0-9]/,
};

const RegisterSchema = z
  .object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    institution: z.string().min(2).max(100),
    title: z.string().min(2).max(100),
    workStreetAddress: z.string().min(2).max(100),
    workCity: z.string().min(2).max(100),
    workState: z.string().min(2).max(100),
    workZip: z
      .string()
      .regex(/^\d{5}(?:[-]\d{4})?$/, { message: "Invalid zip code" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .regex(passwordValidation.lowerCase, "At least one lowercase letter")
      .regex(passwordValidation.upperCase, "At least one uppercase letter")
      .regex(passwordValidation.number, "At least one number")
      .regex(passwordValidation.specialChar, "At least one special character"),
    confirmPassword: z.string(),
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
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
export async function action({ request }: ActionFunctionArgs) {
  try {
    const { registerUser } = await import("~/api/services/auth");
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());
    const parsed = RegisterSchema.safeParse(rawData);

    if (!parsed.success) return redirect("/register?error=1");

    const outcome = await registerUser(parsed.data as Registration);

    console.log("Registration Outcome:", outcome);
  } catch (error) {
    console.error("Error in action:", error);
    return redirect("/login?error=1");
  }
}

export default function RegisterForm() {
  const { h800 } = useHeight();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("basic");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });

  const getTabErrorCount = (fields: string[]) =>
    fields.filter(
      (field) =>
        form.formState.errors[field as keyof typeof form.formState.errors]
    ).length;

  const basicFields = ["firstName", "lastName", "phone"];
  const workFields = [
    "institution",
    "title",
    "workStreetAddress",
    "workCity",
    "workState",
    "workZip",
  ];
  const passwordFields = ["password", "confirmPassword"];

  const tabMeta = [
    ["basic", "Basic Info", basicFields],
    ["work", "Work Info", workFields],
    ["password", "Password", passwordFields],
  ] as const;

  useEffect(() => {
    if (searchParams.get("error")) {
      toast.error("Failed to register. Please try again.");
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    submit(data, { action: "/register", method: "post" });
  };

  const renderField = (
    name: keyof z.infer<typeof RegisterSchema>,
    placeholder: string,
    type: string = "text"
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="my-3">
          <FormControl>
            <Input
              placeholder={placeholder}
              className="border-2 border-solid"
              type={type}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

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
          <Form {...form}>
            <ReactRouterForm
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mb-10"
            >
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
                  {renderField("firstName", "First Name")}
                  {renderField("lastName", "Last Name")}
                  {renderField("phone", "Phone Number", "number")}
                  <Button
                    className="float-end mt-3 mb-2"
                    onClick={() => setCurrentTab("work")}
                  >
                    Next
                  </Button>
                </TabsContent>

                <TabsContent value="work">
                  <div className="grid grid-cols-2 gap-x-4">
                    {renderField("institution", "Institution")}
                    {renderField("title", "Title")}
                    {renderField("workStreetAddress", "Street Address")}
                    {renderField("workCity", "City")}
                    {renderField("workState", "State")}
                    {renderField("workZip", "Zip Code")}
                  </div>
                  <div className="mt-3 flex justify-between">
                    <Button onClick={() => setCurrentTab("basic")}>Back</Button>
                    <Button onClick={() => setCurrentTab("password")}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="password">
                  {renderField("password", "Password", "password")}
                  {renderField(
                    "confirmPassword",
                    "Confirm Password",
                    "password"
                  )}
                  <div className="mt-3 flex justify-between">
                    <Button onClick={() => setCurrentTab("work")}>Back</Button>
                    <Button type="submit">Create account</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </ReactRouterForm>
          </Form>
          <span>
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
