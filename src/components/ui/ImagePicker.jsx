import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";

/**
 * Multi-image picker that appends on each choose (instead of replacing),
 * shows thumbnails, and lets you drop individual files before submit.
 */
const ImagePicker = ({ files, onChange, label = "Images" }) => {
  const inputId = useId();
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const next = files.map((file, index) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews(next);
    return () => next.forEach((item) => URL.revokeObjectURL(item.url));
  }, [files]);

  const handleAdd = (event) => {
    const added = Array.from(event.target.files ?? []);
    if (added.length === 0) return;
    onChange([...files, ...added]);
    /* Clear so the same file can be picked again after removal. */
    event.target.value = "";
  };

  const handleRemove = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className="meta mb-1.5 block">{label}</span>

      <label
        htmlFor={inputId}
        className="link cursor-pointer text-[0.8125rem]"
      >
        {files.length > 0 ? "Add more images" : "Choose one or more images"}
      </label>
      <input
        id={inputId}
        type="file"
        multiple
        accept="image/*"
        onChange={handleAdd}
        className="sr-only"
      />

      {previews.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previews.map((item, index) => (
            <li key={item.key} className="plate relative aspect-square">
              <img
                src={item.url}
                alt={item.name}
                className="h-full w-full object-contain p-2"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Remove ${item.name}`}
                className="absolute right-1.5 top-1.5 bg-surface p-1.5 text-muted transition-colors ease-editorial hover:text-ink"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <p className="mt-2 text-xs text-muted">
          {files.length} {files.length === 1 ? "image" : "images"} selected
        </p>
      )}
    </div>
  );
};

export default ImagePicker;
