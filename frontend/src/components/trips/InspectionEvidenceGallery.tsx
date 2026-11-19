import { useEffect, useState } from "react";
import { apiGetBlob } from "../../lib/api";

interface InspectionEvidenceGalleryProps {
  photoUrls?: string[] | null;
  title?: string;
}

function InspectionEvidenceImage({
  url,
  alt,
  downloadName,
}: {
  url: string;
  alt: string;
  downloadName: string;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;

    setImageUrl(null);
    setError(null);

    apiGetBlob(url, controller.signal)
      .then((image) => {
        if (!image.type.startsWith("image/")) {
          throw new Error("The inspection evidence is not a valid image.");
        }
        objectUrl = URL.createObjectURL(image);
        setImageUrl(objectUrl);
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load inspection photo.");
        }
      });

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  return (
    <div style={{ minHeight: 160, display: "grid", placeItems: "center", background: "#f8fafc" }}>
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={alt}
            style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: 8 }}>
            <a href={imageUrl} target="_blank" rel="noreferrer">
              View full size
            </a>
            <a href={imageUrl} download={downloadName}>
              Download
            </a>
          </div>
        </>
      ) : error ? (
        <div role="status" style={{ padding: 12, color: "#9b1c1c", textAlign: "center" }}>
          {error}
        </div>
      ) : (
        <div role="status" style={{ padding: 12, color: "#526071" }}>Loading photo…</div>
      )}
    </div>
  );
}

export default function InspectionEvidenceGallery({
  photoUrls,
  title = "Evidence",
}: InspectionEvidenceGalleryProps) {
  const urls = Array.isArray(photoUrls) ? photoUrls.filter(Boolean) : [];

  if (!urls.length) {
    return (
      <div style={{ padding: 12, borderRadius: 12, background: "#f8fafc", color: "#526071", border: "1px solid #e7edf5" }}>
        No evidence photos available for this inspection.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {urls.map((url, index) => (
        <div key={`${url}-${index}`} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #dfe6ee", background: "#f8fafc" }}>
          <InspectionEvidenceImage
            url={url}
            alt={`${title} evidence ${index + 1}`}
            downloadName={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-evidence-${index + 1}.${url.split(".").pop()}`}
          />
        </div>
      ))}
    </div>
  );
}
