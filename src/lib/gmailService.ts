// Gmail Workspace Integration Service using Firebase Auth OAuth Provider & Gmail API

import { auth, googleProvider, cachedGoogleAccessToken } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

let cachedAccessToken: string | null = cachedGoogleAccessToken;

export function getCachedGmailToken(): string | null {
  return cachedAccessToken || cachedGoogleAccessToken;
}

export async function requestGmailToken(onTokenReceived: (token: string) => void) {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
      onTokenReceived(credential.accessToken);
    } else {
      throw new Error('No OAuth access token returned from Google sign-in.');
    }
  } catch (err: any) {
    console.error('Error obtaining Gmail token via Firebase Auth:', err);
    throw err;
  }
}

export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  messageBody: string,
  attachments: Array<{ name: string; type: string; data: string }> = []
) {
  const boundary = 'foo_bar_baz_capsu';
  const utf8Subject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  
  let rawMessage = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    messageBody,
    ``
  ];

  for (const att of attachments) {
    let base64Data = '';
    if (att.data && att.data.includes('base64,')) {
      base64Data = att.data.split('base64,')[1] || '';
    } else if (att.data) {
      try {
        base64Data = btoa(att.data);
      } catch (e) {
        base64Data = '';
      }
    }

    if (base64Data) {
      rawMessage.push(
        `--${boundary}`,
        `Content-Type: ${att.type || 'application/octet-stream'}; name="${att.name}"`,
        `Content-Transfer-Encoding: base64`,
        `Content-Disposition: attachment; filename="${att.name}"`,
        ``,
        base64Data,
        ``
      );
    }
  }

  rawMessage.push(`--${boundary}--`);
  const emailStr = rawMessage.join('\r\n');
  
  const encodedEmail = btoa(unescape(encodeURIComponent(emailStr)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedEmail
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API error (${response.status}): ${errText}`);
  }

  return await response.json();
}
