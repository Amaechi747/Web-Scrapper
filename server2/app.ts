import http, { IncomingMessage, Server, ServerResponse } from "http";
import {parser} from 'html-metadata-parser'
/*
implement your server code here
*/
const PORT = process.env.PORT || 3001 
interface Idata{
  title: string;
  description: string;
  imageUrls: string []
}

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      
      const dataStore: Idata = {
          title : 'string',
          description: 'string',
          imageUrls: []
      };
      // Get path
      let myPath = req.url?.split('url=')[1];
      // let myPath = req.url?.split('/')[1];
      // myPath = `https://www.${myPath}`;
      // Derive metadata
      (async function myParser (){
        try{
          const result = await parser(`${myPath}`)
          if ((result.meta.title !== undefined) && result.meta.description !== undefined 
              && result.og.image !== undefined && result.images !== undefined){
            dataStore['title'] = result.meta.title;
            dataStore['description'] = result.meta.description;
            dataStore['imageUrls'].push(result.og.image)
            result.images.forEach((image)=>{
              dataStore['imageUrls'].push(image);
            })
          }
          res.end(JSON.stringify(dataStore, null, 3));
          return dataStore;
        }catch(error){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({messgae: 'Route not found'}));
        }
      })();
      
    }
  }
);
server.listen(PORT, ()=> console.log(`Listening on Port ${PORT}`));
