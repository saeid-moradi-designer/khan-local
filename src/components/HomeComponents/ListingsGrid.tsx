import Image from "next/image";
import Link from "next/link";
import { 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Ruler,
  Calendar,
  Car,
  Building
} from "lucide-react";

interface Listing {
  id: number | string;
  title: string;
  description: string;
  price: number | null;
  rentPrice?: number | null;
  depositPrice?: number | null;
  dealType?: string;
  propertyType?: string;
  images: string[];
  location?: string;
  area?: number;
  roomCount?: number;
  bathroomCount?: number;
  floor?: number;
  totalFloors?: number;
  parking?: boolean;
  elevator?: boolean;
  createdAt?: string;
  views?: number;
}

interface ListingsGridProps {
  listings: Listing[];
}

// تابع برای ساخت مسیر کامل عکس
const getImagePath = (imageName: string | null) => {
  if (!imageName) return null;
  
  // اگر فقط نام فایل در دیتابیس ذخیره شده باشد
  return `/images/${imageName}`;
};

// کامپوننت برای نمایش قیمت
function PriceDisplay({ 
  price, 
  rentPrice, 
  depositPrice, 
  dealType 
}: { 
  price: number | null; 
  rentPrice?: number | null; 
  depositPrice?: number | null; 
  dealType?: string; 
}) {
  const formatPrice = (price: number | null) => {
    if (!price) return "توافقی";
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} میلیارد`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} میلیون`;
    }
    return price.toLocaleString("fa-IR");
  };

  if (dealType === "رهن و اجاره") {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">ودیعه:</span>
          <span className="font-bold text-[#FEC360] text-sm">
            {formatPrice(depositPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">اجاره:</span>
          <span className="font-bold text-[#FEC360] text-sm">
            {formatPrice(rentPrice)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="font-bold text-[#FEC360] text-lg">
        {formatPrice(price)}
      </span>
      {price && price < 1000000000 && <span className="text-xs text-gray-500 mr-1">تومان</span>}
    </div>
  );
}

const ListingsGrid: React.FC<ListingsGridProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-gray-300"
        >
          {/* هدر کارت - تصویر و اکشن‌ها */}
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={getImagePath(listing.images[0]) || "/images/placeholder-property.jpg"}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges و تگ‌ها */}
            <div className="absolute top-4 left-4 flex gap-2">
              {listing.propertyType && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  {listing.propertyType}
                </span>
              )}
              {listing.dealType && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  {listing.dealType}
                </span>
              )}
            </div>
            
            {/* قیمت */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                <PriceDisplay 
                  price={listing.price}
                  rentPrice={listing.rentPrice}
                  depositPrice={listing.depositPrice}
                  dealType={listing.dealType}
                />
              </div>
            </div>
          </div>

          {/* محتوای کارت */}
          <div className="p-5">
            {/* عنوان و لوکیشن */}
            <div className="mb-4">
              <Link href={`/properties/${String(listing.id)}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                  {listing.title}
                </h3>
              </Link>
              
              {listing.location && (
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{listing.location}</span>
                </div>
              )}
            </div>

            {/* مشخصات فنی */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {listing.area && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Ruler className="w-4 h-4 text-blue-500" />
                  <span>{listing.area} متر</span>
                </div>
              )}
              
              {listing.roomCount && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Bed className="w-4 h-4 text-green-500" />
                  <span>{listing.roomCount} خواب</span>
                </div>
              )}
              
              {listing.bathroomCount && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Bath className="w-4 h-4 text-purple-500" />
                  <span>{listing.bathroomCount} حمام</span>
                </div>
              )}
            </div>

            {/* امکانات */}
            <div className="flex items-center gap-4 mb-4">
              {(listing.parking || listing.elevator) && (
                <div className="flex items-center gap-2">
                  {listing.parking && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Car className="w-3 h-3" />
                    </div>
                  )}
                  {listing.elevator && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Building className="w-3 h-3" />
                    </div>
                  )}
                </div>
              )}
              
              {listing.createdAt && (
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(listing.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              )}
              
              {listing.views && (
                <div className="flex items-center gap-1 text-gray-400 text-xs mr-auto">
                  <Eye className="w-3 h-3" />
                  <span>{listing.views.toLocaleString('fa-IR')}</span>
                </div>
              )}
            </div>

            {/* توضیحات */}
            {listing.description && (
              <p className="text-gray-600 text-sm leading-6 mb-4 line-clamp-2">
                {listing.description}
              </p>
            )}

            {/* دکمه جزئیات */}
            <Link
              href={`/properties/${String(listing.id)}`}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
            >
              <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              مشاهده جزئیات
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingsGrid;