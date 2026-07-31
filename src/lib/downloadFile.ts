
export function triggerBrowserDownload(blob: Blob, filename: string): void {
    try{
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a tick to start the download before revoking the URL.
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  console.log("downloaded")
    }
    catch(err) {
        alert("Failed to download");
        console.log(err);
    }
}

/**
 * Extracts the filename from a Content-Disposition header value, e.g.
 * 'attachment; filename="income-report-20260730-120000.csv"' -> 'income-report-20260730-120000.csv'
 */
export function extractFilenameFromDisposition(
  disposition: string | null,
  fallback: string
): string {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
}