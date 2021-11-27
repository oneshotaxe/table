<template>
  <n-table
    :columns="columns"
    :items="items"
    :column-order.sync="columnOrder"
    :column-widths.sync="columnWidths"
    :column-stickies.sync="columnStickies"
    :hidden-columns.sync="hiddenColumns"
    :pagination.sync="pagination"
    :search.sync="search"
    :dictionary="dictionary"
    :style="{ height: '600px' }"
    @change:column-widths="saveColumnWidths"
    @update="update"
  />
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import NTable, {
  NTableColumn,
  NTableColumnType,
  NTableDictionary,
} from "@/components/NTable";
import TablePage from "./renderless/TablePage";

@Component({
  components: {
    NTable,
  },
})
export default class Home extends TablePage<Item> {
  name = "home";

  columns: NTableColumn[] = [
    {
      value: "value1",
      text: "text1",
      minWidth: 200,
      type: NTableColumnType.DATE,
    },
    {
      value: "value2",
      text: "text2",
      minWidth: 200,
    },
    {
      value: "value3",
      text: "text3",
      minWidth: 200,
      type: NTableColumnType.SELECT,
      dictionaryField: "value2",
    },
    { value: "value4", text: "text4", minWidth: 200 },
    { value: "value5", text: "text5", minWidth: 200 },
    { value: "value6", text: "text6", minWidth: 200 },
    { value: "value7", text: "text7", minWidth: 200 },
    { value: "value8", text: "text8", minWidth: 200 },
    { value: "value9", text: "text9", minWidth: 200 },
  ];

  dictionary: NTableDictionary = {
    value2: {
      value1: "Text 1",
      value2: "Text 2",
    },
  };

  update(): void {
    console.log(this.pagination, this.search);

    this.items = new Array(20).fill(0).map(() => ({
      value1: "value1",
      value2: "value2",
      value3: "value3",
      value4: "value4",
      value5: "value5",
      value6: "value6",
      value7: "value7",
      value8: "value8",
      value9: "value9",
    }));
  }
}

type Item = {
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  value6: string;
  value7: string;
  value8: string;
  value9: string;
};
</script>
