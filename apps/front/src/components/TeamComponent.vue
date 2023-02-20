<script setup lang="ts">
import type { Team } from "types";

defineProps<{
  team: Team;
  preview: boolean;
}>();
</script>

<template>
  <li :class="preview ? 'team-preview' : 'team'">
    <div
      v-memo="[team.active]"
      :class="[preview ? '' : 'team-name', , { active: team.active }]"
    >
      {{ team.name }}
    </div>

    <div v-if="!preview" v-memo="[team.score]" class="team-score">
      {{ team.score }}
    </div>
  </li>
</template>

<style lang="scss" scoped>
.team {
  padding: 20px;

  &-name {
    font-weight: 700;
    padding: 0 15px;
    border-radius: 10px;
  }

  &-score {
    font-size: 40px;
    font-weight: bold;
  }

  &-preview {
    padding: 20px;
    font-weight: 700;
  }
}

.active {
  background: linear-gradient(51.05deg, #a0ee22 -57.1%, #479116 156.72%);
}
</style>
