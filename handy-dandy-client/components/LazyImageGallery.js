"use client";
import { useEffect } from "react";

export default function LazyImageGallery() {
  useEffect(() => {
    const images = document.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });
    images.forEach((img) => observer.observe(img));
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Lazy Loaded Images</h2>
      {[128, 256, 512].map((size) => (
        <img
          key={size}
          data-src={`/images/tools-and-utensils_${size}.png`}
          alt={`Tool Icon ${size}`}
          width={size}
          height={size}
          className="mx-auto my-4 shadow rounded"
        />
      ))}
    </div>
  );
}
