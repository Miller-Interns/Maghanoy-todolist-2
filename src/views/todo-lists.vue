<script setup lang='ts'>
import {ref, reactive, onMounted, nextTick} from 'vue'
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/task-functionality';
import type {Task} from '@/types/todo-types'

const taskStore = useTaskStore();
const { taskList } = storeToRefs(taskStore);

// State
const showPerCategory = ref(false);
const newCategory = reactive({title:'',items:['']});
const editingTaskId = ref<number|null>(null);
let editableTask = reactive<Task>({id:0, title:'', items:[], done: false});


// Functions
const toggleCategoryForm = () => {
  showPerCategory.value = !showPerCategory.value;
  cancelEdit();
}

const handleEnter = () => {
  if (newCategory.items[newCategory.items.length - 1].trim() !== ''){
    newCategory.items.push('');
    nextTick(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>('.perCategory .itemInput');
        inputs[inputs.length - 1]?.focus();
    });
  }
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

const saveCategory = () => {
  taskStore.addTask(newCategory)
  newCategory.title = '';
  newCategory.items = [''];
  showPerCategory.value = false;
}

const startEdit = (task: Task) => {
  editingTaskId.value = task.id;
  // Deep copy to prevent mutating state directly before saving
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

// The confirmClearAll function has been removed.

// Lifecycle Hook
onMounted(() => {
  taskStore.loadTasksFromStorage();
})
</script>

<template>
    <main class='todoList'>
        <h1>TASK FLOW!</h1>
        <div class='categoriesContainer'>
            <!-- Header Section -->
            <div class='allCategory'>
                <h5>CATEGORIES ({{ taskList.length }})</h5>
                <button @click='toggleCategoryForm' class='addButton'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>

            <!-- Add New Category Form -->
            <div v-if='showPerCategory' class='perCategory'>
              <div class='inputContainer'>
                  <input type='text' v-model='newCategory.title' placeholder='CATEGORY TITLE' class='headerInput'/>
                  <div class='itemList'>
                      <div v-for='(item, index) in newCategory.items' :key='index' class='itemRow'>
                          <input v-model='newCategory.items[index]' @keydown.enter.prevent='handleEnter' class='itemInput' placeholder='Task'/>
                      </div>
                  </div>
              </div>
              <div class='buttonGroup'>
                  <button @click='saveCategory' class='action-button save-button'>Save</button>
                  <button @click='showPerCategory= false' class='action-button cancel-button'>Cancel</button>
              </div>
            </div>

            <!-- Display Saved Categories -->
            <div class='showCategory' v-if='taskList.length>0'>
                <div v-for='task in taskList' :key='task.id' class='categoryPreview' :class="{ 'task-done': task.done }">
                    <!-- Editing View -->
                    <div v-if='editingTaskId===task.id'>
                        <input v-model='editableTask.title' class='headerInputEdit'/>
                        <div v-for='(item, itemIndex) in editableTask.items' :key="itemIndex" class='itemRow'>
                            <input 
                              v-model='editableTask.items[itemIndex].text' 
                              class='itemInputEdit'
                              placeholder="Edit item"
                              @keydown.enter.prevent="addNewItemInEditMode"
                            />
                        </div>
                        <div class='iconButtons'>
                            <button @click="saveEdit" title="Save Changes">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                            </button>
                            <button @click="cancelEdit" title="Cancel Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Default Display View -->
                    <div v-else>
                        <div class="task-header">
                            <input 
                              type="checkbox"
                              class="task-checkbox"
                              :checked="task.done"
                              @change="taskStore.toggleTaskDone(task.id)" 
                            />
                            <h3>{{ task.title }}</h3>
                        </div>
                        <ul>
                            <li v-for='(item, itemIndex) in task.items' :key='itemIndex'>
                                <input 
                                  type="checkbox"
                                  class="item-checkbox"
                                  :checked="item.done" 
                                  @change="taskStore.toggleItemDone(task.id, itemIndex)"
                                />
                                <span :class="{ 'item-done': item.done }">{{ item.text }}</span>
                            </li>
                        </ul>
                        <div class='iconButtons'>
                            <button @click="startEdit(task)" title="Edit Task">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button @click="taskStore.deleteTask(task.id)" title="Delete Task">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>


<style>
/* --- Global Styles --- */
.todoList{min-height:100vh;width:100%;display:flex;color:white;flex-direction:column;align-items:center;background-color:#567257;padding-bottom:50px}
.categoriesContainer{display:flex;flex-direction:column;width:90%;max-width:600px;margin-top:20px;gap:20px}
.allCategory{position:relative;border:3px solid black;border-radius:10px;padding:10px 15px;display:flex;align-items:center;justify-content:center;background-color:#483c32;box-shadow:10px 10px 5px #3a2f27;color:white}
h5{margin:0;font-size:1.2em}
.perCategory{border:3px solid black;border-radius:10px;padding:15px;background-color:#483c32;box-shadow:10px 10px 5px #3a2f27}
.headerInput,.itemInput{border:none;outline:none;background:transparent;color:#fff;width:100%;padding:8px 0;font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande','Lucida Sans',Arial,sans-serif;border-bottom:1px solid #896A58}
.headerInput{font-size:22px;margin-bottom:15px}
.itemInput{font-size:18px;margin-top:10px}
.showCategory{display:flex;flex-direction:column;gap:15px}
.categoryPreview{position:relative;border:3px solid black;border-radius:10px;padding:15px;background-color:#483c32;box-shadow:5px 5px 3px #3a2f27;transition: background-color 0.3s ease;}
.categoryPreview h3{margin-top:0;border-bottom:1px solid #567257;padding-bottom:10px}
.categoryPreview ul{padding-left:0;margin-bottom:5px;list-style:none;} /* Updated padding */
.categoryPreview li{margin-bottom:5px;display:flex;align-items:center;}
.headerInputEdit,.itemInputEdit{width:calc(100% - 12px);background:#5a4a3e;color:white;border:1px solid #896A58;border-radius:4px;padding:5px;margin-bottom:8px;font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande','Lucida Sans',Arial,sans-serif}
.headerInputEdit{font-size:1.17em;font-weight:bold}
.itemInputEdit{font-size:1em}
/* The .clearAllButton style is removed as it's no longer used */
.addButton{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:40px;height:40px;padding:5px;border:none;background:none;cursor:pointer;color:white;transition:transform .2s ease}
.addButton:hover{transform:translateY(-50%) scale(1.15)}
.buttonGroup{margin-top:20px;display:flex;gap:10px}
.action-button{padding:8px 15px;border:none;border-radius:5px;cursor:pointer;color:white;font-weight:bold}
.save-button{background-color:#567257}
.cancel-button{background-color:#a96653}
.iconButtons{position:absolute;top:10px;right:10px;display:flex;gap:5px}
.iconButtons button{background:none;border:none;cursor:pointer;color:white;padding:3px}
.iconButtons svg{width:20px;height:20px}

/* --- Styles for Checkboxes and Line-Through --- */
.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.task-checkbox, .item-checkbox {
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
.task-checkbox:hover, .item-checkbox:hover {
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