import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FolderArchive,
  Terminal,
  Zap,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  devUrl: string;
  sharedUrl: string;
}

export const MobileDownloadModal: React.FC<MobileDownloadModalProps> = ({
  isOpen,
  onClose,
  devUrl,
  sharedUrl,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedType, setCopiedType] = useState<'link' | 'cmd' | null>(null);
  const [activeTab, setActiveTab] = useState<'instant' | 'export_apk'>('instant');

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : devUrl;

  const primaryUrl = currentOrigin || sharedUrl;
  const sourceZipUrl = '/downloads/AURA_AI_Source_Export.zip';

  const handleCopyLink = (text: string, type: 'link' | 'cmd') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    primaryUrl
  )}&color=00f3ff&bgcolor=030712`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#030914] border border-cyan-500/70 rounded-2xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,243,255,0.45)] space-y-4 font-rajdhani text-cyan-200 max-h-[92vh] overflow-y-auto">
        {/* Holographic Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/90 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_#00f3ff]">
              <Smartphone className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-orbitron font-extrabold text-sm sm:text-base tracking-wider text-cyan-300 text-glow-cyan">
                AURA // ANDROID 11 INSTALL & APK GUIDE
              </h2>
              <p className="text-[10px] font-mono-tech text-emerald-400">
                100% असली व प्रामाणिक समाधान • डेवलपर: प्रिंस शर्मा (Prince Sharma)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/60 border border-cyan-500/40 hover:bg-cyan-950/60 text-cyan-400 hover:text-cyan-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest Explanation Alert: Why 8.75 KB Failed */}
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-xs text-amber-200 space-y-1.5">
          <div className="flex items-center space-x-2 font-orbitron font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>"There was a problem while parsing the package" क्यों आया?</span>
          </div>
          <p className="text-[11px] text-amber-100/90 leading-relaxed font-sans">
            Android 11 को एक असली <strong>.dex (Dalvik Bytecode)</strong> और <strong>Android Keystore Sign</strong> चाहिए होता है (असली APK 15MB से 30MB की होती है)। 8.75 KB की फाइल बिना कम्पाइल किए एक ज़िप फाइल थी, इसलिए Android ने उसे रिजेक्ट कर दिया। Google AI Studio क्लाउड सर्वर में Android SDK और Gradle नहीं होता, इसलिए यहाँ सीधे .apk कम्पाइल नहीं हो सकती।
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/70 border border-cyan-500/30 text-xs font-orbitron font-bold">
          <button
            onClick={() => setActiveTab('instant')}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
              activeTab === 'instant'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                : 'text-cyan-400 hover:bg-cyan-950/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>तरीका 1: तुरंत फोन में चलाएँ (BEST)</span>
          </button>
          <button
            onClick={() => setActiveTab('export_apk')}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
              activeTab === 'export_apk'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(0,255,196,0.5)]'
                : 'text-cyan-400 hover:bg-cyan-950/50'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>तरीका 2: असली .APK फाइल बनाएँ</span>
          </button>
        </div>

        {/* TAB 1: INSTANT INSTALL (PWA / WebAPK) */}
        {activeTab === 'instant' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-black/80 border border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.25)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-cyan-300 stroke-[2.5]" />
                  <span className="font-orbitron font-extrabold text-xs sm:text-sm text-white tracking-wider">
                    Chrome WebAPK (बिना कंप्यूटर के 10 सेकंड में)
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400">
                  NO URL BAR
                </span>
              </div>

              <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
                Android 11 में Chrome अपने आप एक आधिकारिक <strong>WebAPK</strong> बना देता है। यह आपके फोन में सीधे ऐप की तरह इंस्टॉल हो जाएगा और <strong>ऊपर कोई Chrome या URL बार नहीं दिखेगा!</strong>
              </p>

              {isInstalled ? (
                <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono-tech">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AURA ऐप इस फोन में पहले से इंस्टॉल है!</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-extrabold font-orbitron tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(0,243,255,0.7)] flex items-center justify-center space-x-2 cursor-pointer hover:brightness-110 active:scale-95"
                >
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                  <span>📲 अभी फोन में इंस्टॉल करें (INSTALL AS APP)</span>
                </button>
              ) : null}

              <div className="p-3 rounded-lg bg-black/80 border border-cyan-500/40 text-xs text-cyan-200 space-y-2">
                <div className="font-bold text-emerald-300 font-orbitron text-xs">
                  📋 फोन में 2 स्टेप्स में इंस्टॉल करने का तरीका:
                </div>
                <div className="space-y-1 font-sans text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 font-mono-tech text-cyan-300 text-[11px]">
                      1
                    </span>
                    <span>
                      अपने Android 11 फोन में Chrome खोलें और ऊपर दाएँ <strong>3 डॉट्स (⋮)</strong> दबाएँ।
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 font-mono-tech text-cyan-300 text-[11px]">
                      2
                    </span>
                    <span>
                      मेन्यू में <strong>"Install app"</strong> या <strong>"Add to Home screen" (होम स्क्रीन में जोड़ें)</strong> पर क्लिक करें।
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-300 font-mono-tech pt-1 border-t border-cyan-500/20">
                  ✓ ऐप आपके होम स्क्रीन पर आ जाएगी। सारी आवाजें (Aoede Human Voice), माइक, 3D अवतार और आयरन मैन HUD बिना किसी ब्राउज़र बार के फुलस्क्रीन चलेगा!
                </div>
              </div>
            </div>

            {/* Direct Link & QR Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-black/70 border border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold mb-1">
                    फोन के Chrome में खोलने का लिंक:
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={primaryUrl}
                    className="w-full bg-cyan-950/40 border border-cyan-500/30 rounded px-2 py-1 text-xs font-mono-tech text-cyan-200 truncate outline-none select-all"
                  />
                </div>
                <button
                  onClick={() => handleCopyLink(primaryUrl, 'link')}
                  className={`mt-2 w-full py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    copiedType === 'link'
                      ? 'bg-emerald-500 text-black shadow-[0_0_10px_#00ffc4]'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-black'
                  }`}
                >
                  {copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'link' ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-cyan-500/30 flex items-center gap-3">
                <img
                  src={qrCodeUrl}
                  alt="Scan QR code"
                  className="w-16 h-16 object-contain rounded border border-cyan-400/40 flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-[11px] space-y-1">
                  <div className="font-bold text-cyan-300">कैमरे से स्कैन करें</div>
                  <div className="text-cyan-200/80">
                    फोन का कैमरा इस QR पर रखें, लिंक तुरंत खुल जाएगा।
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPORT & REAL APK GUIDE */}
        {activeTab === 'export_apk' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-black/80 border border-emerald-400 shadow-[0_0_20px_rgba(0,255,196,0.3)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderArchive className="w-5 h-5 text-emerald-300 stroke-[2.5]" />
                  <span className="font-orbitron font-extrabold text-xs sm:text-sm text-white tracking-wider">
                    कम्पलीट प्रोजेक्ट एक्सपोर्ट (520 KB .ZIP)
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-400 font-bold">
                  READY TO BUILD
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                इस ज़िप पैकेज में आपका पूरा ओरिजिनल कोड (3D अवतार, Aoede हिन्दी वॉइस, चैट, माइक, विजन, और <strong>Capacitor + GitHub Actions</strong> की रेडीमेड फाइलें) शामिल हैं।
              </p>

              <a
                href={sourceZipUrl}
                download="AURA_AI_Source_Export.zip"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-extrabold font-orbitron tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(0,255,196,0.7)] flex items-center justify-center space-x-2 hover:brightness-110 active:scale-95"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>📥 प्रोजेक्ट ZIP डाउनलोड करें (DOWNLOAD SOURCE ZIP)</span>
              </a>
            </div>

            {/* Step-by-Step GitHub Actions 100% Free APK Builder */}
            <div className="p-3 rounded-xl bg-black/80 border border-cyan-500/40 text-xs space-y-2.5">
              <div className="font-bold text-cyan-300 font-orbitron flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>असली .APK (20 MB) पाने का सबसे आसान तरीका (GitHub Actions):</span>
              </div>

              <div className="space-y-1.5 font-sans text-xs text-cyan-100/90 leading-relaxed">
                <div className="flex items-start space-x-2">
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono-tech text-[10px]">Step 1</span>
                  <span>ऊपर दिए गए हरे बटन से <strong>AURA_AI_Source_Export.zip</strong> डाउनलोड करें।</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono-tech text-[10px]">Step 2</span>
                  <span><strong>GitHub.com</strong> पर एक नया फ्री Repository बनाएँ और इस ज़िप की फाइलों को अपलोड कर दें।</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono-tech text-[10px]">Step 3</span>
                  <span>
                    हमने पहले से <code className="text-emerald-400 font-mono">.github/workflows/build-apk.yml</code> सेट कर दिया है। GitHub अपने क्लाउड Android SDK पर इसे 2 मिनट में कम्पाइल कर देगा और <strong>"Actions &gt; Artifacts"</strong> में असली <strong>AURA_AI_Android11_Installable_APK</strong> दे देगा!
                  </span>
                </div>
              </div>

              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono-tech">
                💡 यदि आपके पास लैपटॉप/कंप्यूटर है, तो Android Studio में <code className="text-white">npx cap open android</code> चलाकर सीधे Run कर सकते हैं।
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono-tech text-cyan-500">
          <span>DEVELOPED BY: PRINCE SHARMA</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 font-bold"
          >
            बंद करें (CLOSE)
          </button>
        </div>
      </div>
    </div>
  );
};
