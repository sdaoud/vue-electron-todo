import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";

describe("App", () => {
  it("renders properly", () => {
    const wrapper = mount(App);
    expect(wrapper.find("h1").text()).toBe("To-do List");
  });

  it("adds a new todo", async () => {
    const wrapper = mount(App);
    const input = wrapper.find(".todo-input");
    const form = wrapper.find(".todo-form");

    await input.setValue("New todo item");
    await form.trigger("submit");

    const todos = wrapper.findAll(".todo-item");
    expect(todos).toHaveLength(1);
    expect(wrapper.find(".todo-text").text()).toBe("New todo item");
  });

  it("toggles todo completion", async () => {
    const wrapper = mount(App);

    // Add a todo
    await wrapper.find(".todo-input").setValue("Test todo");
    await wrapper.find(".todo-form").trigger("submit");

    // Toggle the checkbox
    const checkbox = wrapper.find(".todo-checkbox");
    await checkbox.setValue(true);

    // Check if the todo is marked as completed
    expect(wrapper.find(".todo-text").classes()).toContain("completed");
  });

  it("deletes a todo", async () => {
    const wrapper = mount(App);

    // Add a todo
    await wrapper.find(".todo-input").setValue("Test todo");
    await wrapper.find(".todo-form").trigger("submit");

    // Delete the todo
    await wrapper.find(".delete-button").trigger("click");

    // Check if the todo is removed
    const todos = wrapper.findAll(".todo-item");
    expect(todos).toHaveLength(0);
  });

  it("does not add empty todos", async () => {
    const wrapper = mount(App);
    const form = wrapper.find(".todo-form");

    await form.trigger("submit");

    const todos = wrapper.findAll(".todo-item");
    expect(todos).toHaveLength(0);
  });
});
