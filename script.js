let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function calculateStreak(dates) {
  const today = new Date();
  let streak = 0;

  const sorted = [...dates].sort((a, b) => new Date(b) - new Date(a));

  for (let i = 0; i < sorted.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(today.getDate() - streak);

    const taskDate = new Date(sorted[i]);
    if (taskDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  for (let taskName in tasks) {
    const task = tasks[taskName];
    const streak = calculateStreak(task.history);

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${taskName} — 🔥 Streak: ${streak}</span>
      <div>
        <button onclick="markDone('${taskName}')">✅ Done</button>
        <button onclick="deleteTask('${taskName}')">🗑 Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  }
}

function markDone(taskName) {
  const today = new Date().toISOString().split("T")[0];
  if (!tasks[taskName].history.includes(today)) {
    tasks[taskName].history.push(today);
    saveTasks();
    renderTasks();
  } else {
    alert("Task already marked done today!");
  }
}

function deleteTask(taskName) {
  if (confirm(`Delete task "${taskName}"?`)) {
    delete tasks[taskName];
    saveTasks();
    renderTasks();
  }
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("taskInput");
  const taskName = input.value.trim();
  if (taskName && !tasks[taskName]) {
    tasks[taskName] = { history: [] };
    saveTasks();
    renderTasks();
    input.value = "";
  } else {
    alert("Task already exists or input is empty.");
  }
});

renderTasks();
