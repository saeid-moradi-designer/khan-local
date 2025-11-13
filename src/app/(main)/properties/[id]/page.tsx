import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Home,
  Ruler,
  Bed,
  Bath,
  Car,
  Building,
  Warehouse,
  Sofa,
  Calendar,
  User,
  Mail,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Eye,
} from "lucide-react";
import prisma from "@/lib/prisma";

// تابع برای ساخت مسیر کامل عکس
const getImagePath = (imageName: string | null) => {
  if (!imageName) return null;

  // اگر عکس از URL کامل باشد
  if (imageName.startsWith("http")) {
    return imageName;
  }

  // اگر فقط نام فایل در دیتابیس ذخیره شده باشد
  return `/images/${imageName}`;
};

// کامپوننت برای نمایش گالری تصاویر
function ImageGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/images/placeholder-property.jpg"
            alt="بدون تصویر"
            width={200}
            height={200}
            className="mx-auto opacity-50"
          />
          <span className="text-gray-400 text-lg mt-4 block">بدون تصویر</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* تصویر اصلی */}
      <div className="lg:col-span-3 relative h-80 sm:h-96 rounded-2xl overflow-hidden">
        <Image
          src={getImagePath(images[0]) || "/images/placeholder-property.jpg"}
          alt="تصویر اصلی ملک"
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* تصاویر کوچک */}
      {images.length > 1 && (
        <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative h-36 rounded-xl overflow-hidden group"
            >
              <Image
                src={getImagePath(image) || "/images/placeholder-property.jpg"}
                alt={`تصویر ${index + 2}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// کامپوننت برای نمایش مشخصات
function PropertyFeature({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number | null;
}) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gradient-to-br from-[#FEC360] to-amber-500 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="font-bold text-gray-800 text-lg">{value}</p>
      </div>
    </div>
  );
}

// کامپوننت برای نمایش قیمت
function PriceDisplay({
  dealType,
  price,
  depositPrice,
  rentPrice,
}: {
  dealType: string | null;
  price: number | null;
  depositPrice: number | null;
  rentPrice: number | null;
}) {
  const formatPrice = (price: number | null) => {
    if (!price) return "توافقی";
    return price.toLocaleString("fa-IR") + " تومان";
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl text-white p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">قیمت</h2>
        <div className="bg-[#FEC360] text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
          {dealType || "نامشخص"}
        </div>
      </div>

      <div className="space-y-3">
        {dealType === "فروش" && price && (
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-bold text-[#FEC360]">
              {formatPrice(price)}
            </p>
            <p className="text-gray-300 text-sm mt-1">قیمت فروش</p>
          </div>
        )}

        {dealType === "رهن و اجاره" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-[#FEC360]">
                {formatPrice(depositPrice)}
              </p>
              <p className="text-gray-300 text-sm mt-1">ودیعه</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#FEC360]">
                {formatPrice(rentPrice)}
              </p>
              <p className="text-gray-300 text-sm mt-1">اجاره ماهانه</p>
            </div>
          </div>
        )}

        {dealType === "پیش فروش" && price && (
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-bold text-[#FEC360]">
              {formatPrice(price)}
            </p>
            <p className="text-gray-300 text-sm mt-1">قیمت پیش فروش</p>
          </div>
        )}

        {!price && !depositPrice && !rentPrice && (
          <p className="text-center text-gray-300 text-lg">قیمت توافقی</p>
        )}
      </div>
    </div>
  );
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let listing = null;
  let error = null;

  try {
    const { id } = await params;
    const parsedId = parseInt(id?.trim(), 10);

    if (isNaN(parsedId)) {
      return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              شناسه نامعتبر
            </h2>
            <p className="text-gray-600 mb-4">شناسه ملک معتبر نیست</p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت به لیست املاک
            </Link>
          </div>
        </div>
      );
    }

    listing = await prisma.property.findUnique({
      where: { id: parsedId },
      include: {
        owner: {
          select: { name: true, email: true, phone: true },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching listing:", err);
    error = "خطا در بارگذاری اطلاعات";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            خطا در دریافت اطلاعات
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست املاک
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ملک یافت نشد</h2>
          <p className="text-gray-600 mb-4">ملکی با این شناسه پیدا نشد</p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست املاک
          </Link>
        </div>
      </div>
    );
  }

  const amenities = [
    { condition: listing.parking, label: "پارکینگ", icon: Car },
    { condition: listing.elevator, label: "آسانسور", icon: Building },
    { condition: listing.storage, label: "انباری", icon: Warehouse },
    { condition: listing.furnished, label: "مبله", icon: Sofa },
  ].filter((amenity) => amenity.condition);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* هدر */}
      <div className="mt-4 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/properties"
              className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">بازگشت به لیست املاک</p>
                <p className="text-sm text-gray-500">مشاهده سایر آگهی‌ها</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ستون سمت چپ */}
          <div className="lg:col-span-2 space-y-6">
            {/* گالری تصاویر */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <ImageGallery images={listing.images || []} />
            </div>

            {/* اطلاعات اصلی */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.propertyType || "نامشخص"}
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.dealType || "نامشخص"}
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {listing.title || "بدون عنوان"}
                </h1>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location || "آدرس ثبت نشده"}</span>
                </div>

                {listing.description && (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-8 text-lg">
                      {listing.description}
                    </p>
                  </div>
                )}
              </div>

              {/* مشخصات فنی */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <PropertyFeature
                  icon={Ruler}
                  label="متراژ"
                  value={listing.area ? `${listing.area} متر` : null}
                />
                <PropertyFeature
                  icon={Bed}
                  label="تعداد اتاق"
                  value={listing.roomCount}
                />
                <PropertyFeature
                  icon={Bath}
                  label="تعداد حمام"
                  value={listing.bathroomCount}
                />
                <PropertyFeature
                  icon={Building}
                  label="طبقه"
                  value={listing.floor}
                />
                <PropertyFeature
                  icon={Calendar}
                  label="سال ساخت"
                  value={listing.yearBuilt}
                />
                <PropertyFeature
                  icon={Building}
                  label="کل طبقات"
                  value={listing.totalFloors}
                />
              </div>

              {/* امکانات */}
              {amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    امکانات
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {amenities.map((amenity, index) => {
                      const Icon = amenity.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 rounded-xl p-3"
                        >
                          <Icon className="w-4 h-4 text-[#FEC360]" />
                          <span className="text-gray-700 font-medium">
                            {amenity.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ستون سمت راست */}
          <div className="space-y-6">
            {/* قیمت */}
            <PriceDisplay
              dealType={listing.dealType}
              price={listing.price}
              depositPrice={listing.depositPrice}
              rentPrice={listing.rentPrice}
            />

            {/* اطلاعات مالک
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                اطلاعات مالک
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">نام مالک</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {listing.owner?.name || "نامشخص"}
                  </p>
                </div>

                {listing.owner?.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{listing.owner.email}</span>
                  </div>
                )}

                {listing.owner?.phone && (
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition mt-4">
                    <Phone className="w-4 h-4" />
                    تماس با مالک
                  </button>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      ثبت شده در{" "}
                      {new Date(listing.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* دکمه‌های اقدام */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition">
                  <Phone className="w-4 h-4" />
                  درخواست بازدید
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition">
                  <Share2 className="w-4 h-4" />
                  اشتراک‌گذاری
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
