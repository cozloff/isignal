import kindasortaLogo from "~/assets/kindasorta-logo.png";

export default function AccountButton() {
  return (
    <>
      <img src={kindasortaLogo} className="h-15" />
      <span className="font-semibold text-white">kindasorta</span>
    </>
  );
}
