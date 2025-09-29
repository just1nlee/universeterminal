import Image from 'next/image';

export default function UniverseTerminalLogo() {
  return (
    <div className="w-full max-w-[336px] aspect-[336/372]">
      <Image
        src="/universeterminal-logo.png"
        alt="Universe Terminal Logo"
        width={336}
        height={372}
        className="flex w-full h-full object-contain"
      />
    </div>
  );
}