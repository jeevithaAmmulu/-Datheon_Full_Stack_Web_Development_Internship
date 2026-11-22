
// =====================================
// TASK MANAGER APPLICATION
// =====================================

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const dueDateInput = document.getElementById("dueDateInput");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const taskCount = document.getElementById("taskCount");
const currentDate = document.getElementById("currentDate");

// =====================================
// LOAD TASKS FROM LOCAL STORAGE
// =====================================

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

let currentFilter = "all";

// Display current date
if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// =====================================
// SAVE TASKS
// =====================================

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

// =====================================
// ADD NEW TASK
// =====================================

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();
    const category = categoryInput.value;
    const dueDate = dueDateInput.value;

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        title: title,
        category: category,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    taskForm.reset();
    renderTasks();
    taskInput.focus();
});

// =====================================
// DISPLAY TASKS
// =====================================

function renderTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filteredTasks = tasks.filter(function(task) {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            task.category === selectedCategory;

        const matchesStatus =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Show active tasks before completed tasks
    filteredTasks.sort(function(a, b) {
        return Number(a.completed) - Number(b.completed);
    });

    if (taskCount) {
        taskCount.textContent =
            filteredTasks.length +
            (filteredTasks.length === 1 ? " Task" : " Tasks");
    }

    // Always update statistics, even when no tasks are displayed
    updateStatistics();

    // Empty state
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No tasks found!</h3>
                <p>Add a new task or change your filters.</p>
            </div>
        `;
        return;
    }

    // Create task cards
    filteredTasks.forEach(function(task) {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";

        if (task.completed) {
            taskCard.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as completed");

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        // Task information
        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const taskDetails = document.createElement("div");
        taskDetails.className = "task-details";

        const title = document.createElement("h4");
        title.textContent = task.title;

        const meta = document.createElement("div");
        meta.className = "task-meta";

        // Category
        const category = document.createElement("span");
        category.className = "category";
        category.textContent = task.category;
        meta.appendChild(category);

        // Due date
        if (task.dueDate) {
            const date = document.createElement("span");
            date.textContent = "📅 " + formatDate(task.dueDate);
            meta.appendChild(date);
        }

        taskDetails.appendChild(title);
        taskDetails.appendChild(meta);

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(taskDetails);

        // Action buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "action-btn";
        editButton.textContent = "✏️";
        editButton.title = "Edit task";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "action-btn delete-btn";
        deleteButton.textContent = "🗑️";
        deleteButton.title = "Delete task";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        taskCard.appendChild(taskInfo);
        taskCard.appendChild(actions);

        taskList.appendChild(taskCard);
    });
}

// =====================================
// UPDATE STATISTICS AND ALL PERCENTAGES
// =====================================

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const active = total - completed;

    // Calculate percentages
    const completedPercentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const pendingPercentage = total === 0
        ? 0
        : Math.round((active / total) * 100);

    // Dashboard statistics
    if (totalTasks) totalTasks.textContent = total;
    if (activeTasks) activeTasks.textContent = active;
    if (completedTasks) completedTasks.textContent = completed;

    // Main progress section
    const progressPercentage =
        document.getElementById("progressPercentage");

    const progressFill =
        document.getElementById("progressFill");

    const progressCompleted =
        document.getElementById("progressCompleted");

    const progressRemaining =
        document.getElementById("progressRemaining");

    if (progressPercentage) {
        progressPercentage.textContent = completedPercentage + "%";
    }

    if (progressFill) {
        progressFill.style.width = completedPercentage + "%";
    }

    if (progressCompleted) {
        progressCompleted.textContent = completed + " Completed";
    }

    if (progressRemaining) {
        progressRemaining.textContent = active + " Remaining";
    }

    // Analytics section
    const completedPercentageElement =
        document.getElementById("completedPercentage");

    const pendingPercentageElement =
        document.getElementById("pendingPercentage");

    const analyticsTotal =
        document.getElementById("analyticsTotal");

    if (completedPercentageElement) {
        completedPercentageElement.textContent =
            completedPercentage + "%";
    }

    if (pendingPercentageElement) {
        pendingPercentageElement.textContent =
            pendingPercentage + "%";
    }

    if (analyticsTotal) {
        analyticsTotal.textContent = total;
    }
}

// =====================================
// FORMAT DATE
// =====================================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// =====================================
// EDIT TASK
// =====================================

function editTask(id) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) return;

    const updatedTitle = prompt("Edit your task:", task.title);

    if (updatedTitle === null) return;

    if (updatedTitle.trim() === "") {
        alert("Task title cannot be empty!");
        return;
    }

    task.title = updatedTitle.trim();

    saveTasks();
    renderTasks();
}

// =====================================
// DELETE TASK
// =====================================

function deleteTask(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

// =====================================
// COMPLETE / UNCOMPLETE TASK
// =====================================

function toggleTask(id) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

// =====================================
// SEARCH TASKS
// =====================================

searchInput.addEventListener("input", function() {
    renderTasks();
});

// =====================================
// CATEGORY FILTER
// =====================================

categoryFilter.addEventListener("change", function() {
    renderTasks();
});

// =====================================
// SIDEBAR FILTER
// =====================================

document.querySelectorAll(".menu-item").forEach(function(button) {
    button.addEventListener("click", function() {
        document.querySelectorAll(".menu-item").forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// =====================================
// INITIAL DISPLAY
// =====================================

renderTasks();

// =====================================
// LIGHT AND DARK THEME
// =====================================

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("taskflow-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.innerHTML = '<span class="mode-icon">☾</span> Dark Mode';
    } else {
        themeToggle.innerHTML = '<span class="mode-icon">☀</span> Light Mode';
    }

    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("light-theme");

        if (document.body.classList.contains("light-theme")) {
            localStorage.setItem("taskflow-theme", "light");
            themeToggle.innerHTML = '<span class="mode-icon">☾</span> Dark Mode';
        } else {
            localStorage.setItem("taskflow-theme", "dark");
            themeToggle.innerHTML = '<span class="mode-icon">☀</span> Light Mode';
        }
    });
}
