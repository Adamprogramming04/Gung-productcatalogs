import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Category, CategoryService } from './category.service';
import { ProductService } from './product.service';
import { ProductView } from '../models/product-view.model';

interface ProductEntry {
  productId: string;
  categoryId: string;
  categoryName: string;
}

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  private flattenTree(node: Category, parentCatId: string, parentCatName: string, results: ProductEntry[]): void {
    const isCategory = node.id.startsWith('s');
    const catId = isCategory ? node.id : parentCatId;
    const catName = isCategory ? node.name : parentCatName;

    if (!isCategory) {
      results.push({ productId: node.id, categoryId: parentCatId, categoryName: parentCatName });
    }

    for (const child of node.children) {
      this.flattenTree(child, catId, catName, results);
    }
  }

  loadProducts(): Observable<ProductView[]> {
    return this.categoryService.getCategories().pipe(
      switchMap(root => {
        const entries: ProductEntry[] = [];
        this.flattenTree(root, '', '', entries);

        const fetches = entries.map(e =>
          this.productService.getProduct(e.productId).pipe(
            map(product => {
              if (!product) return null;
              const aga = product.extra?.['AGA'] ?? {};
              const parse = (v: any) => parseFloat(String(v).trim()) || 0;
              const stock = parse(aga['LGA']);
              return {
                id: product.id,
                name: product.name,
                categoryId: e.categoryId,
                categoryName: e.categoryName,
                price: parse(aga['PRI']),
                volume: parse(aga['VOL']),
                stock,
                inStock: stock > 0,
                kat: String(aga['KAT'] ?? '').trim()
              } as ProductView;
            })
          )
        );

        return forkJoin(fetches).pipe(
          map(products => products.filter((p): p is ProductView => p !== null))
        );
      })
    );
  }
}
