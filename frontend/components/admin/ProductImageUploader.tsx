import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = import.meta.env.VITE_PUBLIC_SUPABASE_BUCKET || 'product-images';

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export default function ProductImageUploader({ images, setImages }: any) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase) {
      console.error("URL:", supabaseUrl); 
      alert("Konfigurasi Supabase masih belum terbaca. Pastikan Anda sudah RESTART terminal (npm run dev).");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      // Upload ke bucket
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      setImages([...images, { url: publicUrl, isCover: images.length === 0 }]);
    } catch (err: any) {
      alert("Gagal upload: " + err.message);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {images.map((img: any, index: number) => (
        <div key={index} className="relative border rounded-lg overflow-hidden h-32 bg-gray-50">
          <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
          <button 
            type="button"
            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow text-red-500"
            onClick={() => setImages(images.filter((_: any, i: number) => i !== index))}
          >✕</button>
        </div>
      ))}

      {images.length < 5 && (
        <label className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 hover:border-black cursor-pointer transition-colors">
          <span className="text-2xl">+</span>
          <span className="text-xs">Upload Image</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      )}
    </div>
  );
}