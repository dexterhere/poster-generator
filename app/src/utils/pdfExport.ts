import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePosterStore } from '../store/usePosterStore';

/**
 * Export the poster as a print-ready PDF using html2canvas + jsPDF.
 * This guarantees WYSIWYG output at exact A1 dimensions.
 */
export async function exportPosterToPDF(): Promise<Blob> {
  const state = usePosterStore.getState();
  const { width, height } = state.layout;

  // Find the poster canvas element
  const posterEl = document.getElementById('poster-canvas');
  if (!posterEl) {
    throw new Error('Poster canvas not found');
  }

  // Deselect everything before capture
  state.setSelectedSection(null);

  // Wait for any UI updates
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Capture at high resolution for print quality
  // 300 DPI = 300/25.4 mm per px. Our design is 1px = 1mm.
  // So scale = 300/25.4 / (96/25.4) = 300/96 = 3.125 for 300 DPI relative to screen
  // Actually html2canvas captures CSS pixels. To get 300 DPI output:
  // We need the canvas to render at scale factor where 1 CSS pixel = 1/96 inch.
  // For 300 DPI, 1mm = 300/25.4 px ≈ 11.8 px.
  // Our design uses 1px = 1mm, so we need scale = 300/25.4 ≈ 11.8
  // But that's huge. Let's use 2x or 3x for reasonable quality/file size balance.
  const PRINT_SCALE = 3; // Produces good quality at manageable file size

  const canvas = await html2canvas(posterEl, {
    scale: PRINT_SCALE,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      // Remove editor-only UI from clone
      clonedDoc.querySelectorAll('.editor-only-ui, [data-editor-ui="true"]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      // Ensure the cloned poster has no transform
      const clonedPoster = clonedDoc.getElementById('poster-canvas');
      if (clonedPoster) {
        clonedPoster.style.transform = 'none';
        clonedPoster.style.transformOrigin = 'top left';
        clonedPoster.style.position = 'relative';
      }
    },
  });

  // Create PDF with exact dimensions in mm
  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [width, height],
  });

  // Add image to PDF at full size
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');

  return pdf.output('blob');
}

/**
 * Export poster as high-resolution PNG image.
 */
export async function exportPosterToPNG(): Promise<Blob> {
  const state = usePosterStore.getState();
  const posterEl = document.getElementById('poster-canvas');
  if (!posterEl) {
    throw new Error('Poster canvas not found');
  }

  state.setSelectedSection(null);
  await new Promise((resolve) => setTimeout(resolve, 100));

  const canvas = await html2canvas(posterEl, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      clonedDoc.querySelectorAll('.editor-only-ui, [data-editor-ui="true"]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      const clonedPoster = clonedDoc.getElementById('poster-canvas');
      if (clonedPoster) {
        clonedPoster.style.transform = 'none';
        clonedPoster.style.transformOrigin = 'top left';
        clonedPoster.style.position = 'relative';
      }
    },
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG export failed'));
    }, 'image/png');
  });
}

/**
 * Trigger a file download.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
