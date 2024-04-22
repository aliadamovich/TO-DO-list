let userNames = [];
let tasks = [];
function getUsers() {
	fetch('https://jsonplaceholder.typicode.com/users')
	.then(response => response.json())
	.then(data => {
		
		data.forEach(user => {
			userNames = [...userNames, user.name]
		})
		return userNames
	})
	.then(data => {
		addUser(data)
	})
}
getUsers()
loadTasks()

function addUser(users) {
	const select = document.getElementById('user-todo');

	for (let i = 0; i < users.length; i++) {
		let newUser = new Option(users[i], i + 1);
		select.append(newUser)
	}
}

function loadTasks() {
	fetch('https://jsonplaceholder.typicode.com/todos')
		.then(response => response.json())
		.then(data => {

			data.forEach(task => {
				tasks = [...tasks, task.title]
			})
			return tasks
		})
		.then(data => {
			addTaska(data)
		})
}

function addTaska(value) {
	
	for (let i = 0; i < value.length; i++) {
		createCheckBox(value[i], i+1)
	}
}

function createCheckBox(task, user) {
	document.getElementById('todo-list').insertAdjacentHTML(
		'afterbegin',
		`
		<li class="todo-item">
		<input type="checkbox">${task} by ${user}
		<span class="close">&#9747</span>
		</li>
		`
	);
}

// document.querySelector('button').addEventListener('click', newTodo);
document.querySelector('form').addEventListener('submit', handleOnChange)

function handleOnChange(e) {
	e.preventDefault();

	let inputValue = document.getElementById('new-todo').value;
	let select = document.getElementById('user-todo');
	if (select.value && inputValue) {
		sendToServer();
	} else {
		alert('Required fields are not filled!!!');
		
	}
}

// function newTodo() {
// 	let value = document.getElementById('new-todo').value;
// 	let author = document.querySelector('');
// 	document.querySelector('');
// }