import { formatCurrency, formatPercentage } from "./formatters";

/**
 * Dispara la descarga de un Blob en el navegador con el nombre indicado.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toLatin1Bytes(text) {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    bytes[i] = code <= 0xff ? code : 63; // '?' para caracteres fuera de WinAnsi
  }
  return bytes;
}

function pdfTextEscape(str) {
  return String(str ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Genera y descarga un reporte mensual simple en formato PDF (A4, sin dependencias externas).
 */
export function exportMonthlyReportPdf({
  monthName,
  year,
  summary = {},
  categoryBreakdown = [],
  budgets = [],
}) {
  const ops = [];

  const drawText = (x, y, text, { bold = false, size = 10, rgb = [0.14, 0.13, 0.22] } = {}) => {
    const font = bold ? "/F2" : "/F1";
    ops.push(
      `BT ${rgb[0]} ${rgb[1]} ${rgb[2]} rg ${font} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfTextEscape(text)}) Tj ET`
    );
  };

  const drawRect = (x, y, w, h, rgb) => {
    ops.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  };

  const drawLine = (x1, y1, x2, y2, rgb = [0.85, 0.83, 0.88]) => {
    ops.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} RG 0.75 w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  };

  // Encabezado violeta de marca PESHITO
  drawRect(0, 765, 595.28, 77, [0.56, 0.4, 0.78]);
  drawText(45, 804, "PESHITO", { bold: true, size: 20, rgb: [1, 1, 1] });
  drawText(45, 784, `Reporte Financiero Mensual - ${monthName} ${year}`, {
    bold: false,
    size: 11,
    rgb: [0.97, 0.93, 0.88],
  });
  drawText(420, 784, `Emitido: ${new Date().toLocaleDateString("es-AR")}`, {
    bold: false,
    size: 9,
    rgb: [0.97, 0.93, 0.88],
  });

  // Resumen General
  let y = 735;
  drawText(45, y, "RESUMEN DEL PERÍODO", { bold: true, size: 11, rgb: [0.56, 0.4, 0.78] });
  y -= 10;
  drawLine(45, y, 550, y);
  y -= 22;

  const netBalance = parseFloat(summary.net_savings || "0");
  const totalIncome = parseFloat(summary.total_income || "0");
  const totalExpense = parseFloat(summary.total_expense || "0");
  const savingsRate = summary.savings_rate || 0;

  const summaryRows = [
    ["Balance Neto", formatCurrency(netBalance, "ARS")],
    ["Ingresos Totales", `+${formatCurrency(totalIncome, "ARS")}`],
    ["Gastos Totales", `-${formatCurrency(totalExpense, "ARS")}`],
    ["Tasa de Ahorro", formatPercentage(savingsRate, 1)],
  ];

  summaryRows.forEach(([label, val]) => {
    drawText(50, y, label, { bold: true, size: 10 });
    drawText(380, y, val, { bold: true, size: 10 });
    y -= 18;
  });

  // Gastos por Categoría
  y -= 14;
  drawText(45, y, "GASTOS POR CATEGORÍA", { bold: true, size: 11, rgb: [0.56, 0.4, 0.78] });
  y -= 10;
  drawLine(45, y, 550, y);
  y -= 20;

  if (categoryBreakdown.length === 0) {
    drawText(50, y, "Sin gastos registrados en este período.", { size: 10, rgb: [0.5, 0.5, 0.55] });
    y -= 20;
  } else {
    drawText(50, y, "Categoría", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
    drawText(330, y, "Monto", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
    drawText(480, y, "%", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
    y -= 16;

    categoryBreakdown.slice(0, 12).forEach((item) => {
      if (y < 90) return;
      const name = item.category_name || item.category || "Sin categoría";
      const total = Number(item.total || item.total_amount || 0);
      const pct = Number(item.percentage || 0);
      drawText(50, y, name.slice(0, 42), { size: 10 });
      drawText(330, y, formatCurrency(total, "ARS"), { size: 10 });
      drawText(480, y, formatPercentage(pct, 1), { size: 10 });
      y -= 17;
    });
  }

  // Presupuestos del Mes
  if (y > 130) {
    y -= 14;
    drawText(45, y, "PRESUPUESTOS DEL MES", { bold: true, size: 11, rgb: [0.56, 0.4, 0.78] });
    y -= 10;
    drawLine(45, y, 550, y);
    y -= 20;

    if (budgets.length === 0) {
      drawText(50, y, "No hay presupuestos definidos para este período.", { size: 10, rgb: [0.5, 0.5, 0.55] });
    } else {
      drawText(50, y, "Categoría", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
      drawText(260, y, "Gastado", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
      drawText(390, y, "Límite", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
      drawText(500, y, "Uso", { bold: true, size: 9, rgb: [0.45, 0.43, 0.55] });
      y -= 16;

      budgets.slice(0, 10).forEach((b) => {
        if (y < 60) return;
        const catName = b.category_detail?.name || "Categoría";
        const spent = Number(b.spent_amount || 0);
        const limit = Number(b.amount || 0);
        const pct = b.progress_percentage !== undefined
          ? Number(b.progress_percentage)
          : (limit > 0 ? (spent / limit) * 100 : 0);

        drawText(50, y, catName.slice(0, 32), { size: 10 });
        drawText(260, y, formatCurrency(spent, "ARS"), { size: 10 });
        drawText(390, y, formatCurrency(limit, "ARS"), { size: 10 });
        drawText(500, y, formatPercentage(pct, 0), { size: 10 });
        y -= 17;
      });
    }
  }

  // Pie de página
  drawLine(45, 45, 550, 45);
  drawText(45, 30, "PESHITO - Finanzas personales claras y sin estrés.", {
    size: 8,
    rgb: [0.5, 0.48, 0.6],
  });

  const streamContent = ops.join("\n");
  const streamBytes = toLatin1Bytes(streamContent);

  const headerBytes = new Uint8Array([
    0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, // %PDF-1.4\n
    0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a,                   // binary comment
  ]);

  const objects = [
    toLatin1Bytes("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"),
    toLatin1Bytes("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"),
    toLatin1Bytes(
      "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n"
    ),
    toLatin1Bytes(
      "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n"
    ),
    toLatin1Bytes(
      "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n"
    ),
    concatUint8Arrays([
      toLatin1Bytes(`6 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`),
      streamBytes,
      toLatin1Bytes("\nendstream\nendobj\n"),
    ]),
  ];

  const offsets = [];
  let cursor = headerBytes.length;
  for (const obj of objects) {
    offsets.push(cursor);
    cursor += obj.length;
  }

  const xrefOffset = cursor;
  const xrefLines = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.map((off) => `${String(off).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF",
  ].join("\n");

  const pdfBytes = concatUint8Arrays([
    headerBytes,
    ...objects,
    toLatin1Bytes(xrefLines),
  ]);

  const slugMonth = String(monthName || "mes").toLowerCase().replace(/\s+/g, "_");
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  downloadBlob(blob, `peshito_reporte_${slugMonth}_${year}.pdf`);
}
