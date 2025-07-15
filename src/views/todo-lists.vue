<script setup lang='ts'>
import { ref,  onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/task-functionality';
import addIcon from '@/icons/add-icon.vue'
import inputContainer from '@/components/input-container.vue';
import displayAllCategories from '@/components/display-all-categories.vue';


const taskStore = useTaskStore();
const { taskList } = storeToRefs(taskStore);

// State
const showPerCategory = ref(false);
const editingTaskId = ref<number | null>(null);


// Functions
const toggleCategoryForm = () => {
  showPerCategory.value = !showPerCategory.value;
  cancelEdit();
}


const cancelEdit = () => {
  editingTaskId.value = null;
}


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
          <addIcon />
        </button>
      </div>

      <!-- Add New Category Form -->
      <div v-if='showPerCategory' class='perCategory'>
        <inputContainer/>
      </div>

      <!-- Display Saved Categories -->
      <div class='showCategory' v-if='taskList.length > 0'>
        <displayAllCategories/>
      </div>
    </div>
  </main>
</template>


<style>
.todoList {
  min-height: 100vh;
  width: 100%;
  display: flex;
  color: white;
  flex-direction: column;
  align-items: center;
  background-color: #567257;
  padding-bottom: 50px
}

.categoriesContainer {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600px;
  margin-top: 20px;
  gap: 20px
}

.allCategory {
  position: relative;
  border: 3px solid black;
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #483c32;
  box-shadow: 10px 10px 5px #3a2f27;
  color: white
}

h5 {
  margin: 0;
  font-size: 1.2em
}

.perCategory {
  border: 3px solid black;
  border-radius: 10px;
  padding: 15px;
  background-color: #483c32;
  box-shadow: 10px 10px 5px #3a2f27
}


.showCategory {
  display: flex;
  flex-direction: column;
  gap: 15px
}

</style>