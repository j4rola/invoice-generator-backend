import path from 'path';
import express from 'express';
import cors from 'cors'; 
import puppeteer from 'puppeteer';
import { Readable } from 'stream';
import bodyParser from 'body-parser';
import formatDate from '../utils/functions'; 

const app = express();
app.use(cors())
app.use(bodyParser.json());


app.get('/', (req, res) => {   
      
  res.send('testing server')
})

app.post('/', (req, res) => {   
  console.log(req.body) 
  res.send('testing server')
})

app.get('/generate-pdf', async (req, res) => {  
  try {
    console.log(req.query)
    const browser = await puppeteer.launch();  
    const page = await browser.newPage();  

    // Configure page settings as needed      
    // For example, you can set the page content with page.setContent(html)
    
    // Navigate to the page that the client is on
    //await page.goto(req.headers.referer || '', { waitUntil: 'networkidle0' });
    await page.goto('https://invoice-generator-frontend-5p3c.vercel.app/invoice');

    const newValue: any = { 
      
      title: req.query.title, 
      paymentTerms: req.query.paymentTerms,
      invoiceDate: formatDate(req.query.invoiceDate), 
      invoiceAmount: req.query.invoiceAmount
    
    }
    await page.evaluate((newValue) => {
      const title: any = document.querySelector('#title')
      const paymentTerms: any = document.querySelector('#paymentTerms')
      const invoiceDate: any = document.querySelector('#invoiceDate')
      const invoiceAmount: any = document.querySelector('#invoiceAmount')
      title.textContent = newValue.title
      paymentTerms.textContent = newValue.paymentTerms
      invoiceDate.textContent = newValue.invoiceDate
      invoiceAmount.textContent = newValue.invoiceAmount 
    }, newValue);
    
    // Generate the PDF stream
    const pdfStream = await page.pdf({ 
      format: 'a4', 
      preferCSSPageSize: true,
      printBackground: true 
    });
    
    

    // Close the Puppeteer browser  
    await browser.close();

     // Set the appropriate headers for PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');

    // Convert the PDF stream to a Readable stream
    const readableStream = new Readable();
    readableStream.push(pdfStream);
    readableStream.push(null);

    // Pipe the PDF stream to the response
    readableStream.pipe(res);
    
  } catch (error) {
    console.error('Error generating the PDF file:', error);   
    res.status(500).send(error);    
  }
});


const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server started on port ${port}`);  
});


