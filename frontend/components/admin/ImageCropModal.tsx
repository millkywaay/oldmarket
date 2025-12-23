import Cropper from "react-easy-crop";
import { useState } from "react";

export default function ImageCropModal({ image, onClose, onCrop }: any) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-[400px] h-[400px] relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
        />

        <div className="absolute bottom-4 right-4 space-x-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onCrop(image)}>Save</button>
        </div>
      </div>
    </div>
  );
}
