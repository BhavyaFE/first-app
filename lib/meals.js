import fs from 'node:fs';
import path from 'node:path';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

// In lib/meals.js
export async function getMeals() {
    // Your logic to fetch meals
    return db.prepare('SELECT * FROM meals').all();
  } 
  
export function getMeal(slug) {
  // Fetch meal by slug from the database
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // Save the image to the server
  const image = meal.image; // This is the image file received from the form
  if (image) {
    let imagePath = '';

    if (image.startsWith('http')) {
      // If it's a URL, use the URL directly
      imagePath = image;
    } else{

    const extension = image.name.split('.').pop(); // Get file extension
    const fileName = `${meal.slug}.${extension}`; // Use slug as part of the filename

    // Create a writable stream to save the image file
    const imagePath = path.join('public', 'images', fileName);
    const stream = fs.createWriteStream(imagePath);

    // Convert the image to a buffer and write it to the stream
    const bufferedImage = await image.arrayBuffer();
    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error('Saving image failed!');
      }
    });

    imagePath = `/images/${fileName}`;
    }

    // Store the image URL (or file path) in the meal object
    meal.image = imagePath;
    
  }

  // Insert the meal into the database
  db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `).run(meal);
}
