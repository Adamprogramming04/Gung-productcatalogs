import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  extra: { [s: string]: any };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products: { [s: string]: Product };

  constructor() {
    this.products = JSON.parse(
      '{"AV300-1006":{"id":"AV300-1006","name":"Slangupprullare Avfettning 10m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"TU","LGA":"       -1.00","PRI":"    4170.00","TYP":"","VOL":"    3.500","VPE":"   14.500","XP1":"          0","XP2":"          0"}}},"AV450-1006":{"id":"AV450-1006","name":"Slanguppr. avfettning 10m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"TU","LGA":"       0.00","PRI":"    4115.00","TYP":"","VOL":"    2.700","VPE":"    0.000","XP1":"          0","XP2":"          0"}}},"AV430-1506":{"id":"AV430-1506","name":"Slangupprullare Avfettning 15m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"TU","LGA":"       1.00","PRI":"    4875.00","TYP":"","VOL":"    5.300","VPE":"    0.000","XP1":"          0","XP2":"          0"}}},"VXL-10WK":{"id":"VXL-10WK","name":"Upprullare för avspärrning 10 m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"TU","LGA":"       2.00","PRI":"    3050.00","TYP":"","VOL":"    1.700","VPE":"    0.000","XP1":"          0","XP2":"          0"}}},"VXL-15WK":{"id":"VXL-15WK","name":"Upprullare för avspärrning 15 m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"TU","LGA":"       0.00","PRI":"    3420.00","TYP":"","VOL":"    3.200","VPE":"    0.000","XP1":"          0","XP2":"          0"}}},"VXL-20WK":{"id":"VXL-20WK","name":"Upprullare för avspärrning 20 m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"TU","LGA":"       3.00","PRI":"    3830.00","TYP":"","VOL":"    1.100","VPE":"    0.000","XP1":"          0","XP2":"          0"}}},"8430-802":{"id":"8430-802","name":"Slanguppr. för Butan & Propan med 20m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"SV","LGA":"       1.00","PRI":"    7170.00","TYP":"","VOL":"    5.200","VPE":"    0.000","XP1":"          0","XP2":"          0"}}},"8430-804":{"id":"8430-804","name":"Slanguppr. för Butan & Propan med 18m","children":[],"extra":{"AGA":{"APE":"      1","KAT":"SV","LGA":"       3.00","PRI":"    7200.00","TYP":"","VOL":"    7.500","VPE":"   20.200","XP1":"          0","XP2":"          0"}}}}'
    );
  }

  public getProduct(id: string): Observable<Product> {
    return of(this.products[id]);
  }

  public getRandomProduct(id: string): Observable<Product> {
    const productKeys = Object.keys(this.products);
    const targetId = productKeys[this.hashcode(id) % productKeys.length];
    return of(this.products[targetId]);
  }

  private hashcode(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const chr = id.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
