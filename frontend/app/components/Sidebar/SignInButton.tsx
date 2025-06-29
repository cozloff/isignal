import { Button } from "~/components/ui/button";
import { User } from "lucide-react";

export default function SignInButton() {
  return (
    <Button
      variant="outline"
      className="dark cursor-pointer border-gray-500 hover:border-gray-100"
    >
      <User className="text-white" />
      <span className="font-semibold text-white">Sign In</span>
    </Button>
  );
}
