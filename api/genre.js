const fs = require('fs');
const csv = require('csv-parser');

const filePath = './merged.csv'; // Replace with the path to your CSV file

function list() {
  return new Promise((resolve, reject) => {
    const categoriesSet = new Set();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Assuming the category field is named 'categories'
        const categories = row.categories;
        if (categories) {
          // Split the categories by ','
          categories.split(',').forEach((category) => {
          // Remove brackets and trim spaces
          const cleanedCategory = category.replace(/[\[\]']/g, '').trim(); 
          if (cleanedCategory != ''){
            categoriesSet.add(cleanedCategory);
          }
          
        });
      }
      })
      .on('end', () => {
        const distinctCategories = Array.from(categoriesSet);
        console.log(distinctCategories)
        resolve(distinctCategories);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Use the list function and handle the promise
list()
  .then(distinctCategories => {
    return distinctCategories;
  })
  .catch(error => {
    console.error('Error processing file:', error);
  });

// Exporting the list function if needed
module.exports = { list };
