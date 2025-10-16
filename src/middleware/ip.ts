import { ServerResponse, IncomingMessage } from "http";

class IPMiddleware {
  constructor() {
    console.log('IP Middleware initialized');
  }

  private static instance: IPMiddleware;

  public static getInstance(): IPMiddleware {
    if (!IPMiddleware.instance) {
      IPMiddleware.instance = new IPMiddleware();
    }
    return IPMiddleware.instance;
  }

  public static IpRquestCount: Map<string, number> = new Map<string, number>();

  private static rateLimit = 1000; // max requests per minute

  private static blockedIps: Set<string> = new Set<string>(
    // ['::1',
    //   '127.0.0.1',
    // ]
  );

  public static IpMiddlewareHandler = (req: IncomingMessage, res: ServerResponse, next: () => void): ServerResponse | void | boolean => {
    const ip = req.socket.remoteAddress;

    if (!ip) {
      res.writeHead(400, { 'Content-Type': 'application/json' });

      return res.write(JSON.stringify({
        error: 'Bad Request',
        message: 'IP address not found.',
      }));
    }

    console.log(`Incoming request from IP: ${ip}`);

    if (ip && this.blockedIps.has(ip)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });

      this.IpRquestCount.set(ip, (this.IpRquestCount.get(ip) || 0) + 1);

      console.log(`Blocked IP ${ip} has made ${this.IpRquestCount.get(ip)} requests.`);

      return res.write(JSON.stringify({
        error: 'Access denied',
        message: '\n You are not allowed to access this resource.',
      }));
    }

    this.IpRquestCount.set(ip, (this.IpRquestCount.get(ip) || 0) + 1);

    console.log(`IP ${ip} has made ${this.IpRquestCount.get(ip)} requests.`);

    const requestCount = this.IpRquestCount.get(ip) ?? 0;

    if (requestCount >= this.rateLimit) {
      this.blockedIps.add(ip);
      this.IpRquestCount.set(ip, 0);
    }

    next();
  }

  


  public static ResetIpCount = (): void => {
    this.IpRquestCount.clear();
    console.log('IP request count reset');
  }

}

export { IPMiddleware };