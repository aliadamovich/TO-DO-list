
let currentId = 200;


document.addEventListener("DOMContentLoaded", loadUsers);
document.addEventListener("DOMContentLoaded", loadTasks);


function loadUsers() {
	fetch('https://jsonplaceholder.typicode.com/users')
	.then(response => response.json())

	.then(data => {
		addUser(data)
	})
}

function addUser(users) {
	const select = document.getElementById('user-todo');
	users.forEach(user => {
		let newUser = new Option(user.name, user.id);
		select.append(newUser)
	})
}

function loadTasks() {
	fetch('https://jsonplaceholder.typicode.com/todos')
		.then(response => response.json())
		.then(data => {
			data.forEach(item => {
				createCheckBox(item.title, item.userId, item.id)
			})
		})
}


function createCheckBox(task, user, id) {
	
	document.getElementById('todo-list').insertAdjacentHTML(
		'afterbegin',
		`
		<li class="todo-item">
		<input data-id=${id} type="checkbox">${task} by ${user}
		<span class="close">&#9747</span>
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
	let selectedOption = select.options[select.selectedIndex]
	if (select.value && inputValue) {
		sendTaskToServer(inputValue, selectedOption.innerText);
		createCheckBox(inputValue, selectedOption.innerText, currentId);
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
