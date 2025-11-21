import React, { useState } from 'react';
import { Copy, Check, FileText, Video, Sparkles } from 'lucide-react';
import { generateMarketingContent } from '../services/geminiService';

export const MarketingGenerator: React.FC = () => {
  const [carDetails, setCarDetails] = useState('');
  const [carLink, setCarLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ description: string; script: string } | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleGenerate = async () => {
    if (!carDetails || !carLink) return;

    setIsGenerating(true);
    try {
      const { summary, script } = await generateMarketingContent(carDetails, carLink);

      // Construct the final YouTube description block exactly as requested
      const finalDescription = `${summary}

📍 4F MOTORS – Rua Maria Otília, 225 – Vila Regente Feijó – São Paulo/SP
📞 (11) 2594-0518
📧 4fmotorsautomoveis@gmail.com

📲 @4fmotors
🔗 ${carLink}`;

      setResults({
        description: finalDescription,
        script: script
      });
    } catch (error) {
      console.error("Error generating marketing content", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, isDesc: boolean) => {
    navigator.clipboard.writeText(text);
    if (isDesc) {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Car Details
            </label>
            <p className="text-xs text-zinc-500">Paste the raw car info (version, year, options, mileage) here.</p>
            <textarea
              value={carDetails}
              onChange={(e) => setCarDetails(e.target.value)}
              className="w-full h-48 bg-black border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none font-sans text-sm"
              placeholder="e.g. Jeep Renegade 1.8 Automático 2020, ar condicionado digital, multimídia, couro, único dono..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
              <Video className="w-4 h-4" /> Website Link
            </label>
            <input
              type="text"
              value={carLink}
              onChange={(e) => setCarLink(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="https://4fmotors.com.br/..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!carDetails || !carLink || isGenerating}
            className={`w-full py-4 rounded-lg font-display font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
              !carDetails || !carLink || isGenerating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-brand-gold text-black hover:bg-brand-accent hover:shadow-[0_0_20px_rgba(192,160,98,0.4)]'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" /> AI Writing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Outputs */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* YouTube Description Output */}
        <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-[300px]">
          <div className="bg-black/50 p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              YouTube Description
            </h3>
            {results && (
              <button
                onClick={() => copyToClipboard(results.description, true)}
                className="text-xs flex items-center gap-2 bg-zinc-800 hover:bg-brand-gold hover:text-black px-3 py-1.5 rounded transition-all"
              >
                {copiedDesc ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedDesc ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="p-4 flex-1 overflow-y-auto bg-black/20">
            {results ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
                {results.description}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic">
                Waiting for input...
              </div>
            )}
          </div>
        </div>

        {/* Commercial Script Output */}
        <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-[300px]">
          <div className="bg-black/50 p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
              🎬 Commercial Script
            </h3>
            {results && (
              <button
                onClick={() => copyToClipboard(results.script, false)}
                className="text-xs flex items-center gap-2 bg-zinc-800 hover:bg-brand-gold hover:text-black px-3 py-1.5 rounded transition-all"
              >
                {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedScript ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="p-4 flex-1 overflow-y-auto bg-black/20">
            {results ? (
              <div className="font-sans text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {results.script}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic">
                Waiting for input...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};