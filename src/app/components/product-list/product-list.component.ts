import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductStoreService } from '../../services/product-store.service';
import { ProductView } from '../../models/product-view.model';

type SortField = 'name' | 'id' | 'price' | 'volume' | 'stock';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allProducts: ProductView[] = [];
  filteredProducts: ProductView[] = [];
  categories: string[] = [];

  loading = true;

  // Filters
  searchName = '';
  searchId = '';
  maxPriceInput = '';
  inStockOnly = false;
  volFrom = '';
  volTo = '';
  selectedCategory = '';

  // Sort
  sortField: SortField = 'name';
  sortDir: SortDir = 'asc';

  // Stats
  get totalCount() { return this.allProducts.length; }
  get shownCount() { return this.filteredProducts.length; }
  get inStockCount() { return this.allProducts.filter(p => p.inStock).length; }

  private filters$ = new BehaviorSubject<void>(undefined);

  constructor(private store: ProductStoreService) {}

  ngOnInit(): void {
    this.store.loadProducts().pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.allProducts = products;
      this.categories = [...new Set(products.map(p => p.categoryName))].filter(Boolean).sort();
      this.loading = false;
      this.applyFilters();
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allProducts];

    const nameTerm = this.searchName.toLowerCase().trim();
    if (nameTerm) result = result.filter(p => p.name.toLowerCase().includes(nameTerm));

    const idTerm = this.searchId.toLowerCase().trim();
    if (idTerm) result = result.filter(p => p.id.toLowerCase().includes(idTerm));

    const maxPrice = parseFloat(this.maxPriceInput);
    if (!isNaN(maxPrice)) result = result.filter(p => p.price <= maxPrice);

    if (this.inStockOnly) result = result.filter(p => p.inStock);

    const volFromNum = parseFloat(this.volFrom);
    if (!isNaN(volFromNum)) result = result.filter(p => p.volume >= volFromNum);

    const volToNum = parseFloat(this.volTo);
    if (!isNaN(volToNum)) result = result.filter(p => p.volume <= volToNum);

    if (this.selectedCategory) result = result.filter(p => p.categoryName === this.selectedCategory);

    result = this.sortProducts(result);
    this.filteredProducts = result;
  }

  sortProducts(products: ProductView[]): ProductView[] {
    return [...products].sort((a, b) => {
      let valA: any, valB: any;
      switch (this.sortField) {
        case 'name':    valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); break;
        case 'id':      valA = a.id.toLowerCase();   valB = b.id.toLowerCase();   break;
        case 'price':   valA = a.price;              valB = b.price;              break;
        case 'volume':  valA = a.volume;             valB = b.volume;             break;
        case 'stock':   valA = a.stock;              valB = b.stock;              break;
      }
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  setSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchId = '';
    this.maxPriceInput = '';
    this.inStockOnly = false;
    this.volFrom = '';
    this.volTo = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchName || this.searchId || this.maxPriceInput || this.inStockOnly || this.volFrom || this.volTo || this.selectedCategory);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0 }).format(price);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
