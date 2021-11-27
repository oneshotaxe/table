<template>
  <div class="n-data-table">
    <div class="n-data-table__header">
      <h1 class="n-data-table__title">Title</h1>

      <v-spacer />

      <div class="n-data-table__global-actions">
        <v-btn text> Выгрузить </v-btn>
        <v-btn color="primary" depressed> Скачать </v-btn>
      </div>
    </div>

    <div class="n-data-table__filters elevation-1">
      <div class="filters">
        <div class="filters__body">
          <div
            v-for="chip in filterChips"
            :key="chip.column.value"
            class="filters__chip"
          >
            <span @click="onHeaderFilterClick(chip.column, chip.value)">
              {{ chip.label }}: <b>{{ chip.formattedValue || chip.value }}</b>
            </span>

            <v-icon
              small
              class="filters__chip-icon"
              @click="clearSearchField(chip.column.value)"
            >
              mdi-close
            </v-icon>
          </div>
        </div>

        <div class="filters__action" @click="clearSearch">
          <v-icon> mdi-close </v-icon>
        </div>

        <div
          class="filters__action filters__action--main"
          @click="applyFilters"
        >
          <v-icon color="primary"> mdi-magnify </v-icon>
        </div>
      </div>
    </div>

    <div ref="wrapper" class="n-table-wrapper" @scroll="onScroll">
      <table class="n-table">
        <thead>
          <tr class="n-table__header-row">
            <th
              class="
                n-table__header n-table__header-select
                sticked sticked-bottom
              "
            >
              <v-btn icon @click="selectAll">
                <v-icon>{{ selectAllIcon }}</v-icon>
              </v-btn>
            </th>

            <v-menu offset-y :close-on-content-click="false">
              <template #activator="{ attrs, on }">
                <th
                  class="
                    n-table__header n-table__header-settings
                    sticked sticked-bottom
                  "
                  :class="{ 'sticked-left': !isScrollStart }"
                >
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </th>
              </template>

              <v-list dense>
                <v-list-item @click="toggleAllColumns">
                  <v-list-item-icon>
                    <v-icon> {{ toggleAllColumnsIcon }} </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content> Показать все </v-list-item-content>
                </v-list-item>

                <v-divider />

                <draggable
                  :value="sortedColumns"
                  handle=".handle"
                  ghost-class="ghost"
                  @input="updateOrder"
                >
                  <v-list-item
                    v-for="column in sortedColumns"
                    :key="column.value"
                    @click="toggleColumn(column)"
                  >
                    <v-list-item-icon>
                      <v-icon v-if="hiddenColumns[column.value]">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <v-icon v-else> mdi-checkbox-marked-outline </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      {{ column.text }}
                    </v-list-item-content>
                    <v-list-item-icon class="handle">
                      <v-icon> mdi-menu </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </draggable>
              </v-list>
            </v-menu>

            <th
              v-for="column in columnAttrs"
              :key="column.value"
              :style="column.style"
              :class="column.class"
              class="n-table__header sticked-bottom"
            >
              <div class="n-table__header-cell">
                <div class="n-table__header-filter">
                  <v-btn icon @click="onHeaderFilterClick(column)">
                    <v-icon>mdi-filter</v-icon>
                  </v-btn>
                </div>

                <div class="n-table__header-link" @click="onSortChange(column)">
                  {{ column.text }}
                </div>

                <div
                  class="n-table__header-pin"
                  @click="toggleColumnPin(column)"
                >
                  <v-icon small>mdi-pin</v-icon>
                </div>

                <div
                  v-if="localPagination.sort === column.value"
                  class="n-table__header-sorting"
                >
                  <v-icon v-if="localPagination.direction === 'ASC'">
                    mdi-chevron-down
                  </v-icon>
                  <v-icon v-if="localPagination.direction === 'DESC'">
                    mdi-chevron-up
                  </v-icon>
                </div>

                <div
                  class="n-table__header-divider"
                  @mousedown.prevent="startResize($event, column)"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td class="n-table__body-cell n-table__body-select">
              <v-btn icon @click="select(item)">
                <v-icon v-if="selected.includes(item)">
                  mdi-checkbox-marked-outline
                </v-icon>
                <v-icon v-else> mdi-checkbox-blank-outline </v-icon>
              </v-btn>
            </td>

            <v-menu
              open-on-hover
              transition="slide-x-transition"
              :nudge-top="-2"
              :nudge-right="8"
              content-class="elevation-0"
            >
              <template #activator="{ attrs, on }">
                <td
                  class="n-table__body-cell n-table__body-actions"
                  :class="{ 'sticked-left': !isScrollStart }"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-btn icon>
                    <v-icon> mdi-menu </v-icon>
                  </v-btn>
                </td>
              </template>

              <div class="n-table__body-row-menu">
                <v-tooltip top>
                  <template #activator="{ attrs, on }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon> mdi-eye </v-icon>
                    </v-btn>
                  </template>
                  <span> Просмотр </span>
                </v-tooltip>

                <v-tooltip top>
                  <template #activator="{ attrs, on }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon> mdi-pencil </v-icon>
                    </v-btn>
                  </template>
                  <span> Редактирование </span>
                </v-tooltip>
              </div>
            </v-menu>

            <td
              v-for="column in columnAttrs"
              :key="`${column.value}-${i}`"
              :style="column.style"
              :class="column.class"
              class="n-table__body-cell"
            >
              {{ item[column.value] }}
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>

    <div
      class="n-data-table__batch-menu"
      :class="{ 'n-data-table__batch-menu--open': this.selected.length !== 0 }"
    >
      <div v-if="this.selected.length !== 0">
        <v-btn>{{ this.selected.length }}</v-btn>
      </div>
    </div>

    <div class="n-data-table__footer">
      <v-spacer />

      <span class="n-data-table__footer-text"> Записей на странице: </span>

      <div class="n-data-table__items-per-page">
        <v-select
          :value="localPagination.itemsPerPage"
          :items="[10, 15, 30]"
          hide-details
          dense
          @input="onItemsPerPageInput"
        />
      </div>

      <div class="n-data-table__pagination">
        <v-pagination
          :value="localPagination.page"
          :length="localPagination.totalPages"
          :total-visible="7"
          @input="onPageInput"
        />
      </div>

      <v-dialog
        v-if="!!filterForm"
        :value="true"
        @input="!$event && (filterForm = null)"
      >
        <component
          :is="filterForm.component"
          v-bind="filterForm.attrs"
          v-on="filterForm.on"
        />
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from "vue-property-decorator";
import draggable from "vuedraggable";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import { createFilterFormByColumn } from "./filters";
import {
  NTableColumn,
  NTableItem,
  NTableColumnAttrs,
  NTableColumnOrder,
  NTableColumnStickies,
  NTableColumnWidths,
  NTableHiddenColumns,
  NTablePagination,
  NFilterForm,
  NTableSearch,
  NFilterChip,
  NTableDictionary,
  NTableColumnType,
} from "./types";

@Component({
  components: {
    draggable,
  },
})
export default class NTable extends Vue {
  @Prop({ type: Array, default: () => [] })
  columns!: NTableColumn[];

  @Prop({ type: Array, default: () => [] })
  items!: NTableItem[];

  @Prop({ type: Object, default: () => ({}) })
  columnOrder!: NTableColumnOrder;

  @Prop({ type: Object, default: () => ({}) })
  columnWidths!: NTableColumnWidths;

  @Prop({ type: Object, default: () => ({}) })
  columnStickies!: NTableColumnStickies;

  @Prop({ type: Object, default: () => ({}) })
  hiddenColumns!: NTableHiddenColumns;

  @Prop({ type: Object, default: () => ({}) })
  pagination!: NTablePagination;

  @Prop({ type: Object, default: () => ({}) })
  search!: NTableSearch;

  @Prop({ type: Object, default: () => ({}) })
  dictionary!: NTableDictionary;

  @Ref("wrapper")
  wrapper?: HTMLElement;

  selected: NTableItem[] = [];

  isScrollStart = false;

  isScrollEnd = false;

  filterForm: NFilterForm | null = null;

  get toggleAllColumnsIcon(): string {
    if (this.isAllColumnsVisible) {
      return "mdi-checkbox-marked-outline";
    }
    return "mdi-checkbox-blank-outline";
  }

  get isAllColumnsVisible(): boolean {
    return this.columns.every((column) => !this.hiddenColumns[column.value]);
  }

  get selectAllIcon(): string {
    if (this.isAllItemsSelected) {
      return "mdi-checkbox-marked-outline";
    }
    if (this.selected.length === 0) {
      return "mdi-checkbox-blank-outline";
    }
    return "mdi-minus-box-outline";
  }

  get isAllItemsSelected(): boolean {
    return this.items.every((item) => this.selected.includes(item));
  }

  get sortedColumns(): NTableColumnAttrs[] {
    console.log("Calculate sorted columns");

    const clone = (column: NTableColumn, index: number): NTableColumnAttrs => {
      return {
        ...column,
        minWidth: column.minWidth ?? 104,
        position: this.columnOrder[column.value] ?? index,
        sticky: this.columnStickies[column.value] ?? false,
        visible: !this.hiddenColumns[column.value],
      };
    };

    const columnSortByPosition = (
      first: NTableColumnAttrs,
      second: NTableColumnAttrs
    ) => {
      const firstPosition = first.position ?? 0;
      const secondPosition = second.position ?? 0;

      return firstPosition - secondPosition;
    };

    return this.columns.map(clone).sort(columnSortByPosition);
  }

  get stickedColumns(): NTableColumnAttrs[] {
    const columnSortBySticky = (
      first: NTableColumnAttrs,
      second: NTableColumnAttrs
    ) => {
      const firstPosition = first.sticky ? 1 : 0;
      const secondPosition = second.sticky ? 1 : 0;

      return firstPosition - secondPosition;
    };

    return this.sortedColumns.slice().sort(columnSortBySticky);
  }

  get visibleColumns(): NTableColumn[] {
    console.log("Calculate visible columns");
    const isVisibleColumn = (column: NTableColumn): boolean => {
      return column.visible === undefined || column.visible === true;
    };

    return this.stickedColumns.filter(isVisibleColumn);
  }

  get columnAttrs(): NTableColumnAttrs[] {
    console.log("Calculate column attrs");
    const setColumnWidths = (column: NTableColumnAttrs) => {
      let width = 0;

      if (this.columnWidths[column.value]) {
        width = this.columnWidths[column.value];
      } else if (column.minWidth) {
        width = column.minWidth;
      }

      column.width = width;
      column.style = {
        width: `${width}px`,
        "min-width": `${width}px`,
        "max-width": `${width}px`,
      };
      return column;
    };

    let firstStickyColumnChecked = false;
    const setColumnStickies = (
      column: NTableColumnAttrs,
      index: number,
      columns: NTableColumnAttrs[]
    ) => {
      if (!column.sticky) return column;

      if (!column.style) column.style = {};

      column.class = "sticked";
      if (!firstStickyColumnChecked && !this.isScrollEnd) {
        column.class += " sticked-right";
        firstStickyColumnChecked = true;
      }

      column.style.position = "sticky";
      if (index + 1 === columns.length) {
        column.style.right = "0px";
        return column;
      }

      let right = 0;
      for (let i = index + 1; i < columns.length; i++) {
        right += columns[i].width ?? 0;
      }
      column.style.right = `${right}px`;
      return column;
    };

    return this.visibleColumns.map(setColumnWidths).map(setColumnStickies);
  }

  get localPagination(): NTablePagination {
    const totalElements = this.pagination.totalElements ?? 0;
    const itemsPerPage = this.pagination.itemsPerPage || 10;
    let direction = this.pagination.direction;

    if (!direction && this.pagination.sort) {
      direction = "ASC";
    }

    return {
      page: this.pagination.page ?? 0,
      itemsPerPage,
      totalElements,
      totalPages:
        this.pagination.totalPages ?? Math.ceil(totalElements / itemsPerPage),
      sort: this.pagination.sort,
      direction,
    };
  }

  get filterChips(): NFilterChip[] {
    return Object.entries(this.search)
      .map(([key, value]) => {
        const column = this.columns.find((column) => column.value === key);
        if (!column) return undefined;

        let formattedValue = value;
        if (
          column.type === NTableColumnType.SELECT &&
          typeof value === "string"
        ) {
          const dictionaryField = column.dictionaryField ?? column.value;
          const decryptions = this.dictionary[dictionaryField] ?? {};
          formattedValue = decryptions[value];
        }

        return {
          label: column.text,
          formattedValue,
          value,
          column,
        };
      })
      .filter(Boolean) as NFilterChip[];
  }

  toggleColumnPin(column: NTableColumnAttrs): void {
    this.$emit("update:column-stickies", {
      ...this.columnStickies,
      [column.value]: !column.sticky,
    });
  }

  startResize(e: MouseEvent, column: NTableColumnAttrs): void {
    console.log("Divider mouse down");
    const { minWidth = 0, maxWidth = Infinity, width = 0 } = column;
    const { clientX } = e;
    const startClientX = clientX - width;

    const onMousemoveDebounce = debounce((columnWidths: NTableColumnWidths) => {
      console.log("Mouse move debounce");
      this.$emit("change:column-widths", columnWidths);
    }, 100);

    const onMousemoveThrottle = throttle((e: MouseEvent) => {
      console.log("Mouse move throttle");
      let newColumnWidth = e.clientX - startClientX;

      if (newColumnWidth < minWidth) {
        newColumnWidth = minWidth;
      } else if (newColumnWidth > maxWidth) {
        newColumnWidth = maxWidth;
      }

      if (newColumnWidth === this.columnWidths[column.value]) {
        return;
      }

      const newColumnWidths = {
        ...this.columnWidths,
        [column.value]: newColumnWidth,
      };

      this.$emit("update:column-widths", newColumnWidths);

      onMousemoveDebounce(newColumnWidths);
    }, 50);

    document.addEventListener("mousemove", onMousemoveThrottle);

    const onMouseup = () => {
      console.log("Divider mouse up");

      document.removeEventListener("mousemove", onMousemoveThrottle);
    };

    document.addEventListener("mouseup", onMouseup, { once: true });
  }

  onScroll(): void {
    if (!this.wrapper) return;

    if (
      this.wrapper.offsetWidth + this.wrapper.scrollLeft >=
      this.wrapper.scrollWidth
    ) {
      this.isScrollEnd = true;
    } else if (this.isScrollEnd) {
      this.isScrollEnd = false;
    }

    if (this.wrapper.scrollLeft === 0) {
      this.isScrollStart = true;
    } else if (this.isScrollStart) {
      this.isScrollStart = false;
    }
  }

  updateOrder(columns: NTableColumn[]): void {
    this.$emit(
      "update:column-order",
      Object.fromEntries(columns.map((column, index) => [column.value, index]))
    );
  }

  toggleAllColumns(): void {
    if (!this.isAllColumnsVisible) {
      this.$emit("update:hidden-columns", {});
      return;
    }
    this.$emit(
      "update:hidden-columns",
      Object.fromEntries(this.columns.map((column) => [column.value, true]))
    );
  }

  toggleColumn(column: NTableColumn): void {
    this.$emit("update:hidden-columns", {
      ...this.hiddenColumns,
      [column.value]: !this.hiddenColumns[column.value],
    });
  }

  selectAll(): void {
    if (this.isAllItemsSelected) {
      this.selected = [];
      return;
    }
    this.selected = this.items.slice();
  }

  select(item: NTableItem): void {
    if (this.selected.includes(item)) {
      this.selected = this.selected.filter((_item) => _item !== item);
    } else {
      this.selected = this.selected.concat(item);
    }
  }

  onItemsPerPageInput(length: number): void {
    this.$emit("update:pagination", {
      ...this.localPagination,
      itemsPerPage: length,
    });
    this.selected = [];

    this.$nextTick().then(() => this.applyFilters());
  }

  onPageInput(index: number): void {
    this.$emit("update:pagination", {
      ...this.localPagination,
      page: index,
    });
    this.selected = [];

    this.$nextTick().then(() => this.$emit("update"));
  }

  onSortChange(column: NTableColumn): void {
    const currentSort = this.localPagination.sort;
    const currentDirection = this.localPagination.direction;
    let sort: string | undefined = column.value;
    let direction: string | undefined = "ASC";

    if (currentSort === sort) {
      if (currentDirection === "ASC") {
        direction = "DESC";
      } else if (currentDirection === "DESC") {
        sort = undefined;
        direction = undefined;
      }
    }

    this.$emit("update:pagination", {
      ...this.localPagination,
      sort,
      direction,
    });
    this.selected = [];

    this.$nextTick().then(() => this.applyFilters());
  }

  onHeaderFilterClick(column: NTableColumn, initValue?: unknown): void {
    const dictionaryField = column.dictionaryField ?? column.value;
    this.filterForm = createFilterFormByColumn({
      column,
      onClose: () => (this.filterForm = null),
      onApply: (key: string, value: unknown) => {
        this.$emit("update:search", {
          ...this.search,
          [key]: value,
        });
        this.filterForm = null;
      },
      initValue,
      dictionary: this.dictionary[dictionaryField],
    });
  }

  clearSearch(): void {
    this.$emit("update:search", {});
  }

  clearSearchField(key: string): void {
    const newSearch = { ...this.search };
    delete newSearch[key];

    this.$emit("update:search", newSearch);
  }

  applyFilters(): void {
    this.$emit("update:pagination", {
      ...this.pagination,
      page: 1,
    });
    this.$emit("update");
  }

  mounted(): void {
    this.onScroll();
    this.$emit("update");
  }
}
</script>

<style lang="scss">
.n-data-table {
  display: flex;
  flex-direction: column;
  padding: 12px;

  &__header {
    min-height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  &__global-actions {
    display: flex;

    & > * {
      margin-left: 12px;
    }
  }

  &__filters {
    min-height: 48px;
    flex-shrink: 0;
    margin-bottom: 8px;
    border: thin solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;

    .filters {
      display: flex;
      height: 100%;

      &__body {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        padding: 10px 5px 5px 10px;
      }

      &__chip {
        display: flex;
        align-items: center;
        height: 26px;
        padding: 0 8px;
        margin: 0 5px 5px 0;
        background-color: rgba(0, 0, 0, 0.48);
        color: white;
        border-radius: 4px;
        font-size: 0.8em;

        span {
          cursor: pointer;
          letter-spacing: 0.3px;
        }

        &-icon {
          color: white !important;
          margin-left: 4px;
          cursor: pointer;
          border-radius: 50%;

          &:hover {
            background-color: rgba(0, 0, 0, 0.12);
          }
        }
      }

      &__action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        flex-shrink: 0;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }

        &:active {
          background-color: rgba(0, 0, 0, 0.09);
        }

        &--main {
          width: 96px;
        }
      }
    }
  }

  &__batch-menu {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 0;
    transition: all 0.3s;
    overflow: hidden;
    padding: 0 12px;

    &--open {
      height: 48px;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 48px;

    &-text {
      margin-top: 6px;
    }
  }

  &__pagination {
    margin-right: -10px;
  }

  &__items-per-page {
    max-width: 140px;
    padding: 0 16px 0 12px;
  }
}

.ghost {
  background-color: #fff;
}

.n-table {
  width: min-content;
  border-collapse: collapse;
  flex-grow: 1;

  &-wrapper {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    max-width: 100%;
    overflow: auto;
  }

  .sticked-left {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0px;
      right: 0;
      width: 2px;
      background-color: rgba(0, 0, 0, 0.12);
    }
  }

  .sticked-right {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0px;
      left: 0;
      width: 2px;
      background-color: rgba(0, 0, 0, 0.12);
    }
  }

  &__header {
    position: sticky;
    top: 0;
    padding: 0 8px;
    min-width: 48px;
    height: 48px;
    background-color: #ffffff;

    &.sticked {
      z-index: 3;
    }

    &.sticked-bottom {
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: rgba(0, 0, 0, 0.12);
      }
    }

    &-select {
      position: sticky;
      left: 0;
    }

    &-settings {
      position: sticky;
      left: 52px;
    }

    &-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      vertical-align: middle;
      padding: 0 48px 0 48px;
    }

    &-filter {
      position: absolute;
      left: 14px;
    }

    &-pin {
      position: absolute;
      right: 24px;
      top: 0;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;

      * {
        color: rgba(0, 0, 0, 0.48) !important;
      }

      &:hover * {
        color: rgba(0, 0, 0, 0.72) !important;
      }
    }

    &:hover &-pin,
    &.sticked &-pin {
      opacity: 1;
    }

    &-sorting {
      position: absolute;
      right: 20px;
      bottom: 0;
    }

    &-link {
      cursor: pointer;
      -ms-text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      -ms-line-clamp: 2;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      display: -webkit-box;
      word-wrap: break-word;
      -webkit-box-orient: vertical;
      box-orient: vertical;
      user-select: none;
    }

    &-divider {
      position: absolute;
      top: 0;
      right: 1px;
      bottom: 0;
      padding: 0 0 0 12px;
      cursor: ew-resize;

      &::after {
        content: "";
        width: 1px;
        position: absolute;
        top: 8px;
        bottom: 8px;
      }

      &:hover::after {
        background-color: rgba(0, 0, 0, 0.12);
      }
    }
  }

  &__body {
    &-cell {
      background-color: #ffffff;
      height: 48px;
      border-bottom: thin solid rgba(0, 0, 0, 0.12);
      padding: 0 12px;

      &.sticked {
        z-index: 2;
      }
    }

    &-select,
    &-actions {
      vertical-align: middle;
      text-align: center;
    }

    &-select {
      position: sticky;
      left: 0;
    }

    &-actions {
      position: sticky;
      left: 52px;
    }

    &-row-menu {
      display: flex;
      padding: 4px;
      background-color: #fff;
      border-right: thin solid rgba(0, 0, 0, 0.12);

      & > * {
        margin-right: 8px;
      }
    }
  }
}
</style>
