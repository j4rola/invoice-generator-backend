"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const stream_1 = require("stream");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('testing server');
});
app.post('/', (req, res) => {
    console.log(req.body);
    res.send('testing server');
});
app.get('/generate-pdf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.query);
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        // Configure page settings as needed      
        // For example, you can set the page content with page.setContent(html)
        // Navigate to the page that the client is on
        //await page.goto(req.headers.referer || '', { waitUntil: 'networkidle0' });
        yield page.goto('https://invoice-generator-frontend-5p3c.vercel.app/invoice');
        const newValue = 'x';
        yield page.evaluate((newValue) => {
            const dynamicElement = document.querySelector('#test');
            dynamicElement.textContent = newValue;
        }, newValue);
        // Generate the PDF stream
        const pdfStream = yield page.pdf({
            format: 'a4',
            preferCSSPageSize: true,
            printBackground: true
        });
        // Close the Puppeteer browser  
        yield browser.close();
        // Set the appropriate headers for PDF response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        // Convert the PDF stream to a Readable stream
        const readableStream = new stream_1.Readable();
        readableStream.push(pdfStream);
        readableStream.push(null);
        // Pipe the PDF stream to the response
        readableStream.pipe(res);
    }
    catch (error) {
        console.error('Error generating the PDF file:', error);
        res.status(500).send(error);
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
//# sourceMappingURL=index.js.map