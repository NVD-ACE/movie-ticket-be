export const movieTicketTemplate = ({ user, tickets, totalAmount, payment }) => {
  return {
    subject: "🎉 Xác nhận đặt vé xem phim thành công!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="text-align: center; color: #ff4d4f;">🎬 Movie Ticket Confirmation</h2>
        <p>Xin chào <strong>${user.fullName || user.email}</strong>,</p>

        <p>Cảm ơn bạn đã đặt vé tại hệ thống của chúng tôi. Dưới đây là thông tin vé:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; border: 1px solid #ddd;">Ghế</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Giá vé</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${t.chairId}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${t.price.toLocaleString()} VND</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top: 20px;">Tổng cộng: <strong style="color: #1890ff; font-size: 18px;">${totalAmount.toLocaleString()} VND</strong></p>

        <p><strong>Phương thức thanh toán:</strong> ${payment.method.toUpperCase()}</p>
        <p><strong>Mã giao dịch:</strong> ${payment.transactionId}</p>

        <hr style="margin: 30px 0;">

        <p style="text-align: center; font-style: italic; color: #888;">
          Hãy đến rạp trước 15 phút để nhận vé và không bỏ lỡ trải nghiệm điện ảnh tuyệt vời 🎥
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://your-website.com" style="display: inline-block; padding: 12px 24px; background-color: #ff4d4f; color: white; text-decoration: none; border-radius: 6px;">
            Xem lịch sử đặt vé
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #aaa; text-align: center;">
          Email này được gửi từ hệ thống đặt vé của MovieApp. Vui lòng không trả lời email này.
        </p>
      </div>
    `
  };
};
