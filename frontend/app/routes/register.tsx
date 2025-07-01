import { useEffect } from "react";
import {
  redirect,
  useSubmit,
  data,
  useActionData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useSearchParams,
  useNavigate,
  Form as ReactRouterForm,
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
  FormLabel,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { RightSideDecal } from "~/components/Login/RightSideDecal";
import { RegisterHeader } from "~/components/Login/RegisterHeader";
import { registerUser } from "~/api/services/auth";
import { useHeight } from "~/hooks/useHeight";
import { getSession, commitSession } from "~/auth/sessions.server";
import loginGradient from "~/assets/login-gradient.jpg";
import { type Registration } from "~/types/Auth/Registration";

const FormSchema = z
  .object({
    institution: z.string().min(2).max(100),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    title: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    email: z.string().email({ message: "Invalid email address." }),
    workStreetAddress: z.string().min(2).max(100),
    workCity: z.string().min(2).max(100),
    workState: z.string().min(2).max(100),
    workZip: z.string().regex(/^\d{5}$/, {
      message: "Zip code must be exactly 5 digits.",
    }),
    password: z.string().min(2, { message: "Invalid password." }),
    confirmPassword: z.string().min(2),
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
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());
    const parsed = FormSchema.safeParse(rawData);

    console.log("Parsed: ", parsed);

    if (!parsed.success) return redirect("/register?error=1");

    const outcome = await registerUser(parsed.data as Registration);

    console.log("Registration Outcome:", outcome);
  } catch (error) {
    console.error("Error in action:", error);
    return redirect("/login?error=1");
  }
}

export default function Register() {
  const { h1000, h800 } = useHeight();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      institution: "",
      firstName: "",
      lastName: "",
      title: "",
      phone: "",
      email: "",
      workStreetAddress: "",
      workCity: "",
      workState: "",
      workZip: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const buttonPadding = h800 ? "12px 12px" : "20px 20px";

  const handleRegister = async (data: z.infer<typeof FormSchema>) => {
    submit(data, { action: "/register", method: "post" });
  };

  useEffect(() => {
    if (searchParams.get("error")) {
      toast.error("Failed to register. Please try again.");
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`relative z-10 flex h-[80%] w-[90%] min-w-80 overflow-hidden 
            rounded-3xl bg-[#ede9e6] bg-cover xl:w-[65%]`}
        style={{
          backgroundImage: `url(${loginGradient})`,
        }}
      >
        <div
          className="flex w-full flex-col items-center bg-[#f2f0eb] p-15 
            text-center lg:w-1/2"
        >
          <RegisterHeader />
          <div
            className={`flex w-[120%] flex-col items-center lg:w-[90%] xl:w-[80%] ${
              h800 ? "my-10 gap-6" : h1000 ? "my-15 gap-7" : "my-20 gap-8"
            } `}
          >
            <Form {...form}>
              <ReactRouterForm
                onSubmit={form.handleSubmit(handleRegister)}
                className="w-full space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { name: "institution", label: "Institution" },
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                    { name: "title", label: "Title" },
                    { name: "phone", label: "Phone" },
                    { name: "workStreetAddress", label: "Work Street Address" },
                    { name: "workCity", label: "Work City" },
                    { name: "workState", label: "Work State" },
                    { name: "workZip", label: "Work Zip" },
                    { name: "password", label: "Password", type: "password" },
                    {
                      name: "confirmPassword",
                      label: "Confirm Password",
                      type: "password",
                    },
                    { name: "email", label: "Email" },
                  ].map(({ name, label, type = "text" }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof z.infer<typeof FormSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-700">
                            {label}
                          </FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type={type}
                              className="w-full rounded-md border border-gray-300 px-4 py-2 
                              text-xs shadow-sm focus:border-blue-500 focus:ring 
                              focus:ring-blue-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  style={{ padding: buttonPadding }}
                  className={`z-10 w-[50%] transform cursor-pointer rounded-md border border-2 border-blue-400 bg-blue-500 text-white shadow-md
                 transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-500 ${
                   h800 ? "text-sm" : "text-md"
                 }`}
                >
                  Register
                </Button>
              </ReactRouterForm>
            </Form>
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
    </div>
  );
}
