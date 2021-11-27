import { NTableColumn, NTableColumnType, NFilterForm } from '../types';
import NTextFilter from './NTextFilter.vue';
import NDateFilter from './NDateFilter.vue';
import NSelectFilter from './NSelectFilter.vue';

export function createFilterFormByColumn(options: FilterFormOptions): NFilterForm {
  const attrs = {
    title: `Фильтр поля "${options.column.text}"`,
    initValue: options.initValue,
    dictionary: options.dictionary
  };
  const on = {
    close: options.onClose,
    apply: (value: unknown) => {
      options.onApply?.(options.column.value, value);
    }
  };

  switch (options.column.type) {
    case NTableColumnType.SELECT:
      return {
        component: NSelectFilter,
        attrs,
        on
      };
    case NTableColumnType.DATE:
      return {
        component: NDateFilter,
        attrs,
        on
      };
    default:
      return {
        component: NTextFilter,
        attrs,
        on
      };
  }
}

type FilterFormOptions = {
  column: NTableColumn;
  onApply?: (key: string, value: unknown) => void;
  onClose?: () => void;
  initValue?: unknown;
  dictionary?: Record<string, string>;
};
