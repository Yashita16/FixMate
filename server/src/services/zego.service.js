import crypto from 'crypto';

/**
 * Generates a ZegoCloud server token for video room access.
 * Reference: https://docs.zegocloud.com/article/11648
 */
export const generateZegoToken = (userId, roomId) => {
  const appId = Number(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_SECRET;

  if (!appId || !serverSecret) {
    throw new Error('ZEGO_APP_ID and ZEGO_SERVER_SECRET must be set in environment variables');
  }

  const expireTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  const tokenInfo = {
    app_id: appId,
    user_id: String(userId),
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: Math.floor(Date.now() / 1000),
    expire: expireTime,
    room_id: roomId,
  };

  const plaintext = JSON.stringify(tokenInfo);
  const key = Buffer.from(serverSecret.padEnd(32, '0').slice(0, 32));
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const token = Buffer.concat([iv, encrypted]).toString('base64');

  return `04${token}`;
};