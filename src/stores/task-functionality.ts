import { ref, computed, watch, onMounted} from 'vue'
import { defineStore } from 'pinia'
import {type Task} from '@/interface/todo-types'
export const useTaskStore = defineStore('tasks', () => {
  // --- STATE ---
  const taskList = ref<Task[]>([]);
  
  // --- ACTIONS ---
  const loadTasksFromStorage = () => {
    const savedTasks = localStorage.getItem('taskList');
    if (savedTasks) {
      const tasks: Task[]= JSON.parse(savedTasks);
    
       // Data Migration: If an old version of the data is found (items are strings)
      if (tasks.length > 0 && tasks[0].items.length > 0 && typeof tasks[0].items[0] === 'string') {
        tasks.forEach(task => {

          if (typeof task.done === 'undefined') {
            task.done = false;
          }
        });
      }
      taskList.value = tasks;
    }
  };

  /**
   * Adds a new task, converting string items into TaskItem objects.
   */
  const addTask = (categoryData: { title: string; items: string[] }) => {
    if (!categoryData.title.trim()) return;

    const newTask: Task = { 
      id: Date.now(),
      title: categoryData.title,
      // Convert the array of strings to an array of TaskItem objects
      items: categoryData.items
        .filter(itemText => itemText.trim() !== '')
        .map(itemText => ({ text: itemText, done: false })),
      done: false, // Default to not done
    };
    taskList.value.push(newTask);
  };
  
  const deleteTask = (taskId: number) => {

    const index = taskList.value.findIndex(task => task.id === taskId);
    if (index !== -1) {
      taskList.value.splice(index, 1);
    }
  };
  
  
   //Updates an existing task, filtering out any empty items.
  
  const updateTask = (updatedTask: Task) => {
    if (!updatedTask.title.trim()) return;
    const index = taskList.value.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      // Ensure we don't save empty items from the edit view
      updatedTask.items = updatedTask.items.filter(item => item.text.trim() !== '');
      taskList.value[index] = updatedTask;
    }
  };


    //NEW: Toggles the 'done' state of an entire task category.
  
  const toggleTaskDone = (taskId: number) => {
    const task = taskList.value.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
    }
  };

  
  //NEW: Toggles the 'done' state of a single item within a task.
  
  const toggleItemDone = (taskId: number, itemIndex: number) => {
    const task = taskList.value.find(t => t.id === taskId);
    if (task && task.items[itemIndex]) {
      task.items[itemIndex].done = !task.items[itemIndex].done;
    }
  };
  // --- PERSISTENCE ---
  watch(taskList, (newTaskList) => {
    localStorage.setItem('taskList', JSON.stringify(newTaskList));
  }, { deep: true });

  // --- RETURN ---
  return {
    taskList,
    loadTasksFromStorage,
    addTask,
    deleteTask,
    updateTask,
    toggleTaskDone,
    toggleItemDone,  
  };
});
