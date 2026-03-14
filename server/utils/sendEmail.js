const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

// Email Templates
const emailTemplates = {
  orderConfirmation: (order, customer) => ({
    subject: `Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()} | Renovi8`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">Renovi8</h1>
          <p style="color:#e0e7ff;margin:5px 0 0;">Smart Home Upgrades Made Simple</p>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color:#1e293b;">Order Confirmed! 🎉</h2>
          <p style="color:#64748b;">Hi ${customer.name}, your order has been successfully placed.</p>
          <div style="background:#f1f5f9;border-radius:8px;padding:15px;margin:20px 0;">
            <p style="margin:5px 0;color:#334155;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin:5px 0;color:#334155;"><strong>Service Date:</strong> ${new Date(order.serviceDate).toLocaleDateString()}</p>
            <p style="margin:5px 0;color:#334155;"><strong>Service Time:</strong> ${order.serviceTime}</p>
            <p style="margin:5px 0;color:#334155;"><strong>Status:</strong> Pending</p>
          </div>
          <p style="color:#64748b;">We'll be in touch soon to confirm your appointment.</p>
          <a href="${process.env.CLIENT_URL}/dashboard/orders/${order._id}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:10px;">Track Your Order</a>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;">
          <p style="color:#94a3b8;font-size:12px;text-align:center;">© 2026 Renovi8. Smart Home Upgrades Made Simple.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request | Renovi8',
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">Renovi8</h1>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color:#1e293b;">Reset Your Password 🔐</h2>
          <p style="color:#64748b;">You requested a password reset. Click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:20px 0;">Reset Password</a>
          <p style="color:#94a3b8;font-size:14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
          <p style="color:#94a3b8;font-size:12px;text-align:center;">© 2026 Renovi8. Smart Home Upgrades Made Simple.</p>
        </div>
      </div>
    `,
  }),

  orderStatusUpdate: (order, customer, newStatus) => ({
    subject: `Order Status Updated - #${order._id.toString().slice(-8).toUpperCase()} | Renovi8`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">Renovi8</h1>
        </div>
        <div style="background:#fff;padding:30px;border-radius:0 0 12px 12px;">
          <h2 style="color:#1e293b;">Order Update</h2>
          <p style="color:#64748b;">Hi ${customer.name}, your order status has been updated.</p>
          <div style="background:#f1f5f9;border-radius:8px;padding:15px;margin:20px 0;">
            <p style="margin:5px 0;color:#334155;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin:5px 0;color:#334155;"><strong>New Status:</strong> ${newStatus}</p>
          </div>
          <a href="${process.env.CLIENT_URL}/dashboard/orders/${order._id}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Order</a>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;">
          <p style="color:#94a3b8;font-size:12px;text-align:center;">© 2026 Renovi8. Smart Home Upgrades Made Simple.</p>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
