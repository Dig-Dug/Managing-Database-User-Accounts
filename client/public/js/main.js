let formHtml = `
<form>
<input type="text" id="username" placeholder="Benutzername" required />
<input type="text" id="given_name" placeholder="Vorname" required />
<input type="text" id="surname" placeholder="Nachname" required />
<input type="text" id="password" placeholder="Passwort" required />
<button id="submit">Absenden</button>
</form>
`;

let buttonEl;

function getUsers() {
    let req = new XMLHttpRequest();
    req.addEventListener('load', showUsers);
    req.open('GET', "http://localhost:8000/api");
    req.send();
}

function showUsers(evt) {
    let response = JSON.parse(evt.currentTarget.responseText);
    let users = response.response;
    
    let tableHtml = '<table><tr><th>Benutzername</th></tr>';
    users.forEach(element => {
        tableHtml += '<tr><td><a href="#" class="alert-link" onclick="showDetail(' + element.id + ')">'
                + element.username + '</a></td></tr>';
    });
    tableHtml += '</table>';
    let tableDiv = document.getElementById('table');
    tableDiv.innerHTML = tableHtml;
    if(!buttonEl){
        buttonEl = document.getElementById('button');
    } else if(!document.getElementById('button')){
        let bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.insertAdjacentElement('beforeend',buttonEl);

    }
    buttonEl.innerText = 'Neuen Benutzer hinzufügen';
    buttonEl.onclick = addUser;
}

function showDetail(id) {
    // remove elements from former action
    document.getElementById('table').innerText = '';
    //buttonEl = document.getElementById('button');
    buttonEl.remove();

    // get user data from the rest api
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', showUser);
    xhr.open('get', 'http://localhost:8000/api/' + id);
    xhr.send();

    
}
function showUser(evt) {
    let response = JSON.parse(evt.currentTarget.responseText);
    let user = response.response;
    let tableHtml = `<table><tr><th>Benutzername</th><th>Vorname</th>
            <th>Nachname</th><th>Passwort</th></tr>`;
    tableHtml += `<tr><td>${user.username}</td><td>${user.given_name}</td>
            <td>${user.surname}</td><td>${user.password}</td>`;
            tableHtml += `<td><button onclick="updateUser(${user.id})">Bearbeiten</button></td>`;
            tableHtml += `<td><button onclick="deleteUser(${user.id})">Entfernen</button></td>`;

    tableHtml += '</tr></table>';
    let tableElem = document.getElementById('table');
    tableElem.innerHTML = tableHtml;
}

function addUser() {
    let tableDiv = document.getElementById('table');
    tableDiv.innerHTML = formHtml;
    document.getElementById('button').remove();
    document.getElementById('submit').onclick = doAddUser;
}

function doAddUser() {
    let userNameValue = document.getElementById('username').value;
    let givenNameValue = document.getElementById('given_name').value;
    let surNameValue = document.getElementById('surname').value;
    let passwordValue = document.getElementById('password').value;
    
    let user = {};
    user.username = userNameValue;
    user.given_name = givenNameValue;
    user.surname = surNameValue;
    user.password = passwordValue;
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', getUsers);
    
    xhr.open('post', 'http://localhost:8000/api');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(user));

    
       // console.log(evt.currentTarget.responseText);
   
}
function updateUser(id){
    let tableDiv = document.getElementById('table');
    tableDiv.innerHTML = formHtml;
    let  xhr = new XMLHttpRequest();
    xhr.addEventListener('load', ()=> {
        let response = xhr.responseText;
        response = JSON.parse(response);
        let user = response.response;
        document.getElementById('username').value = user.username;
        document.getElementById('given_name').value = user.given_name;
        document.getElementById('surname').value = user.surname;
        document.getElementById('password').value = user.password;
        document.getElementById('submit').onclick = doUpdateUser;
        
    });
    xhr.open('get', 'api/' + id);
    xhr.send();
    document.getElementById('submit').innerText = 'Bearbeiten';
    
    function doUpdateUser() {
        let userNameValue = document.getElementById('username').value;
        let givenNameValue = document.getElementById('given_name').value;
        let surNameValue = document.getElementById('surname').value;
        let passwordValue = document.getElementById('password').value;

        let user = {};
        user.username = userNameValue;
        user.given_name = givenNameValue;
        user.surname = surNameValue;
        user.password = passwordValue;
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', getUsers);
        xhr.open('post', 'api/' + id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(user));
    }

}
function deleteUser(id){
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', getUsers);
    xhr.open('delete', 'api/' + id);
    xhr.send();
}
