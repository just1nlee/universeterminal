import Image from "next/image";
import { ReactNode } from "react";


export default function Background({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image
        src="/background.png"
        alt="Background"
        fill
        className="object-cover select-none pointer-events-none image-pixelated"
        priority
      />
      {children}
    </div>
  );
}

