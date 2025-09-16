import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Here you would typically:
    // 1. Upload the file to cloud storage (GCS, S3, etc.)
    // 2. Process the receipt with OCR
    // 3. Store the receipt data in the database
    // For now, we'll just return a mock receipt ID

    const receiptId = `receipt_${Date.now()}`;

    return NextResponse.json({
      receiptId,
      message: 'Receipt uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    );
  }
}