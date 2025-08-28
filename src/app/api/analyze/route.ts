import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { analyzeSneakerImage, generateOutfitSuggestions } from '@/lib/gemini';
import { sanitizeFilename } from '@/lib/image-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('userId') as string || 'temp-user'; // Default for now
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // 1. Upload to Supabase Storage (with retry)
    const fileName = sanitizeFilename(imageFile.name);
    let uploadData;
    let uploadError;
    for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase.storage
            .from('sneaker-images')
            .upload(fileName, imageFile);
        if (!error) {
            uploadData = data;
            break;
        }
        uploadError = error;
        if (i < 2) await new Promise(res => setTimeout(res, 1000));
    }

    if (!uploadData) {
        console.error('Supabase upload failed:', uploadError);
        throw new Error('Failed to upload image to storage.');
    }
    
    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/sneaker-images/${uploadData.path}`;

    // 2. Analyze with Gemini (with timeout and fallback)
    let sneakerData;
    try {
        const analysisPromise = analyzeSneakerImage(imageFile);
        sneakerData = await Promise.race([
            analysisPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Analysis timeout')), 15000))
        ]);
        if (!sneakerData || !sneakerData.brand) throw new Error('Invalid analysis result');
    } catch (error) {
        console.error("Gemini analysis failed or timed out:", error);
        sneakerData = { // Fallback response
            brand: 'Unknown', model: 'Sneaker', colors: ['white'], style: 'casual', confidence: 0.5
        };
    }

    // 4. Fetch wardrobe items
    const { data: wardrobeItems } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId);

    // 5. Generate outfit suggestions
    const outfitSuggestions = await generateOutfitSuggestions(sneakerData, [], wardrobeItems || []);

    return NextResponse.json({
      sneaker: sneakerData,
      imageUrl,
      outfits: outfitSuggestions.outfits || [],
      message: 'Analysis complete'
    });

  } catch (error) {
    console.error('[API/ANALYZE] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Please try again later.'
    }, { status: 500 });
  }
}
