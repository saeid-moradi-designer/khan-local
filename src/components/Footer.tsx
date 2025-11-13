"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SocialIcon } from "react-social-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pt-10">
        {/* Grid اصلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* 🔹 لوگو و توضیح */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 mb-4 group"
            >
              <Image
                src="/images/logo-gold.svg"
                alt="لوگو خان"
                width={48}
                height={48}
                className="h-20 w-20 md:h-23 md:w-23 object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              ارائه‌دهنده بهترین خدمات خرید، فروش و اجاره املاک در تهران
            </p>
          </div>

          {/* 🔹 لینک‌های سریع */}
          <div className="sm:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#FEC360] pb-2">
              لینک‌های سریع
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "صفحه اصلی" },
                { href: "/listings", label: "املاک" },
                { href: "/posts", label: "مقالات" },
                { href: "/about", label: "درباره ما" },
                { href: "/contact", label: "تماس با ما" }
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-[#FEC360] transition-colors duration-200 flex items-center gap-2 group py-1"
                  >
                    <span className="w-1 h-1 bg-[#FEC360] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🔹 اطلاعات تماس */}
          <div className="sm:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#FEC360] pb-2">
              تماس با ما
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-[#FEC360]/20 rounded-full flex items-center justify-center group-hover:bg-[#FEC360]/30 transition-colors flex-shrink-0">
                  <Phone size={16} className="text-[#FEC360]" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors break-keep">09020079101</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-[#FEC360]/20 rounded-full flex items-center justify-center group-hover:bg-[#FEC360]/30 transition-colors flex-shrink-0">
                  <Mail size={16} className="text-[#FEC360]" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors text-xs break-all">
                  Mehrabahmadifabilsara@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-[#FEC360]/20 rounded-full flex items-center justify-center group-hover:bg-[#FEC360]/30 transition-colors flex-shrink-0">
                  <MapPin size={16} className="text-[#FEC360]" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors">تهران</span>
              </li>
            </ul>
          </div>

          {/* 🔹 شبکه‌های اجتماعی */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#FEC360] pb-2">
              شبکه‌های اجتماعی
            </h3>
            <div className="flex gap-3 flex-wrap">
              {[
                { url: "https://whatsapp.com/channel/0029Vb6IPL8IyPtK5CV1or07", network: "whatsapp" },
                { url: "https://t.me/Khan_RealEstate_CustomersClub", network: "telegram" },
                { url: "https://facebook.com", network: "facebook" }
              ].map((social, index) => (
                <div key={index} className="group">
                  <SocialIcon 
                    url={social.url} 
                    style={{ height: 40, width: 40 }}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-xs">
              برای دریافت جدیدترین اخبار و املاک، ما را در شبکه‌های اجتماعی دنبال کنید
            </p>
          </div>
        </div>

        {/* 🔹 کپی‌رایت */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-center sm:text-right order-2 sm:order-1">
              © {new Date().getFullYear()} تمامی حقوق برای سامانه خان محفوظ است
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <span>طراحی شده توسط</span>
              <span className="bg-[#FEC360] text-gray-900 font-semibold px-3 py-1 rounded-full text-xs hover:bg-[#fed27a] transition-colors cursor-pointer">
                SaeidWeb@
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;