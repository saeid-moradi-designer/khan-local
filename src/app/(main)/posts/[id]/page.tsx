import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Tag,
  MessageCircle
} from "lucide-react";
import prisma from "@/lib/prisma";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from 'next';

// تابع برای ساخت مسیر کامل عکس
const getImagePath = (imageName: string | null) => {
  if (!imageName) return null;
  return `/images/${imageName}`;
};

// تابع برای تولید URL کامل (برای localhost)
const getFullUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

// تابع برای تولید متادیتا
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  
  try {
    const post = await prisma.post.findUnique({
      where: { id: parsedId },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    if (!post) {
      return {
        title: 'پست یافت نشد',
        description: 'پستی با این شناسه پیدا نشد'
      };
    }

    const imageUrl = getImagePath(post.imageUrl) || '/images/placeholder-post.jpg';
    const fullImageUrl = getFullUrl(imageUrl);
    const postUrl = getFullUrl(`/posts/${post.id}`);

    return {
      title: post.title,
      description: post.content?.substring(0, 160) + '...',
      openGraph: {
        title: post.title,
        description: post.content?.substring(0, 160) + '...',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
        url: postUrl,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        authors: [post.author?.name || 'محراب احمدی'],
        section: post.category || 'املاک',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.content?.substring(0, 160) + '...',
        images: [fullImageUrl],
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch (error) {
    return {
      title: 'خطا در بارگذاری',
      description: 'خطا در بارگذاری اطلاعات پست'
    };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let post = null;
  let error = null;

  try {
    const { id } = await params;
    const parsedId = parseInt(id?.trim(), 10);

    if (isNaN(parsedId)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              شناسه نامعتبر
            </h2>
            <p className="text-gray-600 mb-4">شناسه پست معتبر نیست</p>
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت به مقالات
            </Link>
          </div>
        </div>
      );
    }

    // دریافت پست با اطلاعات کامل
    post = await prisma.post.findUnique({
      where: { id: parsedId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching post:", err);
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
            href="/posts"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به مقالات
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">پست یافت نشد</h2>
          <p className="text-gray-600 mb-4">پستی با این شناسه پیدا نشد</p>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به مقالات
          </Link>
        </div>
      </div>
    );
  }

  // محاسبه زمان مطالعه تقریبی
  const readingTime = post.content ? Math.ceil(post.content.length / 1000) : 3;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* هدر ناوبری */}
      <div className="bg-white mt-4 w-full shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">بازگشت به مقالات</p>
              <p className="text-sm text-gray-500">مشاهده سایر مطالب</p>
            </div>
          </Link>
        </div>
      </div>

      {/* محتوای اصلی */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* هدر پست */}
        <header className="mb-8 text-center">
          {/* دسته‌بندی */}
          {post.category && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-[#FEC360]" />
              <span className="bg-[#FEC360] text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                {post.category}
              </span>
            </div>
          )}

          {/* عنوان */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* متادیتا */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 mb-8">
            {/* تاریخ و زمان */}
            <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-sm font-medium">
                  تاریخ انتشار:
                </span>
                <Calendar className="w-5 h-5 text-[#FEC360]" />

                <span className="text-sm font-medium">
                  {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden md:block text-sm font-medium">
                  زمان مطالعه:
                </span>
                <Clock className="w-5 h-5 text-[#FEC360]" />
                <span className="text-sm font-medium">
                  {readingTime} دقیقه مطالعه
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* تصویر اصلی */}
        {post.imageUrl && (
          <div className="relative w-full h-80 lg:h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <Image
              src={
                getImagePath(post.imageUrl) || "/images/placeholder-post.jpg"
              }
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        )}

        {/* محتوای متنی */}
        {post.content && (
          <div className="mb-12">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-justify text-gray-800 leading-9 text-lg">
                  {post.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-8 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* محتوای ویدیویی */}
        {post.embedCode && (
          <div className="my-12 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: post.embedCode }}
            />
          </div>
        )}

        {!post.embedCode && post.videoUrl && (
          <div className="my-12 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <video src={post.videoUrl} controls className="w-full h-auto" />
          </div>
        )}

        {/* اکشن‌ها */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 p-6 bg-white rounded-3xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            {/* فضای خالی برای آینده */}
          </div>

          <div className="flex flex-col w-full justify-around items-center text-center gap-4">
            <span className="text-gray-600 font-medium">اشتراک‌گذاری</span>
            
            <ShareButtons
              title={post.title}
              url={getFullUrl(`/posts/${post.id}`)}
              description={post.content?.substring(0, 120) + "..."}
            />
          </div>
        </div>

        {/* نویسنده */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 justify-center">
            <User className="w-6 h-6 text-[#FEC360]" />
            درباره نویسنده
          </h3>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FEC360] to-amber-500 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              <Image
                src="/images/ahmadi-pic.jpg"
                alt={"احمدی"}
                width={192}
                height={192}
                className="rounded-3xl w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center lg:text-right">
              <h4 className="font-bold text-gray-900 text-xl mb-4">
                {"محراب احمدی"}
              </h4>
              <p className="text-gray-700 leading-8 text-lg mb-6 max-w-2xl mx-auto lg:mx-0">
                {post.author?.bio ||
                  "مشاور املاک با سال‌ها تجربه در زمینه خرید، فروش و سرمایه‌گذاری در مسکن. متخصص در تحلیل بازار املاک و ارائه راهکارهای سرمایه‌گذاری مطمئن."}
              </p>

              {post.author?.email && (
                <div className="flex items-center gap-2 text-gray-600 text-base justify-center lg:justify-start">
                  <span className="font-medium">
                    {"Mehrabahmadifabilsara@gmail.com"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* CTA پایانی */}
      <section className="bg-gradient-to-r from-[#FEC360] to-amber-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 border border-white/30">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              به دنبال مشاوره تخصصی املاک هستید؟
            </h3>
            <p className="text-gray-900 text-xl mb-8 max-w-2xl mx-auto leading-9">
              برای دریافت مشاوره رایگان و تحلیل بازار املاک، با من در ارتباط
              باشید
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-900 transition shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              درخواست مشاوره رایگان
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}