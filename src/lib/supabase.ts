import { createClient, SupabaseClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  // If user pasted dashboard link: https://supabase.com/dashboard/project/<ref>/...
  const match = trimmed.match(/supabase\.com\/dashboard\/project\/([a-z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://${match[1]}.supabase.co`;
  }
  // If user pasted just the project ref
  if (/^[a-z0-9]{20}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  return trimmed;
}

const rawSupabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = (rawSupabaseAnonKey || '').trim();

let supabaseInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const BUCKET_NAME = 'scholarship-documents';

/**
 * Tests connection to Supabase Storage and returns diagnostics.
 */
export async function testSupabaseConnection(): Promise<{
  configured: boolean;
  url: string;
  success: boolean;
  message: string;
  bucketExists?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      url: supabaseUrl || 'Not provided',
      success: false,
      message: 'Supabase URL or Key is missing from environment variables.'
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      configured: true,
      url: supabaseUrl,
      success: false,
      message: 'Failed to initialize Supabase client.'
    };
  }

  try {
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) {
      return {
        configured: true,
        url: supabaseUrl,
        success: false,
        message: `Storage Error: ${bucketErr.message}`
      };
    }

    const hasBucket = buckets?.some(b => b.name === BUCKET_NAME);
    return {
      configured: true,
      url: supabaseUrl,
      success: true,
      bucketExists: hasBucket,
      message: hasBucket 
        ? `Connected successfully to Supabase! Bucket '${BUCKET_NAME}' found.`
        : `Connected to Supabase, but bucket '${BUCKET_NAME}' was not found. Please create a public bucket named '${BUCKET_NAME}' in Storage.`
    };
  } catch (err: any) {
    return {
      configured: true,
      url: supabaseUrl,
      success: false,
      message: `Connection exception: ${err.message || err}`
    };
  }
}

/**
 * Uploads a browser File or Blob directly to Supabase Storage.
 * Returns the public URL if successful.
 */
export async function uploadFileToSupabase(
  file: File | Blob,
  filePath: string,
  bucketName: string = BUCKET_NAME
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const cleanPath = filePath.replace(/^\/+/, '');
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(cleanPath, file, {
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  } catch (err) {
    console.error('Failed to upload file to Supabase:', err);
    return null;
  }
}

/**
 * Uploads a Base64 data URL string to Supabase Storage and returns its URL.
 */
export async function uploadBase64ToSupabase(
  base64Data: string,
  fileName: string,
  bucketName: string = BUCKET_NAME
): Promise<string | null> {
  if (!isSupabaseConfigured() || !base64Data.startsWith('data:')) {
    return null;
  }

  try {
    const parts = base64Data.split(';base64,');
    const mimeMatch = parts[0].match(/:(.*?)$/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mimeType });
    return await uploadFileToSupabase(blob, fileName, bucketName);
  } catch (err) {
    console.warn('Could not convert/upload Base64 to Supabase:', err);
    return null;
  }
}
