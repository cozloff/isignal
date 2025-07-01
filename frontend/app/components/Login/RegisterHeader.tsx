import { useHeight } from "~/hooks/useHeight";
import logo from "~/assets/kindasorta-logo.png";

export function RegisterHeader() {
  const { h800, h1000, h1100 } = useHeight();

  return (
    <div className="flex items-center">
      <div className={`mr-3 ${h800 ? "my-1" : h1100 ? "my-3" : "my-5"}`}>
        <img
          src={logo}
          alt="HSR Logo"
          className={`w-auto ${
            h800 ? "h-16" : h1000 ? "h-18" : h1100 ? "h-20" : "h-22 md:h-22"
          }`}
        />
      </div>
      <div className={`${h800 ? "my-1" : h1000 ? "my-3" : "my-5"}`}>
        <h1
          className={`${
            h800
              ? "text-[16px] xl:text-[18px] 2xl:text-[20px]"
              : h1000
              ? "text-[22px] xl:text-[24px] 2xl:text-[30px]"
              : h1100
              ? "text-[22px] xl:text-[28px]"
              : "text-[22px] xl:text-[28px] 2xl:text-[42px]"
          } font-[600] text-gray-900`}
        >
          Register
        </h1>
      </div>
    </div>
  );
}
