export function getOtp(){
    return Math.floor(100000 + Math.random() * 999999).toString()
}

export function getOtpHtml(otp){
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareBridge OTP Verification</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#2563eb;padding:30px;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;">
                🩺 CareBridge
              </h1>

              <p style="margin:10px 0 0;color:#dbeafe;font-size:16px;">
                Connecting Patients with Trusted Healthcare
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#111827;">
                Verify Your Email
              </h2>

              <p style="color:#4b5563;font-size:16px;line-height:28px;">
                Hello,
              </p>

              <p style="color:#4b5563;font-size:16px;line-height:28px;">
                Thank you for choosing <strong>CareBridge</strong>.
                Use the verification code below to complete your email verification.
              </p>

              <!-- OTP Box -->
              <div style="margin:35px 0;text-align:center;">

                <div style="
                  display:inline-block;
                  background:#eff6ff;
                  border:2px dashed #2563eb;
                  padding:18px 35px;
                  border-radius:10px;
                  font-size:38px;
                  font-weight:bold;
                  color:#2563eb;
                  letter-spacing:10px;
                ">
                  ${otp}
                </div>

              </div>

              <p style="color:#374151;font-size:15px;line-height:28px;">
                This OTP is valid for
                <strong>10 minutes</strong>.
              </p>

              <p style="color:#374151;font-size:15px;line-height:28px;">
                If you did not request this verification code,
                you can safely ignore this email.
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;">

              <p style="font-size:13px;color:#9ca3af;line-height:22px;">
                Never share your OTP with anyone.
                CareBridge will never ask for your verification code.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb;padding:25px;">

              <p style="margin:0;color:#6b7280;font-size:14px;">
                © 2026 CareBridge. All rights reserved.
              </p>

              <p style="margin-top:10px;color:#9ca3af;font-size:13px;">
                Secure • Reliable • Trusted Healthcare
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}

export function getForgotPasswordOtpHtml(otp) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareBridge Password Reset</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#0EBE7F;padding:30px;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;">
                🩺 CareBridge
              </h1>

              <p style="margin:10px 0 0;color:#fecaca;font-size:16px;">
                Secure Password Reset Request
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#111827;">
                Reset Your Password
              </h2>

              <p style="color:#4b5563;font-size:16px;line-height:28px;">
                Hello,
              </p>

              <p style="color:#4b5563;font-size:16px;line-height:28px;">
                We received a request to reset the password for your
                <strong>CareBridge</strong> account.
                Use the OTP below to continue resetting your password.
              </p>

              <!-- OTP Box -->
              <div style="margin:35px 0;text-align:center;">
                <div style="
                  display:inline-block;
                  background:#fef2f2;
                  border:2px dashed #dc2626;
                  padding:18px 35px;
                  border-radius:10px;
                  font-size:38px;
                  font-weight:bold;
                  color:#dc2626;
                  letter-spacing:10px;
                ">
                  ${otp}
                </div>
              </div>

              <p style="color:#374151;font-size:15px;line-height:28px;">
                This OTP is valid for
                <strong>10 minutes</strong>.
              </p>

              <p style="color:#374151;font-size:15px;line-height:28px;">
                Enter this OTP in the CareBridge app or website to verify your identity and create a new password.
              </p>

              <p style="color:#374151;font-size:15px;line-height:28px;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;">

              <p style="font-size:13px;color:#9ca3af;line-height:22px;">
                🔒 Never share this OTP with anyone. CareBridge will never ask for your OTP, password, or verification code via email, phone, or message.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb;padding:25px;">

              <p style="margin:0;color:#6b7280;font-size:14px;">
                © 2026 CareBridge. All rights reserved.
              </p>

              <p style="margin-top:10px;color:#9ca3af;font-size:13px;">
                Secure • Reliable • Trusted Healthcare
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}