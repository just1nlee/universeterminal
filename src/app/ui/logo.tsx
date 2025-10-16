import Image from 'next/image';

export default function UniverseTerminalLogo() {
  return (
    <div className="w-full max-w-[645]">
      <Image
        src="/universeterminal-logo.png"
        alt="Universe Terminal Logo"
        width={1832}
        height={512}
        draggable={false}
        className="flex w-full h-full object-contain select-none pointer-events-none"
        priority
      />
    </div>
  );
}