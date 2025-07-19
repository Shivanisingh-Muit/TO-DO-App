document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const listContainer = document.getElementById('list-container');
    const form = document.querySelector('.input-form');

    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalActions = document.getElementById('modal-actions');

    renderTasks();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = inputBox.value.trim();

        if (taskText === '') {
            showModal('Invalid Input', 'You must write something!', [{ text: 'OK', class: '', action: hideModal }]);
            return;
        }

        const tasks = getTasks();
        tasks.push({ text: taskText, checked: false });
        saveTasks(tasks);
        renderTasks();
        inputBox.value = '';
    });

    listContainer.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;

        const tasks = getTasks();
        const taskIndex = parseInt(li.dataset.index, 10);

        if (target.classList.contains('delete-btn')) {
            showModal(
                'Confirm Deletion',
                `Are you sure you want to delete this task?`,
                [
                    { text: 'Cancel', class: '', action: hideModal },
                    { 
                        text: 'Delete', 
                        class: 'btn-danger', 
                        action: () => {
                            tasks.splice(taskIndex, 1);
                            saveTasks(tasks);
                            renderTasks();
                            hideModal();
                        }
                    }
                ]
            );
        } else {
            tasks[taskIndex].checked = !tasks[taskIndex].checked;
            saveTasks(tasks);
            renderTasks();
        }
    });

    function showModal(title, message, actions) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalActions.innerHTML = '';

        actions.forEach(actionInfo => {
            const button = document.createElement('button');
            button.textContent = actionInfo.text;
            button.className = actionInfo.class;
            button.addEventListener('click', actionInfo.action);
            modalActions.appendChild(button);
        });

        modalOverlay.classList.remove('hidden');
    }

    function hideModal() {
        modalOverlay.classList.add('hidden');
    }

    function renderTasks() {
        const tasks = getTasks();
        listContainer.innerHTML = '';
        if (tasks.length === 0) return;

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task.text;
            li.dataset.index = index;
            if (task.checked) {
                li.classList.add('checked');
            }

            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = '\u00d7';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Delete task';
            li.appendChild(deleteBtn);
            listContainer.appendChild(li);
        });
    }

    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});