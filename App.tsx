import React, { useState } from 'react';
import { Layout, Wand2, Download, RefreshCcw, Settings2, Type, Car, Palette, Layers, Video, Image as ImageIcon } from 'lucide-react';
import { Logo } from './components/Logo';
import { ImageUploader } from './components/ImageUploader';
import { ThumbnailPreview } from './components/ThumbnailPreview';
import { MarketingGenerator } from './components/MarketingGenerator';
import { generateThumbnailBackground } from './services/geminiService';
import { ThumbnailStyle, BadgeType, FontFamily, StrokeWidth, ShadowIntensity, AppSection } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>('THUMBNAIL');

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Customization State
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailStyle>(ThumbnailStyle.LUXURY_SHOWROOM);
  const [overlayText, setOverlayText] = useState<string>("NEW STOCK");
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [enhanceLighting, setEnhanceLighting] = useState<boolean>(true);
  
  // New Text Customization State
  const [textPosition, setTextPosition] = useState<number>(4); // 0-8 grid
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(100);
  const [fontFamily, setFontFamily] = useState<FontFamily>(FontFamily.MODERN);
  const [strokeWidth, setStrokeWidth] = useState<StrokeWidth>(StrokeWidth.MEDIUM);
  const [shadowIntensity, setShadowIntensity] = useState<ShadowIntensity>(ShadowIntensity.HARD);

  // Advanced Visuals
  const [selectedBadge, setSelectedBadge] = useState<BadgeType>(BadgeType.NONE);
  const [textTilt, setTextTilt] = useState<boolean>(true);
  const [textBackground, setTextBackground] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null); 

    try {
      const resultImage = await generateThumbnailBackground(
        uploadedImage,
        selectedStyle,
        enhanceLighting
      );
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError("Failed to generate thumbnail. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `4fmotors-thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-black font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo scale={0.8} />
          
          {/* Tab Navigation */}
          <div className="flex items-center bg-black/50 rounded-full p-1 border border-zinc-800">
            <button 
              onClick={() => setActiveSection('THUMBNAIL')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeSection === 'THUMBNAIL' 
                ? 'bg-brand-gold text-black shadow-[0_0_15px_rgba(192,160,98,0.3)]' 
                : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Thumbnail
            </button>
            <button 
              onClick={() => setActiveSection('MARKETING')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeSection === 'MARKETING' 
                ? 'bg-brand-gold text-black shadow-[0_0_15px_rgba(192,160,98,0.3)]' 
                : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              Marketing
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <span className="text-brand-gold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              AI System Online
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* THUMBNAIL SECTION */}
        {activeSection === 'THUMBNAIL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
            
            {/* Left Column: Controls */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Thumbnail Studio</h1>
                <p className="text-zinc-400">Upload a raw car photo and let the 4F AI turn it into a viral thumbnail.</p>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                  <Car className="w-4 h-4" /> Source Image
                </h2>
                <ImageUploader onImageSelect={(img) => {
                  setUploadedImage(img);
                  setGeneratedImage(null); 
                }} />
              </div>

              {/* AI Generation Config */}
              <div className="space-y-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> AI Settings
                </h2>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold">Background Vibe</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(ThumbnailStyle).map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={`p-2 text-left text-xs rounded-lg transition-all border ${
                          selectedStyle === style 
                          ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' 
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                 <button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || isGenerating}
                  className={`w-full py-4 rounded-lg font-display font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
                    !uploadedImage || isGenerating
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-brand-gold text-black hover:bg-brand-accent hover:shadow-[0_0_20px_rgba(192,160,98,0.4)]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCcw className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" /> Generate Background
                    </>
                  )}
                </button>
              </div>

              {/* Overlay Editor */}
              <div className="space-y-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-brand-gold/10 rounded-bl-xl border-b border-l border-brand-gold/20">
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Editor</span>
                </div>

                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Overlay Controls
                </h2>

                {/* Text Content */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold flex items-center gap-2">
                    <Type className="w-3 h-3" /> Headline Text
                  </label>
                  <input 
                    type="text" 
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value.toUpperCase())}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-brand-gold transition-colors font-display"
                    placeholder="e.g. SOLD OUT"
                  />
                </div>

                {/* Font Style & Position */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Font</label>
                        <select 
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        >
                            {Object.values(FontFamily).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Position</label>
                        <div className="grid grid-cols-3 gap-1 w-fit">
                            {[0,1,2,3,4,5,6,7,8].map(i => (
                                <button 
                                    key={i}
                                    onClick={() => setTextPosition(i)}
                                    className={`w-6 h-6 rounded border ${textPosition === i ? 'bg-brand-gold border-brand-gold' : 'bg-black border-zinc-700 hover:border-zinc-500'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Typography Details: Size, Stroke, Shadow (NEW) */}
                <div className="space-y-4 pt-2 border-t border-zinc-800">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs text-zinc-500 uppercase font-bold">Text Size</label>
                      <span className="text-xs text-brand-gold">{fontSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="200" 
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500 uppercase font-bold">Stroke</label>
                      <select 
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value) as StrokeWidth)}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      >
                        <option value={StrokeWidth.NONE}>None</option>
                        <option value={StrokeWidth.THIN}>Thin</option>
                        <option value={StrokeWidth.MEDIUM}>Medium</option>
                        <option value={StrokeWidth.THICK}>Thick</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500 uppercase font-bold">Shadow</label>
                       <select 
                        value={shadowIntensity}
                        onChange={(e) => setShadowIntensity(e.target.value as ShadowIntensity)}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      >
                        <option value={ShadowIntensity.NONE}>None</option>
                        <option value={ShadowIntensity.SOFT}>Soft</option>
                        <option value={ShadowIntensity.HARD}>Hard</option>
                        <option value={ShadowIntensity.NEON}>Neon Glow</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Colors & Effects */}
                <div className="space-y-4 pt-2 border-t border-zinc-800">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold flex items-center gap-2">
                            <Palette className="w-3 h-3" /> Color & Badge
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['#FFFFFF', '#C0A062', '#EF4444', '#3B82F6', '#FACC15'].map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setTextColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${textColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Sticker Badge</label>
                        <select 
                            value={selectedBadge}
                            onChange={(e) => setSelectedBadge(e.target.value as BadgeType)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        >
                            {Object.values(BadgeType).map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={textTilt} onChange={(e) => setTextTilt(e.target.checked)} className="rounded border-zinc-700 bg-black text-brand-gold focus:ring-0" />
                            <span className="text-xs text-zinc-400">Tilt Text</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={textBackground} onChange={(e) => setTextBackground(e.target.checked)} className="rounded border-zinc-700 bg-black text-brand-gold focus:ring-0" />
                            <span className="text-xs text-zinc-400">Text Box</span>
                        </label>
                    </div>
                </div>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-8 space-y-6">
               <div className="flex items-center justify-between mb-2">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                    <Layout className="w-4 h-4" /> Live Preview
                 </h2>
                 {generatedImage && (
                   <button 
                    onClick={handleDownload}
                    className="text-xs flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors"
                   >
                     <Download className="w-3 h-3" /> Download Image
                   </button>
                 )}
               </div>

               <ThumbnailPreview 
                 baseImage={generatedImage || uploadedImage || ''}
                 overlayText={overlayText}
                 showLogo={showLogo}
                 isProcessing={isGenerating}
                 textPosition={textPosition}
                 textColor={textColor}
                 fontSize={fontSize}
                 fontFamily={fontFamily}
                 strokeWidth={strokeWidth}
                 shadowIntensity={shadowIntensity}
                 badge={selectedBadge}
                 textTilt={textTilt}
                 textBackground={textBackground}
               />
            </div>
          </div>
        )}

        {/* MARKETING SECTION */}
        {activeSection === 'MARKETING' && (
          <div>
            <div className="mb-8">
               <h1 className="text-3xl font-display font-bold mb-2">Video Marketing & SEO</h1>
               <p className="text-zinc-400">Generate high-converting YouTube descriptions and commercial scripts instantly.</p>
            </div>
            <MarketingGenerator />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;