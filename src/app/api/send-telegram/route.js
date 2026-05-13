export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, course, note } = body;

    const TELEGRAM_BOT_TOKEN = "8691141843:AAEUp_ZOKG_mMBfCOm-Mu7RPTYFitRZ2iJM";
    const TELEGRAM_CHAT_ID = "5818740118";

    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    const message = `
🎉 *ĐĂNG KÝ MỚI - Phúc Yên Edu*

👤 *Họ và tên:* ${name}
📞 *Số điện thoại:* ${phone}
📚 *Khóa học:* ${course || "Chưa chọn"}
📝 *Ghi chú:* ${note || "Không có"}
🕐 *Thời gian:* ${now}

_Vui lòng liên hệ lại sớm nhất có thể!_
    `.trim();

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      console.error("Telegram error:", errText);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
