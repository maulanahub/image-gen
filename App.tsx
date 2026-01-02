
import React, { useState, useEffect, useRef } from 'react';
import { 
  ModelConfig, 
  ProductConfig, 
  SceneConfig, 
  GeneratedImage, 
  AspectRatio, 
  ImageSize 
} from './types';
import { 
  GENDER_OPTIONS, 
  AGE_OPTIONS, 
  ETHNICITY_OPTIONS, 
  HAIR_OPTIONS, 
  EXPRESSION_OPTIONS,
  PRODUCT_CATEGORIES,
  INTERACTION_TYPE,
  POSE_OPTIONS,
  ENVIRONMENT_OPTIONS,
  LIGHTING_OPTIONS,
  STYLE_OPTIONS,
  ASPECT_RATIOS,
  RESOLUTION_OPTIONS
} from './constants';
import { generateImagePrompt, callGenerateImage, ImageData } from './services/geminiService';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar terlalu besar. Maksimal 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSourceImage({ data: base64String, mimeType: file.type });
        setSourceImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = generateImagePrompt(modelConfig, productConfig, sceneConfig, !!sourceImage);
      const imageUrl = await callGenerateImage(
        prompt, 
        sceneConfig.aspectRatio, 
        sceneConfig.resolution, 
        sourceImage || undefined
      );
      
      const newImage: GeneratedImage = { 
        url: imageUrl, 
        prompt: prompt, 
        timestamp: Date.now() 
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      setCurrentImageIndex(0);
      
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat membuat gambar.");
    } finally {
      setIsGenerating(false);
    }
  };

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    gender: GENDER_OPTIONS[0],
    age: AGE_OPTIONS[3],
    ethnicity: ETHNICITY_OPTIONS[0],
    hairStyle: HAIR_OPTIONS[1],
    expression: EXPRESSION_OPTIONS[0],
  });

  const [productConfig, setProductConfig] = useState<ProductConfig>({
    category: PRODUCT_CATEGORIES[0],
    description: "Kualitas premium, desain modern",
    color: "Warna Alami",
    material: "Material Standar",
  });

  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    pose: POSE_OPTIONS[1],
    interactionType: INTERACTION_TYPE[1],
    environment: ENVIRONMENT_OPTIONS[0],
    lighting: LIGHTING_OPTIONS[0],
    style: STYLE_OPTIONS[0],
    aspectRatio: "1:1",
    resolution: "1K",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">M</div>
          <div>
            <h1 className="text-xl font-bold leading-none">ModelGen AI</h1>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Multi-Industry Content</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 font-bold text-xs">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span>Sistem Komersial Siap</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preview Area */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 lg:order-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[450px] md:min-h-[700px] flex flex-col">
            <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] p-4">
              {isGenerating ? (
                <div className="text-center text-white space-y-6 animate-pulse">
                  <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-blue-500/20"></div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold tracking-tight">AI Sedang Merender...</p>
                    <p className="text-sm text-gray-400 px-8">Mengoptimalkan pencahayaan, tekstur, dan komposisi komersial.</p>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="relative group max-h-full">
                   <img 
                    src={generatedImages[currentImageIndex].url} 
                    alt="Hasil AI" 
                    className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl mx-auto"
                  />
                   <div className="absolute bottom-6 right-6 flex space-x-3">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedImages[currentImageIndex].url;
                          link.download = `modelgen-${Date.now()}.png`;
                          link.click();
                        }} 
                        className="bg-white/95 backdrop-blur-md p-4 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center space-x-2 font-bold"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Unduh Gambar</span>
                      </button>
                   </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 max-w-md px-10">
                  <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-800 shadow-2xl -rotate-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-2xl font-black mb-4 tracking-tight">Mulai Kreasi Konten</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Pilih kategori produk dan konfigurasi model di panel samping untuk menghasilkan foto komersial berkualitas tinggi.
                  </p>
                </div>
              )}
            </div>
            
            {generatedImages.length > 0 && (
              <div className="p-5 bg-white border-t border-gray-100 flex overflow-x-auto space-x-4 scrollbar-hide">
                {generatedImages.map((img, idx) => (
                  <button 
                    key={img.timestamp} 
                    onClick={() => setCurrentImageIndex(idx)} 
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${idx === currentImageIndex ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-transparent opacity-50'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Configuration Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:order-1 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 pb-24 lg:pb-4 custom-scrollbar">
          
          {/* Reference Image Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">1. Gambar Referensi (Opsional)</h2>
            <div className="space-y-4">
              {!sourceImagePreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-400 group-hover:text-blue-600">Klik untuk Unggah Foto Produk</span>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 group">
                  <img src={sourceImagePreview} alt="referensi" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => { setSourceImage(null); setSourceImagePreview(null); }} 
                      className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Product Details Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">2. Informasi Produk</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Kategori Utama</label>
                <select 
                  value={productConfig.category} 
                  onChange={(e) => setProductConfig({...productConfig, category: e.target.value})} 
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {PRODUCT_CATEGORIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Warna</label>
                  <input 
                    type="text" 
                    value={productConfig.color} 
                    onChange={(e) => setProductConfig({...productConfig, color: e.target.value})} 
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Warna Produk"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Material</label>
                  <input 
                    type="text" 
                    value={productConfig.material} 
                    onChange={(e) => setProductConfig({...productConfig, material: e.target.value})} 
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Material"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Keterangan Khusus</label>
                <textarea 
                  value={productConfig.description} 
                  onChange={(e) => setProductConfig({...productConfig, description: e.target.value})} 
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium h-24 resize-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="Contoh: Tekstur kulit berbutir halus, logo emas di tengah, kemasan elegan dengan uap..." 
                />
              </div>
            </div>
          </section>

          {/* Model Profiling Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">3. Profil Talent/Model</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Gender</label>
                <select value={modelConfig.gender} onChange={(e) => setModelConfig({...modelConfig, gender: e.target.value})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                  {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Kelompok Usia</label>
                <select value={modelConfig.age} onChange={(e) => setModelConfig({...modelConfig, age: e.target.value})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                  {AGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Etnis</label>
                <select value={modelConfig.ethnicity} onChange={(e) => setModelConfig({...modelConfig, ethnicity: e.target.value})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                  {ETHNICITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Rambut</label>
                <select value={modelConfig.hairStyle} onChange={(e) => setModelConfig({...modelConfig, hairStyle: e.target.value})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                  {HAIR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Scene & Settings Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">4. Pengaturan Visual</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 ml-1">Interaksi Produk</label>
                <select value={sceneConfig.interactionType} onChange={(e) => setSceneConfig({...sceneConfig, interactionType: e.target.value})} className="w-full bg-blue-50 border-0 rounded-xl px-4 py-3 text-sm font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 transition-all">
                  {INTERACTION_TYPE.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Lokasi</label>
                  <select value={sceneConfig.environment} onChange={(e) => setSceneConfig({...sceneConfig, environment: e.target.value})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                    {ENVIRONMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Pencahayaan</label>
                  <select value={sceneConfig.lighting} onChange={(e) => setSceneConfig({...sceneConfig, lighting: e.target.value})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                    {LIGHTING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Aspek Rasio</label>
                  <select value={sceneConfig.aspectRatio} onChange={(e) => setSceneConfig({...sceneConfig, aspectRatio: e.target.value as AspectRatio})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                    {ASPECT_RATIOS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Kualitas Output</label>
                  <select value={sceneConfig.resolution} onChange={(e) => setSceneConfig({...sceneConfig, resolution: e.target.value as ImageSize})} className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all">
                    {RESOLUTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center space-x-3 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="fixed lg:relative bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md lg:bg-transparent border-t lg:border-t-0 z-40 lg:p-0">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating} 
              className={`w-full py-5 px-8 rounded-3xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-2xl ${isGenerating ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200'}`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sedang Merender...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>Hasilkan Gambar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          ModelGen AI &bull; Smart Commercial Assets System &bull; Powered by Gemini 2.5 Flash
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default App;
