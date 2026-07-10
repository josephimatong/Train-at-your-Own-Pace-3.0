/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken } from './driveAuth.ts';

/**
 * Creates a base64url encoded MIME RFC 2822 email message.
 */
function createRawEmail(to: string, subject: string, htmlMessage: string): string {
  const emailLines = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlMessage
  ];

  const emailRaw = emailLines.join('\r\n');
  
  // Safe base64url encoding for Gmail API
  return btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email invitation using the Google Workspace Gmail Send API.
 */
export async function sendInviteEmail({
  toEmail,
  userName,
  userRole,
  userSite,
  accessibilityRole,
  appUrl
}: {
  toEmail: string;
  userName: string;
  userRole: string;
  userSite: string;
  accessibilityRole: string;
  appUrl: string;
}): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Workspace. Please link Google Account to send invitation emails.');
  }

  const subject = `Welcome to Wee Hur Safety Hub! [Invitation]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #f1f5f9;
            background-color: #020617;
            padding: 24px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.05em;
            background: linear-gradient(to right, #06b6d4, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          }
          h1 {
            color: #f1f5f9;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
          }
          p {
            color: #cbd5e1;
            font-size: 14px;
            margin-bottom: 16px;
          }
          .details-card {
            background-color: #020617;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .details-row:last-child {
            margin-bottom: 0;
          }
          .label {
            color: #94a3b8;
            font-weight: 500;
          }
          .value {
            color: #e2e8f0;
            font-weight: 600;
            text-align: right;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .btn {
            background-color: #0891b2;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 700;
            padding: 12px 28px;
            border-radius: 8px;
            display: inline-block;
            transition: background-color 0.2s;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #64748b;
            margin-top: 32px;
            border-top: 1px solid #1e293b;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo">Wee Hur Safety Hub</span>
          </div>
          <h1>Welcome, ${userName}!</h1>
          <p>You have been invited by your safety administrator to join the <strong>Wee Hur Safety Hub</strong> corporate training and compliance academy portal.</p>
          <p>This platform enables you to take safety course modules, complete verification quizzes, maintain your safety compliance certifications, and sync documents directly with Google Drive.</p>
          
          <div class="details-card">
            <div class="details-row">
              <span class="label">Full Name:</span>
              <span class="value">${userName}</span>
            </div>
            <div class="details-row">
              <span class="label">Corporate Email:</span>
              <span class="value">${toEmail}</span>
            </div>
            <div class="details-row">
              <span class="label">Assigned Role:</span>
              <span class="value">${userRole}</span>
            </div>
            <div class="details-row">
              <span class="label">Project Site:</span>
              <span class="value">${userSite}</span>
            </div>
            <div class="details-row">
              <span class="label">Access Level:</span>
              <span class="value" style="color: #06b6d4;">${accessibilityRole.toUpperCase()}</span>
            </div>
          </div>
          
          <p>To access your account and complete your safety trainings, click the secure link below to open the app directly:</p>
          
          <div class="button-container">
            <a href="${appUrl}" class="btn" target="_blank">Open Safety Hub Portal</a>
          </div>
          
          <p style="font-size: 12px; color: #94a3b8; font-style: italic;">Note: Please use your corporate email credentials to sign in. If you are a new user, select "Create Account" on the home page and use your corporate email address to choose a password.</p>
          
          <div class="footer">
            <p style="margin: 0;">&copy; 2026 Wee Hur Construction Pte Ltd. All rights reserved.</p>
            <p style="margin: 4px 0 0 0;">Safety & Compliance Academy Hub, Singapore.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const raw = createRawEmail(toEmail, subject, htmlContent);
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      }
    );

    if (response.status === 401) {
      throw new Error('Google authentication expired or is invalid. Please reconnect your Google Account.');
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Failed to send invite email through Gmail API:', errText);
      throw new Error(`Gmail API failed with status ${response.status}: ${response.statusText}`);
    }

    console.log(`Invitation email successfully sent to ${toEmail} via Gmail API.`);
  } catch (error: any) {
    console.error('sendInviteEmail Error:', error);
    throw error;
  }
}
