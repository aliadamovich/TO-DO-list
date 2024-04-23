
//Globals
let currentId = 200;
let users = [];
let tasks = [];
const todoList = document.getElementById('todo-list');


//!attach events
document.addEventListener("DOMContentLoaded", initApp);
document.querySelector('form').addEventListener('submit', submitTask);


//!event logic
function initApp() {
	Promise.all([loadUsers(), loadTasks()]).then( values => {
		[users, tasks] = values;

		//add users from server
		users.forEach(user => {
			const select = document.getElementById('user-todo');
			let newUser = new Option(user.name, user.id);
			select.append(newUser)
		})

		//add tasks from server
		tasks.forEach(item => {
			createCheckBox(item.title, item.userId, item.id, item.completed)
		})
	})
}

function submitTask(e) {
	e.preventDefault();

	const form = document.querySelector('form');
	let inputValue = form.todo.value.trim(); //получила доступ к инпут по name в форме
	let select = form.user; //получила доступ к select по name в форме
	console.log(select.options[select.selectedIndex].textContent);
	
	if (select.value && inputValue) {
		sendTaskToServer(inputValue, select.value);
	} else {
		alert('Required fields are not filled!!!');
	}
}

function changeTaskStatus(e) {
	let checkBox = e.target.closest('input');
	let inputId = checkBox.dataset.id;

	
	if (checkBox.checked) {
		sendStatusToServer(inputId, true)
	} else {
		sendStatusToServer(inputId, false)
	}
}

function handleClose(e) {

	let closeCross = e.target.closest('.close');
	
	if (closeCross) {
		let parent = closeCross.closest('li');
		let deletedId = parent.firstElementChild.dataset.id;
		
		deleteTaskFromServer(deletedId);
	}
}

//! Basic logic
function createCheckBox(task, user, id, completed) {
	const addStatus = () => completed ? 'checked' : '';
	function verifyUser(userId) {
		let foundUser = users.find(user => user.id == userId);
		return foundUser.name;
	}

	todoList.insertAdjacentHTML(
		'afterbegin',
		`
		<li class="todo-item">
		<input data-id=${id} ${addStatus()} type="checkbox">${task} <i>by</i> <b>${verifyUser(user)}</b>
		<span class="close">&times;</span>
		</li>
		`
	);
	document.querySelector('#todo-list').addEventListener('click', handleClose);
	document.querySelector('#todo-list').addEventListener('change', changeTaskStatus);
}

function deleteTask(dataId) {
	let todo = todoList.querySelector(`[data-id="${dataId}"]`)
	todo.parentElement.remove();
}

//!async logic
async function loadUsers() {
	const resp = await fetch('https://jsonplaceholder.typicode.com/users');
	const data = await resp.json();
	return data;

}

async function loadTasks() {
	const resp = await fetch('https://jsonplaceholder.typicode.com/todos');
	const data = await resp.json();
	return data;
}

async function sendTaskToServer(task, name) {

	const resp = await fetch('https://jsonplaceholder.typicode.com/todos', {
		method: 'POST',
		body: JSON.stringify({
			"userId": name,
			"title": task,
			"completed": false
		}),
		headers: {
			'Content-Type': 'application/json'
		},
	});
	const serverTask = await resp.json(); //в ответ нам приходит сам элемент task (мы берем его id который сервер присваивает 
	//автоматически и передаем в функцию createCheckBox)
	console.log(serverTask);
	
	//только после того как таск был отправлен на сервер, создаем его на сайте
	createCheckBox(task, name, serverTask.id, false)

}

async function sendStatusToServer(id, status) {
	const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
		method: "PATCH",
		body: JSON.stringify({
			"completed": `${status}`
		}),
		headers: {
			'Content-Type': 'application/json'
		},
	});
	if (!resp.ok) {
		//error message
	}
}

async function deleteTaskFromServer(id) {
	const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
		method: 'DELETE',
	});

	if (resp.ok) {
		deleteTask(id)
	}

}






