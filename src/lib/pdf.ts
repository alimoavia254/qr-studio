/**
 * Tiny single-page PDF writer that embeds one JPEG. Lets the QR be downloaded at an exact
 * physical size (in cm) for print shops, without pulling in a PDF library.
 */

const PT_PER_CM = 72 / 2.54;

export function jpegToPdf(jpeg: Uint8Array, pxW: number, pxH: number, imageCm: number, marginCm = 1): Blob {
  const imgPt = +(imageCm * PT_PER_CM).toFixed(2);
  const marginPt = +(marginCm * PT_PER_CM).toFixed(2);
  const pageW = +(imgPt + marginPt * 2).toFixed(2);
  const pageH = +((imgPt * pxH) / pxW + marginPt * 2).toFixed(2);
  const drawH = +((imgPt * pxH) / pxW).toFixed(2);

  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (b: Uint8Array) => {
    chunks.push(b);
    length += b.length;
  };
  const text = (s: string) => push(enc.encode(s));
  const obj = (n: number, body: () => void) => {
    offsets[n] = length;
    text(`${n} 0 obj\n`);
    body();
    text("endobj\n");
  };

  const content = `q ${imgPt} 0 0 ${drawH} ${marginPt} ${marginPt} cm /Im0 Do Q`;

  text("%PDF-1.4\n");
  obj(1, () => text("<< /Type /Catalog /Pages 2 0 R >>\n"));
  obj(2, () => text("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n"));
  obj(3, () =>
    text(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\n`
    )
  );
  obj(4, () => text(`<< /Length ${content.length} >>\nstream\n${content}\nendstream\n`));
  obj(5, () => {
    text(
      `<< /Type /XObject /Subtype /Image /Width ${pxW} /Height ${pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
    );
    push(jpeg);
    text("\nendstream\n");
  });

  const xref = length;
  text(`xref\n0 6\n0000000000 65535 f \n`);
  for (let i = 1; i <= 5; i++) text(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  text(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}
