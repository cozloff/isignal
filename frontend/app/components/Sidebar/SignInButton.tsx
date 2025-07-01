import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function SignInButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      className="dark cursor-pointer border-gray-500 hover:border-gray-100"
    >
      <User className="text-white" />
      <span
        className="font-semibold text-white"
        onClick={() => navigate("/login")}
      >
        Sign In
      </span>
    </Button>
  );
}
