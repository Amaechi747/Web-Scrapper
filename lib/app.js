"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const html_metadata_parser_1 = require("html-metadata-parser");
/*
implement your server code here
*/
const PORT = process.env.PORT || 3001;
const server = http_1.default.createServer((req, res) => {
    var _a;
    if (req.method === "GET") {
        const dataStore = {
            title: 'string',
            description: 'string',
            imageUrls: []
        };
        // Get path
        // let myPath = req.url?.split('/')[1];
        let myPath = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split('url=')[1];
        // myPath = `https://www.${myPath}`;
        // Derive metadata
        (async function myParser() {
            try {
                const result = await html_metadata_parser_1.parser(`${myPath}`);
                if ((result.meta.title !== undefined) && result.meta.description !== undefined
                    && result.og.image !== undefined && result.images !== undefined) {
                    dataStore['title'] = result.meta.title;
                    dataStore['description'] = result.meta.description;
                    dataStore['imageUrls'].push(result.og.image);
                    result.images.forEach((image) => {
                        dataStore['imageUrls'].push(image);
                    });
                }
                res.end(JSON.stringify(dataStore, null, 3));
                return dataStore;
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ messgae: 'Route not found' }));
            }
        })();
    }
});
server.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
