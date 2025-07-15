<script setup lang='ts'>
import { ref, reactive, nextTick } from 'vue'
import { useTaskStore } from '@/stores/task-functionality';


const showPerCategory = ref(false);
const newCategory = reactive({ title: '', items: [''] });
const taskStore = useTaskStore();

const handleEnter = () => {
    if (newCategory.items[newCategory.items.length - 1].trim() !== '') {
        newCategory.items.push('');
        nextTick(() => {
            const inputs = document.querySelectorAll<HTMLInputElement>('.perCategory .itemInput');
            inputs[inputs.length - 1]?.focus();
        });
    }
}

const saveCategory = () => {
    taskStore.addTask(newCategory)
    newCategory.title = '';
    newCategory.items = [''];
    showPerCategory.value = false;
}

const cancelCategory=()=>{
    newCategory.title = '';
    newCategory.items = [''];
    showPerCategory.value = false;
}
</script>


<template>
    <div class='inputContainer'>
        <input type='text' v-model='newCategory.title' placeholder='CATEGORY TITLE' class='headerInput' />
        <div class='itemList'>
            <div v-for='(items, index) in newCategory.items' :key='index' class='itemRow'>
                <input v-model='newCategory.items[index]' @keydown.enter.prevent='handleEnter' class='itemInput'
                    placeholder='Task' />
            </div>
        </div>
    </div>
    <div class='buttonGroup'>
        <button @click='saveCategory' class='action-button save-button'>Save</button>
        <button @click='cancelCategory' class='action-button cancel-button'>Cancel</button>
    </div>

</template>

<style>
.headerInput,
.itemInput {
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  width: 100%;
  padding: 8px 0;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  border-bottom: 1px solid #896A58
}

.headerInput {
  font-size: 22px;
  margin-bottom: 15px
}

.itemInput {
  font-size: 18px;
  margin-top: 10px
}

</style>