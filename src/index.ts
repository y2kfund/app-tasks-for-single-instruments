// src/index.ts
import TasksForSingleInstrument from './views/TasksForSingleInstrument.vue'

// Named export
export { TasksForSingleInstrument }

// Default export (optional)
export default TasksForSingleInstrument

// Props interface
export interface TasksForSingleInstrumentProps {
  symbolRoot: string    // Root symbol of the instrument
  userId?: string | null    // Current user ID for access control
}
