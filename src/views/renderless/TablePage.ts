import { NTableColumnOrder, NTableColumnStickies, NTableColumnWidths, NTableHiddenColumns, NTablePagination, NTableSearch } from '@/components/NTable';
import { Component, Vue } from 'vue-property-decorator';

enum StorageSuffixes {
  COLUMN_WIDTHS = 'column-widths',
  HIDDEN_COLUMNS = 'hidden-columns',
  COLUMN_ORDER = 'column-order',
  COLUMN_STICKIES = 'column-stickies',
  SEARCH = 'search',
  PAGINATION = 'pagination'
}

@Component
export default class TablePage<T> extends Vue {
  name?: string;

  private localHiddenColumns: NTableHiddenColumns | null = null;
  private localColumnOrder: NTableColumnOrder | null = null;
  private localColumnWidths: NTableColumnWidths | null = null;
  private localColumnStickies: NTableColumnStickies | null = null;
  private localSearch: NTableSearch | null = null;
  private localPagination: NTablePagination | null = null;
  private localItems: T[] = [];

  get hiddenColumns(): NTableHiddenColumns {
    return this.localHiddenColumns ?? this.getFromStorage(StorageSuffixes.HIDDEN_COLUMNS, {});
  }
  set hiddenColumns(value: NTableHiddenColumns) {
    this.localHiddenColumns = value;
    this.setToStorage(StorageSuffixes.HIDDEN_COLUMNS, this.localHiddenColumns);
  }

  get columnOrder(): NTableColumnOrder {
    return this.localColumnOrder ?? this.getFromStorage(StorageSuffixes.COLUMN_ORDER, {});
  }
  set columnOrder(value: NTableColumnOrder) {
    this.localColumnOrder = value;
    this.setToStorage(StorageSuffixes.COLUMN_ORDER, this.localColumnOrder);
  }

  get columnWidths(): NTableColumnWidths {
    return this.localColumnWidths ?? this.getFromStorage(StorageSuffixes.COLUMN_WIDTHS, {});
  }
  set columnWidths(value: NTableColumnWidths) {
    this.localColumnWidths = value;
  }

  get columnStickies(): NTableColumnStickies {
    return this.localColumnStickies ?? this.getFromStorage(StorageSuffixes.COLUMN_STICKIES, {});
  }
  set columnStickies(value: NTableColumnStickies) {
    this.localColumnStickies = value;
    this.setToStorage(StorageSuffixes.COLUMN_STICKIES, this.localColumnStickies);
  }

  get search(): NTableSearch {
    return this.localSearch ?? this.getFromStorage(StorageSuffixes.SEARCH, {});
  }
  set search(value: NTableSearch) {
    this.localSearch = value;
    this.setToStorage(StorageSuffixes.SEARCH, this.localSearch);
  }

  get items(): T[] {
    return this.localItems;
  }
  set items(value: T[]) {
    this.localItems = value;
  }

  get pagination(): NTablePagination {
    return this.localPagination ?? this.getFromStorage(StorageSuffixes.PAGINATION, {
      page: 1,
      totalPages: 20,
      itemsPerPage: 10,
    });
  }
  set pagination(value: NTablePagination) {
    this.localPagination = value;
    this.setToStorage(StorageSuffixes.PAGINATION, this.localPagination);
  }

  saveColumnWidths(value: NTableColumnWidths): void {
    this.setToStorage(StorageSuffixes.COLUMN_WIDTHS, value);
  }

  private setToStorage(suffix: string, value: unknown): void {
    localStorage.setItem(`${this.name}-${suffix}`, JSON.stringify(value));
  }

  private getFromStorage<T>(suffix: string, defaultValue: T): T {
    const rawData = localStorage.getItem(`${this.name}-${suffix}`);
    if (!rawData) return defaultValue;

    return JSON.parse(rawData);
  }
}
