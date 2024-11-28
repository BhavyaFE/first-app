'use client';

import { useState } from 'react';
import Image from 'next/image';
import classes from './image-picker.module.css';

export default function ImagePicker({ label, name, onImageSelect }) {
  const [pickedImage, setPickedImage] = useState(null);   // Track selected image
  const [imageList, setImageList] = useState([]);      // Track fetched images
  const [loading, setLoading] = useState(false);      // Loading state
  const [error, setError] = useState(null);           // Error state

  // Handle local file selection
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];  // Get the first selected file
  //   if (file) {
  //     setPickedImage(URL.createObjectURL(file));  // Preview the image
  //     if (onImageSelect) {
  //       onImageSelect(file);  // Send the selected file to the parent component
  //     }
  //   }
  // };

  // Fetch images from an external API (Pixabay)
  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://pixabay.com/api/?key=47313155-c5aa9c3199e6b89a8a60f66f4&q=meal&image_type=photo&per_page=10');
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      setImageList(data.hits);  // Set the fetched image list
    } catch (err) {
      setError(`Failed to load images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection from the list of fetched images
  const handleImageSelect = (url) => {
    setPickedImage(url);  // Set the picked image URL
    if (onImageSelect) {
      onImageSelect(url);  // Send the selected URL to the parent component
    }
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="Selected image"
              layout="intrinsic"
              width={200}
              height={200}
            />
          )}
        </div>

        {/* Button to fetch images from external API */}
        <button
          className={classes.button}
          type="button"
          onClick={fetchImages} 
        >
          Fetch Images
        </button>

        {/* Loading indicator */}
        {loading && <p>Loading images...</p>}

        {/* Display error message if fetch fails */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display fetched images from Pixabay */}
        {imageList.length > 0 && (
          <div className={classes.imageList}>
            {imageList.map((image) => (
              <div
                key={image.id}
                className={classes.imageItem}
                onClick={() => handleImageSelect(image.webformatURL)}  // Select the image
              >
                <Image
                  src={image.webformatURL}
                  alt={image.tags || 'Image'}
                  layout="intrinsic"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
