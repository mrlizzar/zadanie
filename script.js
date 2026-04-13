let tasks = [];
let currentFilter = 'all';

const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-input');
const todoList = document.getElementById('todo-list');
const sortSelect = document.getElementById('sort-select');
const filterBtns = document.querySelectorAll('.filter-btn');

// Dodawanie zadania
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        text: input.value,
        priority: parseInt(prioritySelect.value),
        completed: false,
        date: new Date()
    };
    tasks.push(newTask);
    input.value = '';
    render();
});

// Renderowanie listy
function render() {
    let filteredTasks = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    const sortBy = sortSelect.value;
    filteredTasks.sort((a, b) => {
        if (sortBy === 'priority') return b.priority - a.priority;
        if (sortBy === 'name') return a.text.localeCompare(b.text);
        return b.id - a.id;
    });

    todoList.innerHTML = '';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm rounded task-item priority-${task.priority}`;
        
        // Zabezpieczenie przed XSS przez użycie textContent wewnątrz szablonu
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <input type="checkbox" class="form-check-input me-3" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})" aria-label="Zaznacz jako wykonane">
                <span class="${task.completed ? 'completed' : ''} h5 mb-0">${escapeHTML(task.text)}</span>
            </div>
            <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteTask(${task.id})" aria-label="Usuń zadanie">
                Usuń
            </button>
        `;
        todoList.appendChild(li);
    });
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Obsługa filtrów
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.replace('btn-primary', 'btn-white'));
        btn.classList.replace('btn-white', 'btn-primary');
        currentFilter = btn.dataset.filter;
        render();
    });
});

sortSelect.addEventListener('change', render);