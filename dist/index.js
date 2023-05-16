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
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('testing');
});
app.get('/generate-pdf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        // Configure page settings as needed
        // For example, you can set the page content with page.setContent(html)
        // Navigate to the page that the client is on
        //await page.goto(req.headers.referer || '', { waitUntil: 'networkidle0' });
        yield page.goto('http://localhost:3001/');
        // Generate the PDF stream
        const pdfStream = yield page.pdf({
            format: 'A4', preferCSSPageSize: true,
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