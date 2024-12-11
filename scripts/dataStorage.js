const BASE_URL = "https://join-f6aef-default-rtdb.europe-west1.firebasedatabase.app/";


async function save() {
  await putData("/contacts", contacts);
  await putData("/tasks", tasks);
  await putData("/status", statusTask);
  await putData("/users", users);
  await putData("/isLoggedIn", isLoggedIn)
}


async function load() {
  await loadData("/contacts", contacts);
  await loadData("/tasks", tasks);
  await loadData("/users", users);
  await loadLogInStatus();
  await loadDataStatus();
}


async function loadData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  Object.assign(data, responseToJson);
  //console.log(data, 'load');
};


async function loadDataStatus() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  statusTask = responseToJson.status;
  //console.log(statusTask, 'load');
};

async function loadLogInStatus() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  isLoggedIn = responseToJson.isLoggedIn;
}


async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  let responseToJson = await response.json();
  //console.log(responseToJson, 'save');
};

