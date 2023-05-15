"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const pdf = __importStar(require("html-pdf"));
const fs_1 = __importDefault(require("fs"));
const mustache_1 = __importDefault(require("mustache"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const templateFilePath = path_1.default.join(__dirname, '/index.html');
const cssFilePath = path_1.default.join(__dirname, '/style.css'); // Path to your CSS file
app.get('/', (req, res) => {
    res.send('testing');
});
app.get('/download', (req, res) => {
    try {
        // Read the HTML template file content
        const template = fs_1.default.readFileSync(templateFilePath, 'utf-8');
        // Read the CSS file content
        const css = fs_1.default.readFileSync(cssFilePath, 'utf-8');
        // Replace the placeholders in the template with actual values from the request
        const html = mustache_1.default.render(template, {
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
    }
    catch (error) {
        console.log(error);
        res.json({ error: error });
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
//# sourceMappingURL=index.js.map