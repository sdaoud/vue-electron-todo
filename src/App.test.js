import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";

const mockIpcRenderer = {
  send: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  removeListener: vi.fn(),
  removeAllListeners: vi.fn(),
  invoke: vi.fn().mockImplementation((channel) => {
    if (channel === "load-todos") {
      return Promise.resolve([]);
    }
    return Promise.resolve(null);
  }),
};

// Mock electron ipcRenderer
window.require = vi.fn().mockImplementation((module) => {
  if (module === "electron") {
    return { ipcRenderer: mockIpcRenderer };
  }
  return {};
});

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("loads todos from the store", async () => {
    const wrapper = mount(App);
    const todos = wrapper.findAll(".todo-item");
    expect(todos).toHaveLength(0);
  });

  it("Loads todos on mount", async () => {
    // Mount the component
    const wrapper = mount(App);
    await wrapper.vm.$nextTick();

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith("load-todos");
    expect(mockIpcRenderer.invoke).toHaveBeenCalledTimes(1);
  });

  it("Saves todos to store when they're added", async () => {
    const wrapper = mount(App);
    const input = wrapper.find(".todo-input");
    const form = wrapper.find(".todo-form");

    await input.setValue("New todo item");
    await form.trigger("submit");

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith("save-todos", [
      expect.objectContaining({ text: "New todo item", completed: false }),
    ]);
  });

  it("Saves todos to store when they're deleted", async () => {
    const wrapper = mount(App);
    const input = wrapper.find(".todo-input");
    const form = wrapper.find(".todo-form");

    await input.setValue("Test todo");
    await form.trigger("submit");

    await wrapper.find(".delete-button").trigger("click");

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith("save-todos", []);
  });

  it("Saves todos to store when they're toggled", async () => {
    const wrapper = mount(App);
    const input = wrapper.find(".todo-input");
    const form = wrapper.find(".todo-form");

    await input.setValue("Test todo");
    await form.trigger("submit");

    const checkbox = wrapper.find(".todo-checkbox");
    await checkbox.setValue(true);

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith("save-todos", [
      expect.objectContaining({ text: "Test todo", completed: true }),
    ]);
  });
});
