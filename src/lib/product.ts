import { BASE_URL } from "@/app/base";

// تابع برای دریافت محصولات
export const getProducts = async (
  params: { page?: string; limit?: string } = {},
) => {
  try {
    // تبدیل پارامترها به رشته کوئری (مثلاً: ?page=1&limit=10)
    const search = new URLSearchParams();
    if (params.page) search.append("page", params.page);
    if (params.limit) search.append("limit", params.limit);

    const query = search.toString();

    // ترکیب آدرس پایه با مسیر محصولات
    // نکته: مطمئن شو در base.ts آدرس /api یا مشابه آن را داری
    const fullUrl = `${BASE_URL}/products${query ? `?${query}` : ""}`;

    console.log("Attempting to fetch from:", fullUrl);

    const res = await fetch(fullUrl, {
      method: "GET",
      // اگر از Session یا Cookie برای احراز هویت استفاده می‌کنی 'include' ضروری است
      // در غیر این صورت 'omit' یا 'same-origin' هم کار می‌کند
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // اگر سرور پاسخ خطا داد (مثل 404 یا 500)
      const errorText = await res.text();
      console.error(`API Error: ${res.status} - ${errorText}`);
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Network or API Error in getProducts:", error);
    // پرتاب خطا برای اینکه در کامپوننت (ProductsPage) مدیریت شود
    throw error;
  }
};
