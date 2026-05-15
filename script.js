const CALENDAR_HEIGHT = 268;
const TODO_HEIGHT = 440;

// ── Utilitários ──────────────────────────────────────────────

function todayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem("todos") || "[]");
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ── Calendário ───────────────────────────────────────────────

function updateCalendar() {
  const now = new Date();
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  document.getElementById("day").textContent = now.getDate();
  document.getElementById("month").textContent = monthNames[now.getMonth()];
  document.getElementById("year").textContent = now.getFullYear();

  updateDeadlinesBanner();
}

function updateDeadlinesBanner() {
  const today = todayString();
  const dueToday = loadTodos().filter(t => !t.done && t.deadline === today);
  const banner = document.getElementById("deadlines-banner");

  if (dueToday.length > 0) {
    banner.innerHTML = dueToday.map(t => `⚠ Dia final de ${t.text}`).join("<br>");
    banner.classList.add("visible");
  } else {
    banner.innerHTML = "";
    banner.classList.remove("visible");
  }
}

// ── To-Do ────────────────────────────────────────────────────

function renderTodos() {
  const todos = loadTodos();
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const infoDiv = document.createElement("div");
    infoDiv.className = "todo-info";

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;

    const deadlineSpan = document.createElement("span");
    deadlineSpan.className = "todo-deadline";
    if (todo.deadline) {
      const [y, mo, d] = todo.deadline.split("-");
      deadlineSpan.textContent = `${d}/${mo}/${y}`;
      if (todo.deadline === todayString() && !todo.done) {
        deadlineSpan.classList.add("due-today");
      }
    }

    infoDiv.appendChild(textSpan);
    infoDiv.appendChild(deadlineSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-delete";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function addTodo() {
  const textInput = document.getElementById("todo-text");
  const dateInput = document.getElementById("todo-date");
  const text = textInput.value.trim();
  if (!text) return;

  const todos = loadTodos();
  todos.push({
    id: Date.now().toString(),
    text,
    deadline: dateInput.value || null,
    done: false
  });
  saveTodos(todos);

  textInput.value = "";
  dateInput.value = "";
  renderTodos();
}

function toggleTodo(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(id) {
  saveTodos(loadTodos().filter(t => t.id !== id));
  renderTodos();
}

// ── Abas ─────────────────────────────────────────────────────

function switchTab(tabName) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));

  document.getElementById(`tab-${tabName}`).classList.add("active");
  document.getElementById(`view-${tabName}`).classList.add("active");

  if (tabName === "todo") {
    renderTodos();
  } else {
    updateDeadlinesBanner();
  }
}

// ── Inicialização ─────────────────────────────────────────────

document.getElementById("closeBtn").addEventListener("click", () => window.api.close());
document.getElementById("tab-calendar").addEventListener("click", () => switchTab("calendar"));
document.getElementById("tab-todo").addEventListener("click", () => switchTab("todo"));
document.getElementById("btn-add").addEventListener("click", addTodo);
document.getElementById("todo-text").addEventListener("keydown", e => {
  if (e.key === "Enter") addTodo();
});

updateCalendar();
setInterval(updateCalendar, 60_000);
