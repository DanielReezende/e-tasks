const input = document.querySelector('#task');
const button = document.querySelector('#button_create');

const DB_KEY = '@e-Tasks';

const STORAGE_SERVICE = {
  listTasks: () => {
    const storage = localStorage.getItem(DB_KEY);

    if (storage) {
      const storageParsed = JSON.parse(storage);

      return storageParsed.tasks;
    }

    return []
  },


  createTask: (task) => {
    const storage = localStorage.getItem(DB_KEY);

    const newTask = {
      description: task,
      isCompleted: false,
    }

    if (storage) {
      const storageParsed = JSON.parse(storage);

      const tasks = [...storageParsed.tasks, newTask];

      return localStorage.setItem(DB_KEY, JSON.stringify({ tasks: tasks }));
    }

    return localStorage.setItem(DB_KEY, JSON.stringify({ tasks: [newTask] }))
  },

  deleteTask: (task) => {
    const storage = localStorage.getItem(DB_KEY);

    if (storage) {
      const storageParsed = JSON.parse(storage);

      const filteredTasks = storageParsed.tasks.filter(item => item.task !== task);

      return localStorage.setItem(DB_KEY, JSON.stringify({ tasks: filteredTasks }));
    }

    return alert('Task not found');
  },

  updateTaskState: (description) => {

    const storage = localStorage.getItem(DB_KEY);

    if (storage) {
      const storageParsed = JSON.parse(storage);

      const upatedTasks = storageParsed.tasks.map(item => {
        if (item.description === description) {
          return {
            ...item,
            isCompleted: !item.isCompleted
          }
        }

        return item
      });


      return localStorage.setItem(DB_KEY, JSON.stringify({ tasks: upatedTasks }));
    }

    return alert('Task not found');
  }

}



button.addEventListener('click', e => {
  e.preventDefault();

  if (!input.value) {
    alert('A tarefa é obrigatória');

    return;
  }

  STORAGE_SERVICE.createTask(input.value);

  updateActivityList();
});

document.addEventListener('DOMContentLoaded', () => {
  updateActivityList();
});

const updateStateTask = (event) => {
  const input = event.target
  const description = input.value

  STORAGE_SERVICE.updateTaskState(description)

  updateActivityList();
}

const createTaskItem = (task) => {

  let input = `
  <input 
  onchange="updateStateTask(event)"
  type="checkbox" 
  value="${task.description}"
  `

  if (task.isCompleted) {
    input += 'checked'
  }

  input += '>'


  return `
      <li class="task-item">
         ${input}
        <p>${task.description}</p>
      </li>
    `
}




const updateActivityList = () => {
  const ul = document.querySelector('.task-list');
  const div = document.querySelector('.empty-state');

  div.style.display = 'none';
  div.innerHTML = '';

  const tasks = STORAGE_SERVICE.listTasks();

  const counterTask = document.querySelector('.count-tasks');
  const counterTasksCompleted = document.querySelector('.count-finisheds');

  const countTasks = tasks.length;

  const countTasksCompleted = tasks.filter(task => task.isCompleted === true).length;
  counterTask.textContent = countTasks;
  counterTasksCompleted.textContent = countTasksCompleted


  ul.innerHTML = '';

  if (tasks.length === 0) {
    div.style.display = 'block';
    div.innerHTML = `<p>Nenhuma tarefa cadastrada.</p>`;
    return;
  }

  for (let task of tasks) {
    ul.innerHTML += createTaskItem(task);
  }
}

updateActivityList();

