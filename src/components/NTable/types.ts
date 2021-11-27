import { VueConstructor } from 'vue';
import { Vue } from 'vue-property-decorator';

export type NTableColumn = {
  type?: NTableColumnType,
  value: string;
  text: string;
  visible?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  dictionaryField?: string;
};

export enum NTableColumnType {
  TEXT = 'TEXT',
  DATE = 'DATE',
  SELECT = 'SELECT',
}

export type NTableItem = Record<string, unknown>;

export type NTableColumnOrder = Record<string, number>;

export type NTableColumnWidths = Record<string, number>;

export type NTableColumnStickies = Record<string, boolean>;

export type NTableHiddenColumns = Record<string, boolean>;

export type NTableSearch = Record<string, unknown>;

export type NTableColumnAttrs = NTableColumn & {
  width?: number;
  position?: number;
  sticky?: boolean;
  style?: Record<string, unknown>;
  class?: string;
};

export type NTablePagination = {
  page?: number;
  itemsPerPage?: number;
  totalElements?: number;
  totalPages?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
};

export type NFilterForm = {
  component: VueConstructor<Vue>;
  attrs?: Record<string, unknown>;
  on?: Record<string, unknown>;
};

export type NFilterChip = {
  label: string;
  formattedValue?: string;
  value: string;
  column: NTableColumn;
};

export type NTableDictionary = {
  [key: string]: Record<string, string>;
};

export type NSelectItem = {
  value: string;
  text: string;
};
