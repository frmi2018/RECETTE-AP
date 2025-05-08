import { useState } from "react";
import styles from "./ImageUpload.module.css"

export default function ImageUpload({ image, onImageChange }) {
  const [preview, setPreview] = useState(image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      onImageChange(imageUrl);
    }
  };

  return (
    <>
      <label htmlFor="imageUpload" className={styles.imageUpload}>
        <img src={preview} alt="Aperçu de l'image" />
        <span>Changer l'image</span>
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </>
  );
}
