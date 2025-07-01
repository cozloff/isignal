import { Form as ReactRouterForm } from "react-router";
import { Mail, Lock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { useHeight } from "~/hooks/useHeight";
import mailIcon from "~/assets/mail-icon.png";

export function ExternalLogin({
  form,
  handleExternalLogin,
}: {
  form: any;
  handleExternalLogin: (data: any) => void;
}) {
  const { h800, h1000 } = useHeight();
  const buttonPadding = h800 ? "12px 12px" : "20px 20px";

  return (
    <>
      <div className="flex w-[80%] items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span
          className={`mx-4 text-gray-500 ${
            h800 ? "text-xs" : h1000 ? "text-sm" : "text-base"
          }`}
        >
          or
        </span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>
      <div className="flex items-center">
        <img
          src={mailIcon}
          alt="Mail Icon"
          className={`w-auto ${
            h800 ? "h-3" : h1000 ? "h-4" : "h-5"
          } mr-3 transition duration-200`}
        />
        <p className={`${h800 ? "text-xs" : h1000 ? "text-sm" : "text-base"} `}>
          Login using email
        </p>
      </div>
      <Form {...form}>
        <ReactRouterForm onSubmit={form.handleSubmit(handleExternalLogin)}>
          <div className="flex w-full flex-col items-center gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`relative flex items-center rounded-md border border-gray-300 shadow-sm ${
                        h1000 ? "py-2 pr-6" : "py-3 pr-8"
                      } pl-10 focus-within:border-blue-500`}
                    >
                      <Mail size={20} className="absolute left-3 ml-3" />

                      <input
                        className={`text-base md:text-${
                          h800 ? "xs" : h1000 ? "sm" : "md"
                        } ml-3 flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none`}
                        placeholder="Email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`relative flex items-center rounded-md border border-gray-300 shadow-sm ${
                        h1000 ? "py-2 pr-6" : "py-3 pr-8"
                      } pl-10 focus-within:border-blue-500`}
                    >
                      <Lock size={20} className="absolute left-3 ml-3" />

                      <input
                        type="password"
                        className={`text-base md:text-${
                          h800 ? "xs" : h1000 ? "sm" : "md"
                        } ml-3 flex-1 bg-transparent text-gray-800 placeholder:text-gray-500 focus:outline-none`}
                        placeholder="Password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              style={{ padding: buttonPadding }}
              className={`z-10 w-[50%] transform cursor-pointer rounded-md border border-2 border-blue-400 bg-blue-500 text-white shadow-md
                 transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-500 ${
                   h800 ? "text-sm" : "text-md"
                 }`}
            >
              <span className={`text-sm`}>Login</span>
            </Button>

            {(form.formState.errors.email ||
              form.formState.errors.password) && (
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {form.formState.errors.email && (
                  <span className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 shadow">
                    {form.formState.errors.email.message}
                  </span>
                )}
                {form.formState.errors.password && (
                  <span className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 shadow">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </ReactRouterForm>
      </Form>
    </>
  );
}
