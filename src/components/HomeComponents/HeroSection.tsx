import Link from "next/link";
import { 
  ChevronLeft, 
  Search, 
  Home, 
  MapPin, 
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';

interface HeroSectionProps {
  listingsCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ listingsCount }) => {
  return (
    <section className="relative w-full mx-auto bg-gradient-to-br from-[#2ABB9C] via-[#35A5C7] to-[#3EB3DA] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* محتوای اصلی با padding-bottom اضافه */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 pb-16 sm:pb-20 lg:pb-24">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">پیشرو در املاک تهران</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-[#FEC360] to-amber-300 bg-clip-text text-transparent">
              {listingsCount.toLocaleString('fa-IR')}
            </span>
            {" "}آگهی املاک در تهران
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
            <span className="font-semibold">خان</span>: ملک‌یابی هوشمند، 
            <span className="text-[#FEC360]"> مشاوره رایگان</span>، 
            اجاره و خرید مطمئن
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 relative w-full">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="جستجوی محله، منطقه یا نام پروژه..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/60 pr-10 pl-3 py-3 sm:py-4 text-base sm:text-lg"
                  />
                </div>
                <Link
                  href="/listings"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FEC360] to-amber-500 text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold hover:from-amber-400 hover:to-[#FEC360] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 justify-center text-sm sm:text-base"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  جستجو
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-4xl mx-auto px-2">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEC360]" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base">املاک متنوع</h3>
              <p className="text-white/80 text-xs sm:text-sm truncate">آپارتمان، ویلا، دفتر کار</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEC360]" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base">مشاوره رایگان</h3>
              <p className="text-white/80 text-xs sm:text-sm truncate">توسط متخصصین املاک</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white-20 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#FEC360]" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm sm:text-base">امنیت کامل</h3>
              <p className="text-white/80 text-xs sm:text-sm truncate">تضمین اصالت آگهی‌ها</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2">
          <Link
            href="/listings"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 group text-sm sm:text-base"
          >
            مشاهده همه آگهی‌ها
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/listings?dealType=فروش"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-xs sm:text-sm"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>آگهی‌های فروش</span>
            </Link>

            <Link
              href="/listings?dealType=رهن و اجاره"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-xs sm:text-sm"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>آگهی‌های اجاره</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Wave Divider - با موقعیت‌یابی بهتر */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-12 sm:h-16 lg:h-20 text-gray-50 fill-current"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;