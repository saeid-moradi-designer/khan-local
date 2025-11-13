// components/ShareButtons.tsx
"use client";

import { Facebook, Twitter, Linkedin, Copy, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  // متن پیش‌فرض برای اشتراک‌گذاری
  const defaultDescription = "مقاله‌ای جالب در زمینه املاک و سرمایه‌گذاری";
  
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `📖 ${title}\n\n${description || defaultDescription}\n\n🔗 ${url}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      const shareText = `📖 ${title}\n\n${description || defaultDescription}\n\n🔗 ${url}`;
      await navigator.clipboard.writeText(shareText);
      alert("لینک و متن پست کپی شد!");
    } catch (err) {
      console.error("خطا در کپی لینک:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'whatsapp') {
      // برای واتس‌اپ از لینک مستقیم استفاده می‌کنیم
      window.open(shareLinks[platform], "_blank");
    } else {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="flex gap-3">
      {/* واتس‌اپ - اولین دکمه */}
      <button 
        onClick={() => handleShare("whatsapp")}
        className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition shadow-lg hover:scale-105"
        title="اشتراک‌گذاری در واتس‌اپ"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      
      <button 
        onClick={() => handleShare("facebook")}
        className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition shadow-lg hover:scale-105"
        title="اشتراک‌گذاری در فیسبوک"
      >
        <Facebook className="w-5 h-5" />
      </button>
      <button 
        onClick={() => handleShare("twitter")}
        className="w-12 h-12 bg-blue-400 text-white rounded-2xl flex items-center justify-center hover:bg-blue-500 transition shadow-lg hover:scale-105"
        title="اشتراک‌گذاری در توییتر"
      >
        <Twitter className="w-5 h-5" />
      </button>
      <button 
        onClick={() => handleShare("linkedin")}
        className="w-12 h-12 bg-blue-700 text-white rounded-2xl flex items-center justify-center hover:bg-blue-800 transition shadow-lg hover:scale-105"
        title="اشتراک‌گذاری در لینکدین"
      >
        <Linkedin className="w-5 h-5" />
      </button>
      <button 
        onClick={copyToClipboard}
        className="w-12 h-12 bg-gray-600 text-white rounded-2xl flex items-center justify-center hover:bg-gray-700 transition shadow-lg hover:scale-105"
        title="کپی لینک و متن"
      >
        <Copy className="w-5 h-5" />
      </button>
    </div>
  );
}