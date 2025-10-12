import Image from 'next/image';

export default function UniverseTerminalLogo() {
  return (
    <div className="w-full max-w-[640px] aspect-[640/180]">
      <Image
        src="/universeterminal-logo.png"
        alt="Universe Terminal Logo"
        width={640}
        height={180}
        className="flex w-full h-full object-contain"
        priority
      />
    </div>
  );
}