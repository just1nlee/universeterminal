import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
        <div className="w-full h-full">
            <Image
                src="/universeterminal-title.png"
                alt="Universe Terminal Title"
                width={183}
                height={51}
                draggable={false}
                className="flex w-full h-full object-contain select-none pointer-events-none image-pixelated"
                priority
            />
            <p className="text-[2rem] leading-snug text-center">
                A COMMAND LINE INTERFACE TO THE OBSERVABLE UNIVERSE
            </p>
        </div>
    </div>
  );
}