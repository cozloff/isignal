import type { Route } from "./+types/home";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import Sidebar from "~/components/Sidebar/Sidebar";
import kindasortaLogo from "~/assets/kindasorta-logo.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "kindasorta" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className=" w-full md:min-w-[450px] bg-[#171717]"
    >
      <ResizablePanel defaultSize={15}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle withHandle className="dark" />
      <ResizablePanel defaultSize={85}>
        <div className="flex h-full items-center justify-center p-6">
          <div className="self-start flex items-center">
            <img src={kindasortaLogo} className="h-15" />
            <span className="font-semibold text-white">kindasorta</span>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
