<template>
  <n-base-filter
    :title="title"
    :disabled="value.length === 0"
    @apply="$emit('apply', value)"
    @close="$emit('close')"
  >
    <div class="n-date-filter">
      <div class="n-date-filter__row">
        <v-text-field
          v-model="value"
          prepend-inner-icon="mdi-calendar"
          dense
          outlined
          autofocus
          placeholder="ГГГГ-ММ-ДД"
          class="n-date-filter__input"
          @click:prepend-inner="() => ({})"
        >
          <template #prepend>
            <div class="n-date-filter__label">С</div>
          </template>
        </v-text-field>
        <v-text-field
          v-model="value"
          append-icon="mdi-clock-outline"
          dense
          outlined
          placeholder="ЧЧ:ММ:СС"
          class="n-date-filter__input"
          @click:append="() => ({})"
        />
      </div>

      <div class="n-date-filter__row">
        <v-text-field
          v-model="value"
          prepend-inner-icon="mdi-calendar"
          dense
          outlined
          placeholder="ГГГГ-ММ-ДД"
          class="n-date-filter__input"
          @click:prepend-inner="() => ({})"
        >
          <template #prepend>
            <div class="n-date-filter__label">По</div>
          </template>
        </v-text-field>
        <v-text-field
          v-model="value"
          append-icon="mdi-clock-outline"
          dense
          outlined
          placeholder="ЧЧ:ММ:СС"
          class="n-date-filter__input"
          @click:append="() => ({})"
        />
      </div>
    </div>
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
export default class NDateFilter extends Vue {
  @Prop({ type: String })
  title!: string;

  @Prop({ type: String, default: "" })
  initValue!: string;

  value = this.initValue;
}
</script>

<style lang="scss">
.n-date-filter {
  &__row {
    display: flex;
  }

  &__row &__input:first-of-type {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &__row &__input:last-of-type {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &__label {
    width: 30px;
  }
}
</style>
