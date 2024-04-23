
let currentId = 200;

let users = [];
let tasks = [];

const todoList = document.getElementById('todo-list');

document.addEventListener("DOMContentLoaded", initApp);

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


function createCheckBox(task, user, id, completed) {
	const addStatus = () => completed ? 'checked' : '';
	function verifyUser (userId) {
		let foundUser = users.find(user => user.id == userId);
		console.log(foundUser.name);
		
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

}

document.querySelector('form').addEventListener('submit', submitTask);
document.querySelector('#todo-list').addEventListener('click', deleteTask);
document.querySelector('#todo-list').addEventListener('change', changeTaskStatus);

function submitTask(e) {
	e.preventDefault();

	let inputValue = document.getElementById('new-todo').value.trim();
	let select = document.getElementById('user-todo');
	let selectedOption = select.options[select.selectedIndex];

	
	if (select.value && inputValue) {
		sendTaskToServer(inputValue, selectedOption.innerText);
		createCheckBox(inputValue, selectedOption.value, currentId, false);
	} else {
		alert('Required fields are not filled!!!');
	}
}

function deleteTask(e) {
	let closeCross = e.target.closest('.close');
	
	
	if (closeCross) {
		let delededId = closeCross.previousElementSibling.dataset.id;
		closeCross.closest('.todo-item').remove();
		deleteTaskFromServer(delededId);
	}
}

function sendTaskToServer(task, name) {
	currentId++;

	fetch('https://jsonplaceholder.typicode.com/todos', {
		method: 'POST',
		body: JSON.stringify({
			"userId": `${name}`,
			"id": `${currentId}`,
			"title": `${task}`,
			"completed": false
		}),
		headers: {
			'Content-Type': 'application/json'
		},
	})
	.then(resp => {
		if(resp.ok) {
			return resp.json()
		}
		throw new Error('failed to add')
	})
	.then(console.log)
	.catch(console.error)
}

function deleteTaskFromServer(id) {

	fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
		method: 'DELETE',
	})
		.then(resp => {
			if (resp.ok) {
				return resp.json()
			}
			throw new Error('failed to add')
		})
		.then(console.log)
		.catch(console.error)
}

function changeTaskStatus(e) {
		let checkBox = e.target.closest('input')
		let inputId = checkBox.dataset.id;
		if (checkBox.checked) {
			sendStatusToServer(inputId, true)
		} else {
			sendStatusToServer(inputId, false)
		}
}

function sendStatusToServer(id, status) {
	fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
		method: "PATCH",
		body: JSON.stringify({
			"completed": `${status}`
		}),
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(resp => {
			if (resp.ok) {
				return resp.json()
			}
			throw new Error('failed to add')
		})
		.then(console.log)
		.catch(console.error)
}
