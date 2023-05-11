import PDFDocument from 'pdfkit'; 
import fs from 'fs'; 
import express from 'express'; 
import { document } from 'pdfkit/js/page';

const app = express(); 

app.get('/test', (req, res) => {          
  res.json({test: 'test'})
});

const port = process.env.port || 3000

 
app.get('/download', (req, res) => {          
  const doc = new PDFDocument();       
  
  doc.font('Helvetica')
  // Add content to the PDF document   
  doc.fontSize(25).fillColor('red').text('Hello, world!',  {align: 'center'}); 
  doc.fontSize(18).fillColor('red').text('Hello, world!',  {align: 'center'});   
  
  const myName = 'my-invoice'      
  
  // Set the content type and attachment header     
  res.setHeader('Content-Type', 'application/pdf');       
  res.setHeader('Content-Disposition', `attachment; filename=${myName}.pdf`);    
  
  // Pipe the PDF document to the response    
  doc.pipe(res);   
  
  // Close the PDF document and end the response  
  doc.end();  
});

app.listen(port, () => {                          
  console.log(`Server started on port ${port}`);     
});   
