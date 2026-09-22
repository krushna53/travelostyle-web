import Image from 'next/image';
import JourneyCardImage from '@/components/JourneyCardImage';

export default function GalleryMobileView({ selectedStay, onBack }) {
  const galleryImages = (
    selectedStay.images?.length ? selectedStay.images : [selectedStay.image]
  )
    .filter(Boolean)
    .map((url, id) => ({ id, url }));

  return (
    <div className="w-full max-w-md p-6 flex flex-col">
      <div className="mb-4 flex items-center justify-between pb-3">
        <button
          onClick={onBack}
          className="flex h-6 w-12 items-center justify-center rounded-full bg-white transition active:scale-95"
        >
          <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-ink">
          Gallery
        </h1>

        <div className="w-12" />
      </div>
      <div className="mb-4">
        <h2 className="text-[15px] font-bold text-neutral-900 tracking-tight">
          {selectedStay.name}
        </h2>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
        {galleryImages.length === 0 && (
          <div className="relative w-full h-64 overflow-hidden border border-neutral-300">
            <JourneyCardImage src="" alt={selectedStay.name} />
          </div>
        )}
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className="w-full h-64 overflow-hidden border border-neutral-300 shadow-sm bg-white"
          >
            <img 
              src={image.url} 
              alt={selectedStay.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}