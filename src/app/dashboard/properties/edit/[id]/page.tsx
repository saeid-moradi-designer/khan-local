"use client";

import { use, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Save, 
  X, 
  Home, 
  Upload, 
  Image as ImageIcon,
  Building,
  DollarSign,
  MapPin,
  Ruler,
  Bath,
  Bed,
  Layers,
  Calendar,
  Trash2
} from "lucide-react";

interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  dealType: string;
  price: number | null;
  rentPrice: number | null;
  depositPrice: number | null;
  area: number;
  roomCount: number | null;
  bathroomCount: number | null;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  parking: boolean;
  elevator: boolean;
  storage: boolean;
  furnished: boolean;
  status: string;
  location: string;
  images: string[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

// مقادیر فارسی برای ذخیره در دیتابیس
const PROPERTY_TYPES = [
  { value: "آپارتمان", label: "آپارتمان", icon: Building },
  { value: "ویلا", label: "ویلا", icon: Home },
  { value: "دفتر کار", label: "دفتر کار", icon: Building },
  { value: "مغازه", label: "مغازه", icon: Building },
  { value: "زمین", label: "زمین", icon: MapPin }
];

const DEAL_TYPES = [
  { value: "فروش", label: "فروش" },
  { value: "رهن و اجاره", label: "رهن و اجاره" },
  { value: "پیش فروش", label: "پیش فروش" }
];

const STATUS_TYPES = [
  { value: "فعال", label: "فعال" },
  { value: "غیرفعال", label: "غیرفعال" },
  { value: "فروخته شده", label: "فروخته شده" },
  { value: "اجاره داده شده", label: "اجاره داده شده" }
];

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات ملک");
        const data = await res.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const handleImageUpload = async (files: FileList) => {
    setImageUploading(true);
    const newImages = [...(property?.images || [])];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (res.ok) {
          const result = await res.json();
          newImages.push(result.fileName);
        }
      }
      
      setProperty(prev => prev ? { ...prev, images: newImages } : null);
    } catch (error) {
      setError("خطا در آپلود تصاویر");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    if (!property) return;
    const newImages = property.images.filter((_, i) => i !== index);
    setProperty(prev => prev ? { ...prev, images: newImages } : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });

      if (!res.ok) throw new Error("خطا در ذخیره تغییرات");
      
      router.push("/dashboard/properties");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Property, value: any) => {
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNumberChange = (field: keyof Property, value: string) => {
    handleChange(field, value === "" ? null : parseFloat(value));
  };

  const handleIntChange = (field: keyof Property, value: string) => {
    handleChange(field, value === "" ? null : parseInt(value));
  };

  // تابع جدید برای مدیریت ورودی قیمت‌ها
  const handlePriceChange = (field: keyof Property, value: string) => {
    // حذف همه کاراکترهای غیرعددی به جز نقطه
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue === '') {
      handleChange(field, null);
    } else {
      // تبدیل به عدد
      const numberValue = parseInt(numericValue);
      handleChange(field, isNaN(numberValue) ? null : numberValue);
    }
  };

  // تابع برای نمایش قیمت با فرمت فارسی
  const formatPrice = (price: number | null) => {
    if (!price) return "";
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">خطا در دریافت اطلاعات</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard/properties")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            بازگشت به لیست املاک
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">ملک یافت نشد</h2>
          <button
            onClick={() => router.push("/dashboard/properties")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            بازگشت به لیست املاک
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ویرایش ملک</h1>
                <p className="text-gray-500 text-sm">مدیریت و ویرایش اطلاعات ملک</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/properties")}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              انصراف
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اطلاعات اصلی */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              اطلاعات اصلی ملک
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان ملک *
                </label>
                <input
                  type="text"
                  value={property.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="عنوان جذاب برای ملک"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  موقعیت مکانی *
                </label>
                <input
                  type="text"
                  value={property.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="آدرس یا منطقه ملک"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات *
                </label>
                <textarea
                  value={property.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px] resize-none"
                  placeholder="توضیحات کامل درباره ملک، امکانات و ویژگی‌های خاص..."
                  required
                />
              </div>
            </div>
          </div>

          {/* نوع ملک و معامله */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">نوع ملک و معامله</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  نوع ملک *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PROPERTY_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          property.propertyType === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="propertyType"
                          value={type.value}
                          checked={property.propertyType === type.value}
                          onChange={(e) => handleChange("propertyType", e.target.value)}
                          className="sr-only"
                          required
                        />
                        <Icon className="w-6 h-6 mb-2 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    نوع معامله *
                  </label>
                  <div className="flex gap-3">
                    {DEAL_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className={`flex-1 text-center py-3 px-4 border-2 rounded-xl cursor-pointer transition-all ${
                          property.dealType === type.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="dealType"
                          value={type.value}
                          checked={property.dealType === type.value}
                          onChange={(e) => handleChange("dealType", e.target.value)}
                          className="sr-only"
                          required
                        />
                        {type.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت ملک *
                  </label>
                  <select
                    value={property.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  >
                    {STATUS_TYPES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* قیمت‌ها */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              اطلاعات مالی
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت فروش (تومان)
                </label>
                <input
                  type="text"
                  value={formatPrice(property.price)}
                  onChange={(e) => handlePriceChange("price", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-left dir-ltr"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ودیعه (تومان)
                </label>
                <input
                  type="text"
                  value={formatPrice(property.depositPrice)}
                  onChange={(e) => handlePriceChange("depositPrice", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-left dir-ltr"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اجاره ماهانه (تومان)
                </label>
                <input
                  type="text"
                  value={formatPrice(property.rentPrice)}
                  onChange={(e) => handlePriceChange("rentPrice", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-left dir-ltr"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* مشخصات فنی */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">مشخصات فنی</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  مساحت *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={property.area}
                  onChange={(e) => handleNumberChange("area", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <span className="text-xs text-gray-500 mt-1">متر مربع</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  اتاق
                </label>
                <input
                  type="number"
                  value={property.roomCount || ""}
                  onChange={(e) => handleIntChange("roomCount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  حمام
                </label>
                <input
                  type="number"
                  value={property.bathroomCount || ""}
                  onChange={(e) => handleIntChange("bathroomCount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  طبقه
                </label>
                <input
                  type="number"
                  value={property.floor || ""}
                  onChange={(e) => handleIntChange("floor", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  کل طبقات
                </label>
                <input
                  type="number"
                  value={property.totalFloors || ""}
                  onChange={(e) => handleIntChange("totalFloors", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  سال ساخت
                </label>
                <input
                  type="number"
                  min="1300"
                  max="1403"
                  value={property.yearBuilt || ""}
                  onChange={(e) => handleIntChange("yearBuilt", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* امکانات */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">امکانات</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { field: "parking" as const, label: "پارکینگ" },
                { field: "elevator" as const, label: "آسانسور" },
                { field: "storage" as const, label: "انباری" },
                { field: "furnished" as const, label: "مبله" },
              ].map((item) => (
                <label
                  key={item.field}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    property[item.field]
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={property[item.field]}
                    onChange={(e) => handleChange(item.field, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* تصاویر */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              گالری تصاویر
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">برای آپلود تصاویر کلیک کنید</span>
                  <span className="text-sm text-gray-500">یا فایل‌ها را اینجا رها کنید</span>
                </label>
                {imageUploading && (
                  <div className="mt-2 text-blue-600 text-sm">در حال آپلود...</div>
                )}
              </div>

              {property.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border">
                        <Image
                          src={getImagePath(image) || "/images/placeholder-property.jpg"}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/images/placeholder-property.jpg";
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        تصویر {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* دکمه‌های اقدام */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  ذخیره تغییرات
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/dashboard/properties")}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-600 transition"
            >
              <X className="w-5 h-5" />
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}