'use server';

import { redirect } from 'next/navigation';
import { saveMeal } from './meals';
import { revalidatePath } from 'next/cache';

function isInvalidText(text) {
  return !text;
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),  // Ensure image is included
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  // Basic validation
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image // Ensure image is present
  ) {
    return {
      message: 'Invalid input, please ensure all fields are filled out correctly and the image is uploaded.',
    };
  }

  // Call saveMeal to store the meal in the database, including image handling
  await saveMeal(meal);
  revalidatePath('/meals');
  // Redirect after successful submission
  redirect('/meals');
}
