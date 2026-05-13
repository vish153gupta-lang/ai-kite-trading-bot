import kiteConnect from 'kiteconnect';
import { EventEmitter } from 'events';

export interface KiteConfig {
  apiKey: string;
  apiSecret: string;
  accessToken?: string;
}

export class KiteService extends EventEmitter {
  private kc: any;
  private config: KiteConfig;
  private isConnected = false;

  constructor(config: KiteConfig) {
    super();
    this.config = config;
    this.kc = new kiteConnect.KiteConnect({
      api_key: config.apiKey,
    });
  }

  async generateAuthURL(): Promise<string> {
    return this.kc.getLoginURL();
  }

  async generateAccessToken(requestToken: string): Promise<string> {
    const response = await this.kc.generateSession(requestToken, this.config.apiSecret);
    this.config.accessToken = response.access_token;
    this.kc.setAccessToken(response.access_token);
    this.isConnected = true;
    this.emit('connected');
    return response.access_token;
  }

  async getProfile() {
    return this.kc.getProfile();
  }

  async getMargins() {
    return this.kc.getMargins();
  }

  // Market Data
  async getQuote(instrumentTokens: number[]) {
    return this.kc.getQuote(instrumentTokens);
  }

  async getLTP(instrumentTokens: number[]) {
    return this.kc.getLTP(instrumentTokens);
  }

  async getHistoricalData(
    instrumentToken: number,
    interval: string,
    from: string,
    to: string
  ) {
    return this.kc.getHistoricalData(instrumentToken, interval, from, to);
  }

  // Order Placement
  async placeOrder(order: any) {
    return this.kc.placeOrder(order.variety || 'regular', order);
  }

  async modifyOrder(orderId: string, order: any) {
    return this.kc.modifyOrder(order.variety || 'regular', orderId, order);
  }

  async cancelOrder(orderId: string, variety: string = 'regular') {
    return this.kc.cancelOrder(variety, orderId);
  }

  // WebSocket for live ticks
  getWebSocket() {
    const ticker = new kiteConnect.Ticker({
      api_key: this.config.apiKey,
      access_token: this.config.accessToken,
    });

    ticker.connect();
    ticker.on('ticks', (ticks: any) => this.emit('ticks', ticks));
    ticker.on('connect', () => this.emit('ws-connected'));
    ticker.on('disconnect', () => this.emit('ws-disconnected'));

    return ticker;
  }

  isReady() {
    return this.isConnected && !!this.config.accessToken;
  }
}
