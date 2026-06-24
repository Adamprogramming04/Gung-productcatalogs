import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  children: Category[];
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly categories: Category;

  constructor() {
    this.categories = JSON.parse(
      '{"id":"sROT","name":"Produktsida","children":[{"id":"s04","name":"Slang & Kabelupprullare","children":[{"id":"s0405","name":"Avfettning","children":[{"id":"AV300-1006","name":"Slangupprullare Avfettning 10m","children":[]},{"id":"AV450-1006","name":"Slanguppr. avfettning 10m 2","children":[]},{"id":"AV430-1506","name":"Slangupprullare Avfettning 15m","children":[]}]},{"id":"s0406","name":"Avspärrning","children":[{"id":"VXL-10WK","name":"Upprullare för avspärrning 10 m","children":[]},{"id":"VXL-15WK","name":"Upprullare för avspärrning 15 m","children":[]},{"id":"VXL-20WK","name":"Upprullare för avspärrning 20 m","children":[]}]},{"id":"s0407","name":"Butan/Propan","children":[{"id":"8430-802","name":"Slanguppr. för Butan & Propan med 20m","children":[]},{"id":"8430-804","name":"Slanguppr. för Butan & Propan med 18m","children":[]}]}]}]}'
    );
  }

  public getCategories(): Observable<Category> {
    return of(this.categories);
  }

  public getAlotOfCategories(): Observable<Category> {
    const sROT: Category = { id: 'sROT', name: 'Produktsida', children: [] };
    for (let n = 0; n < 5; n++) {
      const child: Category = { id: 'sRand0' + n, name: 'Random category ' + n, children: [] };
      for (let i = 0; i < 100000; i++) {
        child.children.push({ id: 'RAND_' + n + '_' + i, name: 'Product ' + n + '_' + i, children: [] });
      }
      sROT.children.push(child);
    }
    return of(sROT);
  }
}
