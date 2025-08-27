import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeSneakerImage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('userId') as string || 'temp-user';
    
    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sneaker-images')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/sneaker-images/${fileName}`;

    // Analyze with Gemini
    const sneakerData = await analyzeSneakerImage(imageFile);

    return NextResponse.json({
      sneaker: sneakerData,
      imageUrl,
      message: 'Analysis complete'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: errorMessage
    }, { status: 500 });
  }
}
