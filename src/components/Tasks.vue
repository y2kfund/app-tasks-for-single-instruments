<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useSupabase } from '@y2kfund/core'

interface Task {
  id: string
  symbol_root: string
  summary: string
  description: string | null
  status: string
  assigned_to: string | null
  priority: string
  created_by: string
  created_at: string
  updated_at: string
  archived: boolean
}

interface Props {
  symbolRoot: string
  userId: string
}

const props = defineProps<Props>()
const supabase = useSupabase()

const tasks = ref<Task[]>([])
const editingId = ref<string | null>(null)
const editSummary = ref('')
const editDescription = ref('')
const editPriority = ref('medium')
const hoveredTask = ref<Task | null>(null)
const isAddingNew = ref(false)
const newTaskSummary = ref('')
const newTaskDescription = ref('')
const newTaskPriority = ref('medium')
const filterStatus = ref<string>('all')

const priorities = [
  { value: 'low', label: 'Low', color: '#2196f3' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' }
]

const statuses = ['open', 'in_progress', 'completed', 'blocked']

const filteredTasks = computed(() => {
  if (filterStatus.value === 'all') {
    return tasks.value.filter(t => !t.archived)
  }
  return tasks.value.filter(t => t.status === filterStatus.value && !t.archived)
})

const fetchTasks = async () => {
  const { data, error } = await supabase
    .schema('hf')
    .from('tasks')
    .select('*')
    .eq('symbol_root', props.symbolRoot)
    .eq('archived', false)
    .order('created_at', { ascending: false })
  
  if (!error && data) {
    tasks.value = data
  }
}

const startAddNew = async () => {
  isAddingNew.value = true
  newTaskSummary.value = ''
  newTaskDescription.value = ''
  newTaskPriority.value = 'medium'
  await nextTick()
  const input = document.querySelector('.new-task-summary') as HTMLInputElement
  input?.focus()
}

const addTask = async () => {
  if (!newTaskSummary.value.trim()) {
    isAddingNew.value = false
    return
  }
  
  const { data, error } = await supabase
    .schema('hf')
    .from('tasks')
    .insert({
      symbol_root: props.symbolRoot,
      summary: newTaskSummary.value.trim(),
      description: newTaskDescription.value.trim() || null,
      priority: newTaskPriority.value,
      created_by: props.userId,
      status: 'open'
    })
    .select()
  
  if (!error && data) {
    tasks.value.unshift(data[0])
    newTaskSummary.value = ''
    newTaskDescription.value = ''
    newTaskPriority.value = 'medium'
    isAddingNew.value = false
  }
}

const cancelAddNew = () => {
  isAddingNew.value = false
  newTaskSummary.value = ''
  newTaskDescription.value = ''
  newTaskPriority.value = 'medium'
}

const startEdit = async (task: Task) => {
  editingId.value = task.id
  editSummary.value = task.summary
  editDescription.value = task.description || ''
  editPriority.value = task.priority
  await nextTick()
  const input = document.querySelector(`#edit-summary-${task.id}`) as HTMLInputElement
  input?.focus()
  input?.select()
}

const saveEdit = async (taskId: string) => {
  if (!editSummary.value.trim()) {
    cancelEdit()
    return
  }
  
  const { error } = await supabase
    .schema('hf')
    .from('tasks')
    .update({
      summary: editSummary.value.trim(),
      description: editDescription.value.trim() || null,
      priority: editPriority.value,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
  
  if (!error) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.summary = editSummary.value.trim()
      task.description = editDescription.value.trim() || null
      task.priority = editPriority.value
    }
    editingId.value = null
  }
}

const cancelEdit = () => {
  editingId.value = null
  editSummary.value = ''
  editDescription.value = ''
  editPriority.value = 'medium'
}

const updateStatus = async (taskId: string, newStatus: string) => {
  const { error } = await supabase
    .schema('hf')
    .from('tasks')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
  
  if (!error) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = newStatus
    }
  }
}

const archiveTask = async (taskId: string) => {
  const { error } = await supabase
    .schema('hf')
    .from('tasks')
    .update({
      archived: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
  
  if (!error) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }
}

const getPriorityColor = (priority: string) => {
  return priorities.find(p => p.value === priority)?.color || '#999'
}

const getStatusLabel = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchTasks()
})
</script>

<template>
  <div class="tasks-box">
    <div class="header">
      <h3 class="box-title">Tasks</h3>
      <div class="header-actions">
        <select v-model="filterStatus" class="status-filter">
          <option value="all">All Tasks</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ getStatusLabel(status) }}
          </option>
        </select>
        <button @click="startAddNew" class="add-icon-button" title="Add new task">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <ul class="tasks-list">
      <!-- New task input -->
      <li v-if="isAddingNew" class="task-item new-task">
        <div class="task-content">
          <div class="task-header-row">
            <select v-model="newTaskPriority" class="priority-select new-task-priority">
              <option v-for="p in priorities" :key="p.value" :value="p.value">
                {{ p.label }}
              </option>
            </select>
            <input
              v-model="newTaskSummary"
              @keyup.enter="addTask"
              @keyup.esc="cancelAddNew"
              type="text"
              placeholder="Task summary..."
              class="new-task-summary"
            />
          </div>
          <textarea
            v-model="newTaskDescription"
            @keyup.esc="cancelAddNew"
            placeholder="Optional description... (Press Enter on summary or click outside to save)"
            class="new-task-description"
            rows="2"
          />
          <div class="new-task-actions">
            <button @click="addTask" class="save-btn">Save</button>
            <button @click="cancelAddNew" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </li>

      <li v-if="!isAddingNew && filteredTasks.length === 0" class="empty-state">
        No tasks yet. Click the + button to add your first task.
      </li>
    
      <!-- Existing tasks -->
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        :class="{ 'task-completed': task.status === 'completed' }"
        @mouseenter="hoveredTask = task"
        @mouseleave="hoveredTask = null"
      >
        <div class="task-content">
          <div v-if="editingId === task.id" class="edit-mode">
            <div class="task-header-row">
              <select v-model="editPriority" class="priority-select">
                <option v-for="p in priorities" :key="p.value" :value="p.value">
                  {{ p.label }}
                </option>
              </select>
              <input
                :id="`edit-summary-${task.id}`"
                v-model="editSummary"
                @keyup.enter="saveEdit(task.id)"
                @keyup.esc="cancelEdit"
                type="text"
                class="edit-input"
              />
            </div>
            <textarea
              v-model="editDescription"
              @keyup.esc="cancelEdit"
              placeholder="Optional description..."
              class="edit-description"
              rows="2"
            />
            <div class="edit-actions">
              <button @click="saveEdit(task.id)" class="save-btn">Save</button>
              <button @click="cancelEdit" class="cancel-btn">Cancel</button>
            </div>
          </div>
          
          <div v-else class="view-mode">
            <div class="task-header-row">
              <span 
                class="priority-badge" 
                :style="{ backgroundColor: getPriorityColor(task.priority) }"
                :title="`Priority: ${task.priority}`"
              />
              <span class="task-summary" @click="startEdit(task)">{{ task.summary }}</span>
              <select 
                :value="task.status" 
                @change="updateStatus(task.id, ($event.target as HTMLSelectElement).value)"
                class="status-select"
                :class="`status-${task.status}`"
              >
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ getStatusLabel(status) }}
                </option>
              </select>
            </div>
            <p v-if="task.description" class="task-description">{{ task.description }}</p>
          </div>

          <div v-if="hoveredTask?.id === task.id && editingId !== task.id" class="task-actions">
            <button @click="startEdit(task)" class="action-btn edit-btn" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2" stroke-linecap="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button @click="archiveTask(task.id)" class="action-btn archive-btn" title="Archive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div v-if="hoveredTask?.id === task.id && editingId !== task.id" class="tooltip">
            Created: {{ formatDate(task.created_at) }}<br />
            Updated: {{ formatDate(task.updated_at) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tasks-box {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-filter {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  cursor: pointer;
}

.box-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.add-icon-button {
  width: 20px;
  height: 20px;
  padding: 0;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-icon-button:hover {
  background-color: #f57c00;
  transform: scale(1.1);
}

.add-icon-button svg {
  width: 16px;
  height: 16px;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  position: relative;
  transition: all 0.2s ease;
  border: 1px solid #ffe0b2;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-completed {
  opacity: 0.6;
}

.task-completed .task-summary {
  text-decoration: line-through;
}

.new-task {
  animation: slideIn 0.2s ease;
  background: #fffaf0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.priority-badge {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.priority-select,
.new-task-priority {
  padding: 2px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 11px;
  background: white;
  cursor: pointer;
  flex-shrink: 0;
}

.task-summary {
  flex: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.task-summary:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

.task-description {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.status-select {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;
  flex-shrink: 0;
}

.status-open { background: #e3f2fd; color: #1976d2; }
.status-in_progress { background: #fff3e0; color: #f57c00; }
.status-completed { background: #e8f5e9; color: #388e3c; }
.status-blocked { background: #ffebee; color: #d32f2f; }

.edit-mode,
.new-task .task-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-input,
.new-task-summary {
  flex: 1;
  padding: 6px 10px;
  border: 2px solid #ff9800;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.edit-input:focus,
.new-task-summary:focus {
  border-color: #f57c00;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
}

.edit-description,
.new-task-description {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;
}

.edit-description:focus,
.new-task-description:focus {
  border-color: #ff9800;
}

.edit-actions,
.new-task-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: #ff9800;
  color: white;
}

.save-btn:hover {
  background: #f57c00;
}

.cancel-btn {
  background: #eee;
  color: #666;
}

.cancel-btn:hover {
  background: #ddd;
}

.task-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
}

.edit-btn:hover {
  background: #2196f3;
  color: white;
}

.archive-btn:hover {
  background: #f44336;
  color: white;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  z-index: 10;
  margin-bottom: 4px;
  pointer-events: none;
}

.empty-state {
  color: #666;
  font-style: italic;
  font-size: 14px;
  text-align: center;
  padding: 2rem 1rem;
}
</style>