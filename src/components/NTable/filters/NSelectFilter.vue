<template>
  <n-base-filter
    :title="title"
    :disabled="value.length === 0"
    @apply="$emit('apply', value)"
    @close="$emit('close')"
  >
    <v-select v-model="value" :items="items" autofocus label="Значение" />
  </n-base-filter>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { NSelectItem } from "../types";
import NBaseFilter from "./NBaseFilter.vue";

@Component({
  components: {
    NBaseFilter,
  },
})
export default class NSelectFilter extends Vue {
  @Prop({ type: String })
  title!: string;

  @Prop({ type: String, default: "" })
  initValue!: string;

  @Prop({ type: Object, default: () => ({}) })
  dictionary!: Record<string, string>;

  value = this.initValue;

  get items(): NSelectItem[] {
    return Object.entries(this.dictionary).map(([value, text]) => ({
      value,
      text,
    }));
  }
}
</script>
