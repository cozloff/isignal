import AccountButton from "~/components/Sidebar/AccountButton";
import SignInButton from "~/components/Sidebar/SignInButton";

export default function Sidebar() {
  let account = false;
  return (
    <div className="flex h-full items-center p-6">
      <div className="self-start flex items-center">
        {account ? <AccountButton /> : <SignInButton />}
      </div>
    </div>
  );
}
