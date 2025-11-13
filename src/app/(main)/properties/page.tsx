export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import HeroSection from "@/components/HomeComponents/HeroSection";
import ListingsGrid from "@/components/HomeComponents/ListingsGrid";
import { JSX } from "react";
import { House, Plus} from "lucide-react";
import Link from "next/link";

// تعریف تایپ مطابق Prisma schema
interface Listing {
  id: number;
  title: string;
  description: string;
  price: bigint | null; // تغییر از number به bigint
  images: string[];
  location: string;
  propertyType?: string | null;
  dealType?: string | null;
  rentPrice?: bigint | null; // تغییر از number به bigint
  depositPrice?: bigint | null; // تغییر از number به bigint
  area?: number | null;
  roomCount?: number | null;
  bathroomCount?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  yearBuilt?: number | null;
  parking?: boolean;
  elevator?: boolean;
  storage?: boolean;
  furnished?: boolean;
  status?: string;
  ownerId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
}

// تابع کمکی برای تبدیل bigint به number
function convertBigIntToNumber(value: bigint | null): number | null {
  if (value === null) return null;
  return Number(value);
}

// تابع برای دریافت املاک
async function getListings(): Promise<Listing[]> {
  try {
    console.log("Fetching listings from database...");
    
    const listings = await prisma.property.findMany({
      where: {
        status: "فعال"
      },
      orderBy: [
        { createdAt: "desc" },
      ],
      take: 18
    });

    console.log(`Found ${listings.length} listings`);
    
    // تبدیل bigint به number برای سازگاری
    return listings.map(listing => ({
      ...listing,
      price: convertBigIntToNumber(listing.price),
      rentPrice: convertBigIntToNumber(listing.rentPrice),
      depositPrice: convertBigIntToNumber(listing.depositPrice)
    }));

  } catch (error) {
    console.error("Error fetching listings:", error);
    
    // نمایش جزئیات بیشتر خطا
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    
    return [];
  }
}

// تابع برای دریافت آمار
async function getStats() {
  try {
    const [totalListings, activeListings] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({
        where: { status: "فعال" }
      })
    ]);

    return {
      totalListings,
      activeListings,
      featuredListings: Math.floor(activeListings * 0.3) // تقریب برای املاک ویژه
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalListings: 0,
      activeListings: 0,
      featuredListings: 0
    };
  }
}

export default async function Properties(): Promise<JSX.Element> {
  let listings: Listing[] = [];
  let stats = {
    totalListings: 0,
    activeListings: 0,
    featuredListings: 0
  };

  try {
    [listings, stats] = await Promise.all([
      getListings(),
      getStats()
    ]);
  } catch (error) {
    console.error("Error in Properties page:", error);
  }

  // کامپوننت برای نمایش وضعیت خالی
  const EmptyState = () => (
    <section className="w-full mx-auto px-4 py-16">
      <div className="text-center">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#FEC360] to-amber-500 flex items-center justify-center shadow-lg">
            <House className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            هنوز ملکی ثبت نشده است
          </h2>

          <p className="text-gray-600 text-lg mb-8 leading-8 max-w-md mx-auto">
            در حال حاضر هیچ ملک فعالی در سیستم وجود ندارد.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FEC360] to-amber-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-[#FEC360] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              ثبت اولین ملک
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <HeroSection listingsCount={stats.activeListings} />

      {/* Main Content */}
      <main className="w-full mx-auto px-4 py-8">
        {/* لیست املاک یا Empty State */}
        {listings.length > 0 ? (
          <>
            <ListingsGrid listings={listings} />
          </>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}