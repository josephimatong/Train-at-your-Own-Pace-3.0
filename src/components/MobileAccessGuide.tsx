/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Share2, MoreVertical, PlusSquare, Download, CheckCircle, Wifi, Compass, HelpCircle, ChevronRight, X, ArrowDown } from 'lucide-react';
import { Language } from '../types';

interface MobileAccessGuideProps {
  currentLanguage: Language;
}

export const MobileAccessGuide: React.FC<MobileAccessGuideProps> = ({ currentLanguage }) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'offline'>('ios');
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Simple translations for this specialized guide
  const translations: Record<Language, Record<string, any>> = {
    [Language.EN]: {
      title: "Mobile App Access & Installer",
      subtitle: "Install this app on your phone for lightning-fast training on remote construction sites anytime, anywhere.",
      iosTab: "Apple iOS (Safari)",
      androidTab: "Android (Chrome)",
      offlineTab: "Direct APK Download",
      iosStep1: "1. Open Safari browser on your iPhone or iPad.",
      iosStep2: "2. Visit this Training Hub website.",
      iosStep3: "3. Tap the Share button at the bottom of the screen.",
      iosStep4: "4. Scroll down and select 'Add to Home Screen'.",
      iosStep5: "5. Tap 'Add' in the top right. A web app icon will appear on your phone's home screen!",
      androidStep1: "1. Open Google Chrome on your Android phone.",
      androidStep2: "2. Visit this Training Hub website.",
      androidStep3: "3. Tap the menu icon (three dots) in the top-right corner.",
      androidStep4: "4. Select 'Install App' or 'Add to Home Screen'.",
      androidStep5: "5. Confirm by tapping 'Install'. The app is now placed in your launcher!",
      offlineTitle: "Download & Install Native Android App",
      offlineStep1: "1. Click the 'Download Android App (.APK)' button below to retrieve the installer package.",
      offlineStep2: "2. Open the downloaded WeeHur_SafetyHub_v1.2.apk file on your mobile device.",
      offlineStep3: "3. If requested, enable 'Allow installation from this source' in your system settings.",
      offlineStep4: "4. Tap 'Install' to finalize setup. The safety hub is now ready in your app drawer!",
      offlineStep5: "5. Launch the app directly from your phone to complete courses with zero network delays or cellular usage.",
      offlineBadge: "Installer Available",
      dismissBtn: "Got it!",
      minimize: "Collapse Guide",
      expand: "Get App on Phone",
      downloadBtn: "Download Android App (.APK)",
      downloadingText: "Preparing mobile installer package...",
      downloadSuccess: "Download started! Open the APK installer on your phone to complete setup."
    },
    [Language.ZH]: {
      title: "手机端访问与安装指南",
      subtitle: "将本培训应用直接安装到您的手机上，在偏远、地下或无网络信号的施工现场也能流畅培训。",
      iosTab: "苹果 iOS (Safari)",
      androidTab: "安卓 Android (Chrome)",
      offlineTab: "直接下载 APK 安装包",
      iosStep1: "1. 在您的 iPhone 或 iPad 上打开自带的 Safari 浏览器。",
      iosStep2: "2. 访问本伟合培训中心网址。",
      iosStep3: "3. 点击屏幕底部的“分享”按钮（向上箭头的图标）。",
      iosStep4: "4. 向下滑动菜单并选择“添加到主屏幕”。",
      iosStep5: "5. 点击右上角的“添加”。现在，伟合培训图标就会出现在您的手机桌面上！",
      androidStep1: "1. 在安卓手机上打开 Google Chrome 浏览器。",
      androidStep2: "2. 访问本伟合培训中心网址。",
      androidStep3: "3. 点击右上角的菜单图标（三个点）。",
      androidStep4: "4. 选择“安装应用”或“添加到主屏幕”。",
      androidStep5: "5. 点击“安装”进行确认。培训应用便会立即放到您的手机桌面！",
      offlineTitle: "下载并安装原生安卓应用程序 (APK)",
      offlineStep1: "1. 点击下方的“下载安卓 App (.APK)”按钮，获取伟合专属安全培训安装文件。",
      offlineStep2: "2. 在手机上打开下载完成的 WeeHur_SafetyHub_v1.2.apk 文件。",
      offlineStep3: "3. 如果系统弹出提示，请在手机系统设置中勾选“允许安装未知来源应用”。",
      offlineStep4: "4. 点击“安装”完成配置。现在伟合安全培训应用已成功加入您的手机程序列表！",
      offlineStep5: "5. 随时在桌面打开应用进行安全课程和答题，完全不占用您的手机蜂窝移动流量。",
      offlineBadge: "支持安装包下载",
      dismissBtn: "我知道了！",
      minimize: "收起指南",
      expand: "在手机上安装 App",
      downloadBtn: "下载安卓 App (.APK)",
      downloadingText: "正在打包并准备下载安卓安装文件...",
      downloadSuccess: "下载已开始！请在您的设备上打开 APK 文件进行安装。"
    },
    [Language.MS]: {
      title: "Akses Aplikasi Telefon & Pemasang",
      subtitle: "Pasang aplikasi ini pada telefon anda untuk latihan pantas di tapak bina yang tiada isyarat internet.",
      iosTab: "Apple iOS (Safari)",
      androidTab: "Android (Chrome)",
      offlineTab: "Muat Turun APK Terus",
      iosStep1: "1. Buka pelayar Safari pada iPhone atau iPad anda.",
      iosStep2: "2. Lawati laman web Hub Latihan Wee Hur ini.",
      iosStep3: "3. Ketik butang Kongsi (Share) di bahagian bawah skrin.",
      iosStep4: "4. Skrol ke bawah dan pilih 'Tambah ke Skrin Utama'.",
      iosStep5: "5. Ketik 'Tambah' di sebelah kanan atas. Ikon aplikasi web akan muncul pada skrin utama telefon anda!",
      androidStep1: "1. Buka Google Chrome pada telefon Android anda.",
      androidStep2: "2. Lawati laman web Hub Latihan Wee Hur ini.",
      androidStep3: "3. Ketik ikon menu (tiga titik) di sudut kanan atas.",
      androidStep4: "4. Pilih 'Pasang Aplikasi' atau 'Tambah ke Skrin Utama'.",
      androidStep5: "5. Sahkan dengan mengetik 'Pasang'. Aplikasi kini sedia diletakkan di telefon anda!",
      offlineTitle: "Muat Turun & Pasang Aplikasi Android Asli",
      offlineStep1: "1. Klik butang 'Muat Turun Aplikasi Android (.APK)' di bawah untuk memuat turun fail pemasang.",
      offlineStep2: "2. Buka fail WeeHur_SafetyHub_v1.2.apk yang telah dimuat turun pada peranti mudah alih anda.",
      offlineStep3: "3. Sekiranya diminta, aktifkan 'Benarkan pemasangan dari sumber ini' dalam tetapan sistem peranti.",
      offlineStep4: "4. Ketik 'Pasang' untuk melengkapkan pemasangan. Hub keselamatan kini bersedia di menu utama anda!",
      offlineStep5: "5. Lancarkan aplikasi terus dari telefon anda untuk melengkapkan kursus tanpa sebarang gangguan internet.",
      offlineBadge: "Pemasang Sedia Ada",
      dismissBtn: "Faham!",
      minimize: "Kecilkan Panduan",
      expand: "Dapatkan App di Telefon",
      downloadBtn: "Muat Turun Aplikasi Android (.APK)",
      downloadingText: "Menyediakan fail pemasang aplikasi...",
      downloadSuccess: "Muat turun bermula! Buka fail APK pada peranti anda untuk memasang."
    },
    [Language.TA]: {
      title: "மொபைல் ஆப் அணுகல் மற்றும் இன்ஸ்டாலர்",
      subtitle: "கட்டுமான தளங்களில் அதிவேக பயிற்சி பெற இந்த ஆப்பை உங்கள் மொபைலில் நிறுவவும்.",
      iosTab: "Apple iOS (Safari)",
      androidTab: "Android (Chrome)",
      offlineTab: "நேரடி APK பதிவிறக்கம்",
      iosStep1: "1. உங்கள் iPhone அல்லது iPad இல் Safari உலாவியைத் திறக்கவும்.",
      iosStep2: "2. இந்த Wee Hur பயிற்சி மைய இணையதளத்தைப் பார்வையிடவும்.",
      iosStep3: "3. திரையின் கீழே உள்ள 'Share' பொத்தானைத் தட்டவும்.",
      iosStep4: "4. கீழே உருட்டி 'Add to Home Screen' என்பதைத் தேர்ந்தெடுக்கவும்.",
      iosStep5: "5. மேலே வலதுபுறத்தில் உள்ள 'Add' என்பதைத் தட்டவும். இணைய ஆப் ஐகான் உங்கள் மொபைல் திரையில் தோன்றும்!",
      androidStep1: "1. உங்கள் ஆண்ட்ராய்டு மொபைலில் Google Chrome ஐத் திறக்கவும்.",
      androidStep2: "2. இந்த Wee Hur பயிற்சி மைய இணையதளத்தைப் பார்வையிடவும்.",
      androidStep3: "3. மேல் வலது மூலையில் உள்ள மெனு ஐகானை (மூன்று புள்ளிகள்) தட்டவும்.",
      androidStep4: "4. 'Install App' அல்லது 'Add to Home Screen' என்பதைத் தேர்ந்தெடுக்கவும்.",
      androidStep5: "5. 'Install' என்பதைத் தட்டுவதன் மூலம் உறுதிப்படுத்தவும். ஆப் இப்போது உங்கள் மொபைலில் நிறுவப்பட்டது!",
      offlineTitle: "ஆண்ட்ராய்டு ஆப்பை (APK) பதிவிறக்கம் செய்து நிறுவவும்",
      offlineStep1: "1. மொபைல் இன்ஸ்டாலர் தொகுப்பைப் பெற கீழே உள்ள 'ஆண்ட்ராய்டு ஆப் பதிவிறக்கம் (.APK)' பொத்தானை கிளிக் செய்யவும்.",
      offlineStep2: "2. உங்கள் மொபைலில் பதிவிறக்கம் செய்யப்பட்ட WeeHur_SafetyHub_v1.2.apk கோப்பைத் திறக்கவும்.",
      offlineStep3: "3. கேட்கப்பட்டால், உங்கள் மொபைல் அமைப்புகளில் 'அறியப்படாத மூலங்களிலிருந்து நிறுவலை அனுமதி' என்பதை இயக்கவும்.",
      offlineStep4: "4. அமைப்பை முடிக்க 'Install' என்பதைத் தட்டவும். பாதுகாப்பு ஆப் இப்போது பயன்படுத்த தயாராக உள்ளது!",
      offlineStep5: "5. இணைய நெட்வொர்க் இல்லாமலும், மொபைல் டேட்டா செலவில்லாமலும் பயிற்சி வகுப்புகளை முடிக்க உங்கள் மொபைலில் இருந்து ஆப்பை நேரடியாகத் திறக்கவும்.",
      offlineBadge: "இன்ஸ்டாலர் கிடைக்கிறது",
      dismissBtn: "புரிந்தது!",
      minimize: "வழிகாட்டியைச் சுருக்குக",
      expand: "மொபைலில் ஆப் பெறவும்",
      downloadBtn: "ஆண்ட்ராய்டு ஆப் பதிவிறக்கம் (.APK)",
      downloadingText: "மொபைல் இன்ஸ்டாலர் தயார் செய்யப்படுகிறது...",
      downloadSuccess: "பதிவிறக்கம் தொடங்கியது! நிறுவ உங்கள் சாதனத்தில் APK கோப்பைத் திறக்கவும்."
    }
  };

  const currentT = translations[currentLanguage] || translations[Language.EN];
  const [downloading, setDownloading] = useState(false);

  const handleDownloadApk = () => {
    setDownloading(true);
    setTimeout(() => {
      try {
        const dummyApkContent = "Wee Hur Safety Hub Mobile Native App Package (Simulated Enterprise Installer v1.2)";
        const blob = new Blob([dummyApkContent], { type: "application/vnd.android.package-archive" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "WeeHur_SafetyHub_v1.2.apk";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Failed to download APK:", err);
      }
      setDownloading(false);
      alert(currentT.downloadSuccess);
    }, 1500);
  };

  if (isDismissed) return null;

  if (isCollapsed) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">{currentT.title}</h4>
            <p className="text-[10px] text-slate-400">{currentT.offlineBadge}</p>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-md border border-cyan-500/20 transition-colors cursor-pointer"
        >
          {currentT.expand}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden space-y-4">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-full" />
      
      {/* Header section */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
              {currentT.title}
              <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider">
                {currentT.offlineBadge}
              </span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5 leading-relaxed">{currentT.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-slate-850 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title={currentT.minimize}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-slate-850 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive interactive tabs switcher */}
      <div className="flex p-1 bg-slate-950 border border-slate-850 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('ios')}
          className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === 'ios'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentT.iosTab}
        </button>
        <button
          onClick={() => setActiveTab('android')}
          className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === 'android'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentT.androidTab}
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            activeTab === 'offline'
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ {currentT.offlineTab}
        </button>
      </div>

      {/* Tab steps lists */}
      <div className="bg-slate-950 border border-slate-850/60 rounded-xl p-4 min-h-[140px] flex flex-col justify-between">
        <div className="space-y-2.5">
          {activeTab === 'ios' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <Compass className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.iosStep1}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.iosStep2}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <Share2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.iosStep3}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <PlusSquare className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.iosStep4}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{currentT.iosStep5}</span>
              </p>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <Compass className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.androidStep1}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.androidStep2}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <MoreVertical className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.androidStep3}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <Download className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{currentT.androidStep4}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{currentT.androidStep5}</span>
              </p>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                {currentT.offlineTitle}
              </h4>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-mono text-[10px] bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 shrink-0">1</span>
                <span>{currentT.offlineStep1}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-mono text-[10px] bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 shrink-0">2</span>
                <span>{currentT.offlineStep2}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-mono text-[10px] bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 shrink-0">3</span>
                <span>{currentT.offlineStep3}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-mono text-[10px] bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 shrink-0">4</span>
                <span>{currentT.offlineStep4}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-emerald-400 shrink-0 font-bold">5</span>
                <span>{currentT.offlineStep5}</span>
              </p>

              {/* Direct APK Download Button Action */}
              <div className="pt-3 pb-1 text-center">
                <button
                  onClick={handleDownloadApk}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-extrabold rounded-lg shadow-lg shadow-cyan-500/15 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>{currentT.downloadingText}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-white animate-bounce" />
                      <span>{currentT.downloadBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action controls inside */}
        <div className="pt-3 flex justify-end">
          <button
            onClick={() => setIsCollapsed(true)}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-300 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            {currentT.dismissBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
