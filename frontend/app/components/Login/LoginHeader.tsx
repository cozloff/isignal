import { useHeight } from "~/hooks/useHeight";
import logo from "~/assets/kindasorta-logo.png";

export function LoginHeader() {
  const { h800, h1000, h1100 } = useHeight();

  return (
    <>
      <div className={`${h800 ? "my-1" : h1100 ? "my-1" : "my-3"}`}>
        <img
          src={logo}
          alt="HSR Logo"
          className={`w-auto ${
            h800 ? "h-15" : h1000 ? "h-18" : h1100 ? "h-19" : "h-22 md:h-25"
          }`}
        />
      </div>
      <div className={`${h800 ? "my-1" : h1000 ? "my-1" : "my-3"}`}>
        <h1
          className={`${
            h800
              ? "text-[14px] xl:text-[14px] 2xl:text-[16px]"
              : h1000
              ? "text-[16px] xl:text-[20px] 2xl:text-[25px]"
              : h1100
              ? "text-[22px] xl:text-[26px]"
              : "text-[30px] xl:text-[35px] 2xl:text-[38px]"
          } font-[600] text-gray-900`}
        >
          kindasorta
        </h1>
      </div>
    </>
  );
}
