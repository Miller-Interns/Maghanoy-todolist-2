<script setup lang='ts'>
import type { Task } from '@/interface/todo-types'
import { ref, reactive, nextTick } from 'vue';
import { useTaskStore } from '@/stores/task-functionality';
import { storeToRefs } from 'pinia';
import saveIcon from '@/icons/save-icon.vue';
import cancelIcon from '@/icons/cancel-icon.vue';
import editIcon from '@/icons/edit-icon.vue';
import deleteIcon from '@/icons/delete-icon.vue';


const editingTaskId = ref<number | null>(null);
const editableTask = reactive<Task>({ id: 0, title: '', items: [], done: false });
const showPerCategory = ref(false);
const taskStore = useTaskStore();
const { taskList } = storeToRefs(taskStore);


const startEdit = (task: Task) => {
  editingTaskId.value = task.id;
  editableTask.id = task.id;
  editableTask.title = task.title;
  editableTask.done = task.done;
  editableTask.items = JSON.parse(JSON.stringify(task.items));
  showPerCategory.value = false;
}
const saveEdit = () => {
  taskStore.updateTask(editableTask);
  cancelEdit();
}
const cancelEdit = () => {
  editingTaskId.value = null;
}

const addNewItemInEditMode = () => {
  const lastItem = editableTask.items[editableTask.items.length - 1];
  // Check if the last item is not empty before adding a new one.
  if (lastItem && lastItem.text.trim() !== '') {
    editableTask.items.push({ text: '', done: false });
    // Use nextTick to wait for the DOM to update with the new input
    nextTick(() => {
      const editInputs = document.querySelectorAll<HTMLInputElement>('.itemInputEdit');
      editInputs[editInputs.length - 1]?.focus();
    });
  }
}


</script>
<template>
        <div v-for='task in taskList' :key='task.id' class='categoryPreview' :class="{ 'task-done': task.done }">

          <!-- Editing View -->
          <div v-if='editingTaskId === task.id'>
            <input v-model='editableTask.title' class='headerInputEdit' />
            <div v-for='(item, itemIndex) in editableTask.items' :key="itemIndex" class='itemRow'>
              <input v-model='editableTask.items[itemIndex].text' class='itemInputEdit' placeholder="Edit item"
                @keydown.enter.prevent="addNewItemInEditMode" />
            </div>
            <div class='iconButtons'>
              <button @click="saveEdit" title="Save Changes">
                <saveIcon/>
              </button>
              <button @click="cancelEdit" title="Cancel Edit">
                <cancelIcon/>
              </button>
            </div>
          </div>

          <!-- Default Display View -->
          <div v-else>
            <div class="task-header">
              <input type="checkbox" class="task-checkbox" :checked="task.done"
                @change="taskStore.toggleTaskDone(task.id)" />
              <h3>{{ task.title }}</h3>
            </div>
            <ul>
              <li v-for='(item, itemIndex) in task.items' :key='itemIndex'>
                <input type="checkbox" class="item-checkbox" :checked="item.done"
                  @change="taskStore.toggleItemDone(task.id, itemIndex)" />
                <span :class="{ 'item-done': item.done }">{{ item.text }}</span>
              </li>
            </ul>
            <div class='iconButtons'>
              <button @click="startEdit(task)" title="Edit Task">
                <editIcon/>
              </button>
              <button @click="taskStore.deleteTask(task.id)" title="Delete Task">
                <deleteIcon/>
              </button>
            </div>
          </div>
        </div>
</template>

<style>
.categoryPreview {
  position: relative;
  border: 3px solid black;
  border-radius: 10px;
  padding: 15px;
  background-color: #483c32;
  box-shadow: 5px 5px 3px #3a2f27;
  transition: background-color 0.3s ease;
}

.categoryPreview h3 {
  margin-top: 0;
  border-bottom: 1px solid #567257;
  padding-bottom: 10px
}

.categoryPreview ul {
  padding-left: 0;
  margin-bottom: 5px;
  list-style: none;
}

/* Updated padding */
.categoryPreview li {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.headerInputEdit,
.itemInputEdit {
  width: calc(100% - 12px);
  background: #5a4a3e;
  color: white;
  border: 1px solid #896A58;
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 8px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
}

.headerInputEdit {
  font-size: 1.17em;
  font-weight: bold
}

.itemInputEdit {
  font-size: 1em
}

/* The .clearAllButton style is removed as it's no longer used */
.addButton {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
  color: white;
  transition: transform .2s ease
}

.addButton:hover {
  transform: translateY(-50%) scale(1.15)
}

.buttonGroup {
  margin-top: 20px;
  display: flex;
  gap: 10px
}

.action-button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: bold
}

.save-button {
  background-color: #567257
}

.cancel-button {
  background-color: #a96653
}

.iconButtons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px
}

.iconButtons button {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  padding: 3px
}

.iconButtons svg {
  width: 20px;
  height: 20px
}

/* --- Styles for Checkboxes and Line-Through --- */
.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-checkbox,
.item-checkbox {
  appearance: none;
  background-color: #5a4a3e;
  width: 20px;
  height: 20px;
  border: 2px solid #896A58;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s, border-color 0.2s;
}

.item-checkbox {
  width: 18px;
  height: 18px;
}

.task-checkbox:hover,
.item-checkbox:hover {
  border-color: #c7a48d;
}

.task-checkbox:checked::after,
.item-checkbox:checked::after {
  content: '✔';
  font-size: 16px;
  color: #d4c8be;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.task-checkbox:checked {
  background-color: #567257;
}

.categoryPreview li span {
  margin-left: 8px;
}

.item-done {
  text-decoration: line-through;
  color: #a9a19a;
}

.task-done {
  background-color: #42362c;
  border-color: #2e251e;
}

.task-done h3,
.task-done li,
.task-done .item-done {
  text-decoration: line-through;
  color: #897c70;
}
</style>
