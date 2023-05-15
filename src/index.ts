import path from 'path';
import express from 'express';
import * as pdf from 'html-pdf';
import fs from 'fs';
import mustache from 'mustache';

const app = express();
const templateFilePath = path.join(__dirname, '/index.html');
const cssFilePath = path.join(__dirname, '/style.css'); // Path to your CSS file

app.get('/', (req, res) => {
  res.send('testing')
})

app.get('/download', (req, res) => {

  try {
    // Read the HTML template file content
  const template = fs.readFileSync(templateFilePath, 'utf-8');

  // Read the CSS file content
  const css = fs.readFileSync(cssFilePath, 'utf-8'); 

  // Replace the placeholders in the template with actual values from the request
  const html = mustache.render(template, {
    name: 'test',
    email: 'testing',    
    // Add more values as needed
  });

  // Combine HTML template and CSS styles
  const htmlWithStyles = `
    <html>
      <head>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  // Generate the PDF from HTML
  pdf.create(htmlWithStyles).toStream((err, stream) => {
    if (err) {
      res.status(500).send('An error occurred');
      return;
    }

    // Set the appropriate headers for PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');

    // Pipe the PDF stream to the response
    stream.pipe(res);
  });
  } catch (error) {
    console.log(error)
  }
  
});

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


