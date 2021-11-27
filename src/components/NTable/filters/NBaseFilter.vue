<template>
  <v-form @submit.prevent="$emit('apply')">
    <v-card min-width="400px">
      <v-card-title>
        {{ title }}

        <v-spacer />

        <v-btn icon @click="$emit('close')">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn :disabled="disabled" color="primary" type="submit"> Apply </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NBaseFilter extends Vue {
  @Prop({ type: String })
  title!: string;

  @Prop({ type: Boolean })
  disabled?: boolean;
}
</script>
