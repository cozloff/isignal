import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#171717]">
      <Outlet />
    </div>
  );
}
