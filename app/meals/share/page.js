'use client';

import { useState, useTransition } from 'react';
import { useActionState } from 'react';
import ImagePicker from '@/components/meals/image-picker';
import classes from './page.module.css';
import { shareMeal } from '@/lib/actions';
import MealsFormSubmit from '@/components/meals/meals-form-submit';

export default function ShareMealPage() {
  const [state, formAction] = useActionState(shareMeal, { message: null });
  const [image, setImage] = useState(null);  // Store the selected image (either file or URL)

  // React hook to manage async transitions
  const [isPending, startTransition] = useTransition();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent default form submission

    // Create FormData instance from the form element
    const formData = new FormData(event.target);

    // Append the selected image to the FormData
    if (image) {
      formData.append('image', image);  // Append local image file
    } 

    // Ensure async logic is wrapped within startTransition to manage async actions
    startTransition(() => {
      formAction(formData);  // Pass FormData to the formAction (shareMeal)
    });
  };

  // Handle image selection from ImagePicker (either local file or external URL)
  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);  // Set the selected image (file or URL)
  };

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
            ></textarea>
          </p>
          
          {/* Image Picker component to select image */}
          <ImagePicker label="Your image" name="image" onImageSelect={handleImageSelect} />
          
          {/* Display any messages after form submission */}
          {state.message && <p>{state.message}</p>}
          
          <p className={classes.actions}>
            <MealsFormSubmit disabled={isPending} />
          </p>
        </form>
      </main>
    </>
  );
}
