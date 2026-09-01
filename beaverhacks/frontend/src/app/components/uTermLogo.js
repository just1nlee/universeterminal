import Image from "next/image";

export default function UTermLogo() {
  return (
    <div className="w-full max-w-[645]">
      <Image
        src="/images/universeterminal-logo.png"
        alt="UTerm Logo"
        width={1832}
        height={512}
        draggable={false}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
