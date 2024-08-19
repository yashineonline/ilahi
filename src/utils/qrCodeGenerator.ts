import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, { width: 200, margin: 2 });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}
