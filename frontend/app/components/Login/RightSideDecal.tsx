import { MoveUpRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useHeight } from "~/hooks/useHeight";

export function RightSideDecal() {
  const { h1000, h800 } = useHeight();

  return (
    <div className="hidden w-1/2 flex-col items-center p-5 lg:flex">
      <div className="mt-5 mr-5 flex items-center gap-4 self-end">
        <Button
          variant="outline"
          className={`cursor-pointer rounded-full bg-transparent text-white ${
            h800
              ? "!px-4 py-4 text-sm"
              : h1000
              ? "text-md !px-5 py-5"
              : "!px-6 py-6 text-xl"
          } border-2 duration-300 ease-in-out`}
          onClick={() =>
            window.open(
              "https://www.capitol.hawaii.gov/sessions/session2024/bills/GM1257_.PDF",
              "_blank"
            )
          }
        >
          Bill for Act <MoveUpRight />
        </Button>
      </div>

      <div
        className={`mt-auto flex w-full flex-col ${
          h800 ? "mb-20 ml-20" : h1000 ? "mb-30 ml-30" : "mb-40 ml-40"
        }`}
      >
        <span
          className={`text-white ${
            h800 ? "text-xl" : h1000 ? "text-2xl" : "text-3xl"
          } w-[90%]`}
        >
          Safer schools start here. Protect First. Verify Always.
        </span>
        <span
          className={`text-gray-300 ${
            h800 ? "text-md" : h1000 ? "text-lg" : "text-xl"
          } w-[90%]`}
        >
          The Harm to Student Registry is built with privacy and student safety
          at it's core.
        </span>
      </div>
    </div>
  );
}
