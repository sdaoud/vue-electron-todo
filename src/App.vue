<template>
  <div class="container">
    <div class="todo-app">
      <h1>To-do List</h1>
      <form @submit.prevent="addTodo" class="todo-form">
        <input
          v-model="newTodo"
          type="text"
          class="todo-input"
          placeholder="Add a new task..."
          required
        />
        <button type="submit" class="todo-button">Add</button>
      </form>
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id">
          <label :for="`todo-checkbox-${todo.id}`" class="todo-item">
            <input
              type="checkbox"
              class="todo-checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              :id="`todo-checkbox-${todo.id}`"
            />
            <span class="todo-text" :class="{ completed: todo.completed }">{{
              todo.text
            }}</span>
            <button
              class="delete-button"
              @click="deleteTodo(todo.id)"
              aria-label="Delete todo"
            >
              ×
            </button>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const todos = ref([]);
const newTodo = ref("");

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false,
    });
    newTodo.value = "";
  }
};

const toggleTodo = (id) => {
  const todo = todos.value.find((t) => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
};

const deleteTodo = (id) => {
  const todoIndex = todos.value.findIndex((t) => t.id === id);
  if (todoIndex === -1) return;
  todos.value.splice(todoIndex, 1);
};
</script>
