import nodemailer from 'nodemailer';

export interface BookingEmailPayload {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  newStatus: string;
  appointmentDate?: string | null;
  preferredTime?: string | null;
  locationUrl?: string | null;
  phone?: string | null;
}

export interface BookingConfirmationPayload {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  appointmentDate?: string | null;
  preferredTime?: string | null;
  locationUrl?: string | null;
  phone?: string | null;
}

const BRAND_COLOR = "#8DB833";
const BRAND_NAME = "SANEX Company Ltd";
const COMPANY_PHONE = "+250 788 385 838";
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "sanexcompany@gmail.com";
const DEFAULT_FROM = process.env.EMAIL_FROM || `"${BRAND_NAME}" <${COMPANY_EMAIL}>`;

function getStatusDetails(status: string) {
  const s = (status || 'pending').toLowerCase();
  switch (s) {
    case 'confirmed':
      return {
        title: "Booking Confirmed",
        badgeBg: "#8DB833",
        badgeText: "#000000",
        message: "Your service request has been confirmed by our operations team. An operations crew and equipment have been scheduled for your service.",
        nextStep: "Our dispatch team will arrive at your designated location at the agreed appointment window."
      };
    case 'in-progress':
      return {
        title: "Service In Progress",
        badgeBg: "#8DB833",
        badgeText: "#000000",
        message: "Our operations crew is currently en-route or actively performing your requested sanitation service.",
        nextStep: "Our supervisor on-site will coordinate with you to ensure quality completion."
      };
    case 'completed':
      return {
        title: "Service Completed",
        badgeBg: "#8DB833",
        badgeText: "#000000",
        message: "Your liquid waste management service has been successfully executed and completed.",
        nextStep: "Thank you for choosing SANEX Company Ltd. If you have any feedback or require certification/invoicing, please contact us."
      };
    case 'cancelled':
      return {
        title: "Booking Cancelled",
        badgeBg: "#64748b",
        badgeText: "#ffffff",
        message: "Your service request has been cancelled or could not be scheduled at this time.",
        nextStep: "If this was done in error or you would like to reschedule, please reach out directly to our team."
      };
    default:
      return {
        title: "Request Received (Pending Review)",
        badgeBg: "#8DB833",
        badgeText: "#000000",
        message: "Your booking request is currently under review by our operations team.",
        nextStep: "We will review your location and requirements, then send an update once confirmed."
      };
  }
}

function generateStatusEmailHtml(payload: BookingEmailPayload): string {
  const { bookingId, customerName, serviceType, newStatus, appointmentDate, preferredTime, locationUrl, phone } = payload;
  const statusInfo = getStatusDetails(newStatus);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Request Update - ${BRAND_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f5f7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left; border-bottom: 4px solid ${BRAND_COLOR};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: ${BRAND_COLOR}; letter-spacing: 0.5px; text-transform: uppercase;">
                      SANEX <span style="color: #ffffff; font-weight: 400;">Company Ltd</span>
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                      Sustainable Liquid Waste Management · Rwanda
                    </p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: ${statusInfo.badgeBg}; color: ${statusInfo.badgeText}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; rounded: 9999px; border-radius: 20px;">
                      ${newStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a; font-weight: 700;">
                Hello ${customerName || 'Valued Customer'},
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155;">
                ${statusInfo.message}
              </p>

              <!-- Status Banner Box -->
              <div style="background-color: #f8fafc; border-left: 4px solid ${statusInfo.badgeBg}; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Next Step:</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569;">${statusInfo.nextStep}</p>
              </div>

              <!-- Booking Details Table -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">
                  Service Request Summary
                </h3>
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                  <tr>
                    <td style="color: #64748b; width: 35%; padding-bottom: 8px;">Reference ID:</td>
                    <td style="color: #0f172a; font-weight: 700; padding-bottom: 8px;"><code>#${bookingId}</code></td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding-bottom: 8px;">Service:</td>
                    <td style="color: #0f172a; font-weight: 700; padding-bottom: 8px;">${serviceType}</td>
                  </tr>
                  ${appointmentDate ? `
                  <tr>
                    <td style="color: #64748b; padding-bottom: 8px;">Preferred Date:</td>
                    <td style="color: #0f172a; font-weight: 600; padding-bottom: 8px;">${appointmentDate}${preferredTime ? ` (${preferredTime})` : ''}</td>
                  </tr>` : ''}
                  ${phone ? `
                  <tr>
                    <td style="color: #64748b; padding-bottom: 8px;">Contact Phone:</td>
                    <td style="color: #0f172a; font-weight: 600; padding-bottom: 8px;">${phone}</td>
                  </tr>` : ''}
                  ${locationUrl ? `
                  <tr>
                    <td style="color: #64748b; padding-bottom: 8px;">Service Location:</td>
                    <td style="padding-bottom: 8px;"><a href="${locationUrl}" style="color: #2563eb; text-decoration: underline;" target="_blank">View Location Pin</a></td>
                  </tr>` : ''}
                  <tr>
                    <td style="color: #64748b;">Current Status:</td>
                    <td style="color: #0f172a; font-weight: 700;">
                      <span style="color: ${statusInfo.badgeBg === '#8DB833' ? '#4d7c0f' : '#334155'}; text-transform: uppercase;">
                        ● ${newStatus}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Assistance Callout -->
              <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b;">
                Need to make changes or have questions? Contact our dispatch desk directly at 
                <a href="tel:${COMPANY_PHONE.replace(/\s+/g, '')}" style="color: #0f172a; font-weight: 700; text-decoration: none;">${COMPANY_PHONE}</a> or 
                <a href="mailto:${COMPANY_EMAIL}" style="color: #0f172a; font-weight: 700; text-decoration: none;">${COMPANY_EMAIL}</a>.
              </p>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 16px;">
                <a href="https://sanex.rw/contact" style="display: inline-block; background-color: ${BRAND_COLOR}; color: #000000; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">
                  Contact Operations Desk
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a;">
                ${BRAND_NAME}
              </p>
              <p style="margin: 0 0 6px 0;">
                Leading Liquid Waste Management, Decentralized Wastewater Treatment & Eco-Sanitation.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                Kigali, Rwanda · Phone: ${COMPANY_PHONE} · Email: ${COMPANY_EMAIL}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    if (!host && (user.includes('@gmail.com') || process.env.SMTP_SERVICE === 'gmail')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }
    return nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

/**
 * Sends a real-time status update email to the requester.
 * Supports SMTP (Gmail or custom), Resend API, and graceful fallback logging.
 */
export async function sendBookingStatusEmail(payload: BookingEmailPayload): Promise<{ success: boolean; method: string; message?: string }> {
  const { customerEmail, serviceType, newStatus, customerName } = payload;

  if (!customerEmail || !customerEmail.includes('@')) {
    console.warn(`[sendBookingStatusEmail] Cannot send email: Invalid email address "${customerEmail}"`);
    return { success: false, method: 'none', message: 'Invalid recipient email address' };
  }

  const subject = `Service Request Update: ${serviceType} is now ${newStatus.toUpperCase()} - ${BRAND_NAME}`;
  const html = generateStatusEmailHtml(payload);
  const text = `Hello ${customerName || 'Customer'},\n\nYour service request (${serviceType}) status has been updated to: ${newStatus.toUpperCase()}.\n\nFor questions, contact SANEX at ${COMPANY_PHONE} or ${COMPANY_EMAIL}.\n\nThank you,\n${BRAND_NAME}`;

  // 1. Try Resend API if API Key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: DEFAULT_FROM,
          to: [customerEmail],
          subject,
          html,
          text,
        }),
      });
      if (res.ok) {
        console.log(`[sendBookingStatusEmail] Status email delivered to ${customerEmail} via Resend.`);
        return { success: true, method: 'resend' };
      }
      const errBody = await res.text();
      console.warn(`[sendBookingStatusEmail] Resend API error: ${errBody}`);
    } catch (resendErr: any) {
      console.warn(`[sendBookingStatusEmail] Failed sending via Resend: ${resendErr.message}`);
    }
  }

  // 2. Try Nodemailer SMTP (Gmail or custom SMTP)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: DEFAULT_FROM,
        to: customerEmail,
        subject,
        html,
        text,
      });
      console.log(`[sendBookingStatusEmail] Status email delivered to ${customerEmail} via SMTP: ${info.messageId}`);
      return { success: true, method: 'smtp' };
    } catch (smtpErr: any) {
      console.error(`[sendBookingStatusEmail] SMTP dispatch failed: ${smtpErr.message}`);
      return { success: false, method: 'smtp', message: smtpErr.message };
    }
  }

  // 3. Fallback / Dev Log: System is ready, credentials can be added to .env
  console.log(`
======================================================
[EMAIL NOTIFICATION DISPATCHED]
To: ${customerEmail}
Subject: ${subject}
Status: ${newStatus.toUpperCase()}
Customer: ${customerName}
Service: ${serviceType}
(To enable live outbound delivery, configure SMTP_USER & SMTP_PASS or RESEND_API_KEY in .env)
======================================================
  `);

  return { 
    success: true, 
    method: 'logged', 
    message: 'Email prepared and logged. Outbound SMTP can be enabled in .env' 
  };
}
