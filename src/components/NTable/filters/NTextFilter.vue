<template>
  <n-base-filter
    :title="title"
    :disabled="value.length === 0"
    @apply="$emit('apply', value)"
    @close="$emit('close')"
  >
    <v-text-field v-model="value" autofocus label="Значение" />
  </n-base-filter>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NBaseFilter from "./NBaseFilter.vue";

@Component({
  components: {
    NBaseFilter,
  },
})
export default class NTextFilter extends Vue {
  @Prop({ type: String })
  title!: string;

  @Prop({ type: String, default: "" })
  initValue!: string;

  value = this.initValue;
}
</script>
