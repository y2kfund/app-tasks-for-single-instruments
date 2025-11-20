<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import Tasks from '../components/Tasks.vue'

interface TasksForSingleInstrumentProps {
  symbolRoot: string
  userId?: string | null
}

const props = withDefaults(defineProps<TasksForSingleInstrumentProps>(), {
  symbolRoot: 'META',
  userId: '67e578fd-2cf7-48a4-b028-a11a3f89bb9b'
})

</script>

<template>
  <div class="tasks-for-single-instrument-view">
    
    <div class="boxes-container">
      <Tasks 
        :symbol-root="props.symbolRoot" 
        :user-id="props.userId || ''"
      />
      
    </div>
  </div>
</template>

<style>
/*@import '../styles/styles.css';*/
</style>

<style scoped>
/*@import '../styles/scoped-styles.css';*/

.boxes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.25rem;
}
</style>