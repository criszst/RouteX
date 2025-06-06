import { ServerResponse, IncomingMessage } from "http";
import { Http2ServerRequest } from "http2";

const blockedIps: Map<string, boolean> = new Map<string, boolean>([
  // ['::1', true], // IPv6 localhost
  // ['127.0.0.1', true], // IPv4 localhost
]);

const ipRequestCount = new Map<string, number>();

const IPMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void): ServerResponse | void => {
  
  blockIpsMiddleware(req, res, next);
};



const blockIpsMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void): ServerResponse | void => {
  const ip = req.socket.remoteAddress || req.connection.remoteAddress || '';

  if (ip && blockedIps.has(ip)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });

    return res.end(JSON.stringify({
      error: 'Access denied',
      message: 'You are not allowed to access this resource.',
    }));
  }
  if (!ip) {
    res.writeHead(400, { 'Content-Type': 'application/json' });

    return res.end(JSON.stringify({
      error: 'Bad Request',
      message: 'IP address not found.',
    }));
  }

  next();
};

// const rateLimitMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void): ServerResponse | void => {
//   const ip = req.socket.remoteAddress || req.connection.remoteAddress || '';
//   const count = ipRequestCount.get(ip) || 0;
//   const limit = 10;

//   ipRequestCount.set(ip, count + 1);

//   if (count >= limit) {
//     res.writeHead(429, { 'Content-Type': 'application/json' });

//     return res.end(JSON.stringify({
//       error: 'Rate limit exceeded',
//       message: 'You have exceeded the number of allowed requests.',
//     }));
//   }

//   next();
// };


// i think this is not needed, bc why would we reset the count?
const resetIpCount = (): void => {
  ipRequestCount.clear();
  console.log('IP request count reset');
};

export { IPMiddleware, blockIpsMiddleware, resetIpCount, blockedIps, ipRequestCount };