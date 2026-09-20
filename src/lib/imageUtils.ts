/**
 * Image compression and document file utility helpers
 * Supports base64 data URLs, SVG data URLs, and cloud-hosted storage URLs.
 */

export interface ProcessedImage {
  dataUrl: string;
  sizeStr: string;
  type: string;
  width: number;
  height: number;
}

/**
 * Compresses an image file client-side using an HTML Canvas.
 * Generates an efficient, high-fidelity JPEG or WebP data URL to fit within
 * database and document size constraints without loss of textual legibility.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // If not an image or is SVG, read raw data URL directly
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        const sizeStr = formatFileSize(file.size);
        resolve({
          dataUrl,
          sizeStr,
          type: file.type || 'image/jpeg',
          width: 800,
          height: 600
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = (e.target?.result as string) || '';
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Scale proportionally if either dimension exceeds max
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Fill background with white to avoid transparent PNG issues converting to JPEG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          // Calculate approximate byte size from base64 length
          const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
          const sizeStr = formatFileSize(approxBytes);

          resolve({
            dataUrl: compressedDataUrl,
            sizeStr,
            type: 'image/jpeg',
            width,
            height
          });
        } else {
          resolve({
            dataUrl: rawUrl,
            sizeStr: formatFileSize(file.size),
            type: file.type,
            width: img.width,
            height: img.height
          });
        }
      };

      img.onerror = () => {
        resolve({
          dataUrl: rawUrl,
          sizeStr: formatFileSize(file.size),
          type: file.type,
          width: 800,
          height: 600
        });
      };

      img.src = rawUrl;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Reliably checks if a file representation is an image (PNG, JPG, SVG, WebP, base64 data URL, etc.)
 */
export function isImageFile(file: any): boolean {
  if (!file) return false;
  const src = (file.data || file.url || (typeof file === 'string' ? file : '')).trim();
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();

  if (type.startsWith('image/')) return true;
  if (src.startsWith('data:image/')) return true;
  if (/\.(png|jpe?g|webp|gif|svg|bmp|avif)(\?.*)?$/i.test(src)) return true;
  if (/\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i.test(name)) return true;
  return false;
}

/**
 * Checks if a file is a PDF document
 */
export function isPdfFile(file: any): boolean {
  if (!file) return false;
  const src = (file.data || file.url || (typeof file === 'string' ? file : '')).trim();
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();

  // If it's clearly image data, it's not a PDF
  if (src.startsWith('data:image/')) return false;
  if (type.startsWith('image/')) return false;

  if (type.includes('pdf')) return true;
  if (src.startsWith('data:application/pdf')) return true;
  if (/\.pdf(\?.*)?$/i.test(src)) return true;
  if (/\.pdf$/i.test(name)) return true;
  return false;
}

/**
 * Resolves the primary rendering source string (data URL, http URL, or blob)
 */
export function getFileSource(file: any): string {
  if (!file) return '';
  if (typeof file === 'string') return file;
  return file.data || file.url || '';
}

/**
 * Checks if a file is a Registration Form (RF) document
 */
export function isRFDocument(file: any): boolean {
  if (!file) return false;
  const cat = (typeof file.category === 'string' ? file.category : '').toUpperCase();
  const name = (typeof file.name === 'string' ? file.name : '').toUpperCase();
  return (
    cat === 'RF' ||
    cat === 'RF_1' ||
    cat === 'RF_2' ||
    cat === '1ST_RF' ||
    cat === '2ND_RF' ||
    cat.includes('REGISTRATION') ||
    cat.includes('COR') ||
    cat.includes('ENROLLMENT') ||
    name.includes('REGISTRATION') ||
    name.includes('COR') ||
    name.includes('_RF') ||
    name.includes('-RF') ||
    name.includes('RF_')
  );
}

/**
 * Checks if a file is a General Weighted Average (GWA) document
 */
export function isGWADocument(file: any): boolean {
  if (!file) return false;
  const cat = (typeof file.category === 'string' ? file.category : '').toUpperCase();
  const name = (typeof file.name === 'string' ? file.name : '').toUpperCase();
  return (
    cat === 'GWA' ||
    cat === 'GWA_1' ||
    cat === 'GWA_2' ||
    cat === '1ST_GWA' ||
    cat === '2ND_GWA' ||
    cat.includes('GWA') ||
    cat.includes('GRADE') ||
    cat.includes('COG') ||
    name.includes('GWA') ||
    name.includes('GRADE') ||
    name.includes('COG') ||
    name.includes('_GWA') ||
    name.includes('-GWA') ||
    name.includes('GWA_')
  );
}

/**
 * Checks if a file belongs to 2nd Semester
 */
export function is2ndSemesterDoc(file: any): boolean {
  if (!file) return false;
  const cat = (typeof file.category === 'string' ? file.category : '').toUpperCase();
  const name = (typeof file.name === 'string' ? file.name : '').toUpperCase();
  return (
    cat.includes('2ND') ||
    cat.includes('SECOND') ||
    cat.endsWith('_2') ||
    cat.includes('2ND_') ||
    name.includes('2ND') ||
    name.includes('SECOND') ||
    name.includes('_2ND') ||
    name.includes('-2ND') ||
    name.includes('_2.') ||
    name.includes('-2.')
  );
}

/**
 * Format explicit user-friendly document title
 */
export function formatDocumentTitle(file: any): string {
  if (!file) return 'Document';
  
  let catStr = '';
  let nStr = '';
  
  if (typeof file === 'object') {
      catStr = typeof file.category === 'string' ? file.category : '';
      nStr = typeof file.name === 'string' ? file.name : '';
  } else {
      // Fallback if called with old signature
      catStr = typeof file === 'string' ? file : '';
      nStr = '';
  }

  const cat = catStr.toUpperCase();
  const n = nStr.toUpperCase();

  if (isRFDocument(file)) {
    if (is2ndSemesterDoc(file)) {
      return 'Registration Form (RF) — 2nd Semester';
    }
    return 'Registration Form (RF) — 1st Semester';
  }

  if (isGWADocument(file)) {
    if (is2ndSemesterDoc(file)) {
      return 'General Weighted Average (GWA) — 2nd Semester';
    }
    return 'General Weighted Average (GWA) — 1st Semester';
  }

  if (cat === 'ID' || cat.includes('STUDENT ID') || n.includes('STUDENT_ID') || n.includes('_ID')) {
    return 'Official Student ID Card';
  }

  if (cat.includes('PHOTO') || cat.includes('2X2')) {
    return '2x2 Recent Formal ID Photo';
  }

  return catStr || nStr || 'Official Scholarship Document';
}
