

async function init() {
    tasks = [
        {
          'titel': 'Kochwelt Page & Recipe Recommender',
          'description': 'Build start page with recipe recommendation',
          'categoryUser': true,
          'date': new Date(2024, 10, 29),
          'priority': 1,
          'status': 2,
          'progress': 0,
          'members': ['Jutta Berger', 'Anna Horn'],
          'subtasks': [
            { 'subtitel': 'Design UI', 'isDone': false },
            { 'subtitel': 'function b', 'isDone': true }
          ]
        },
        {
          'titel': 'CSS Architecture Planning',
          'description': 'Define CSS naming conventions and structure',
          'categoryUser': false,
          'date': new Date(2024, 10, 28),
          'priority': 3,
          'status': 4,
          'progress': 0,
          'members': ['Josef Müller', 'Anton Sippel', 'Saul Goodman'],
          'subtasks': [
            { 'subtitel': 'menue design', 'isDone': true },
            { 'subtitel': 'function a', 'isDone': true }
          ]
        }
      ];
      await save();
      renderTasks();
}


const BASE_URL = "https://join-f6aef-default-rtdb.europe-west1.firebasedatabase.app/";


async function save() {
    // let tasksSave = JSON.stringify(tasks);
    // let statusTaskSave = JSON.stringify(statusTask);
    // localStorage.setItem('tasks', tasksSave);
    // localStorage.setItem('statusTask', statusTaskSave);
    await putData("/tasks", tasks);
    await putData("/status", statusTask);
}


async function load() {
    // let tasksSave = localStorage.getItem('tasks');
    // let statusTaskSave = localStorage.getItem('statusTask');
    // tasks = JSON.parse(tasksSave);
    // statusTask = JSON.parse(statusTaskSave);
    await loadData("/tasks", tasks);
    await loadDataStatus();
}





async function test() {
    await loadData("/tasks/tasks");
    // postData("/names/type/type", {"type": "test"});
    // putData("/tasks", {tasks});
    // deleteData("/names");

    // let user = await loadArrayData("/names");
    // let userArray = Object.keys(user); // Object.entries(user); //Object.keys(user); z.B.
    // console.log(userArray);

    // for (let i = 0; i < userArray.length; i++) {
    //     users.push(
    //         {
    //             id : userArray[i],
    //             user : user[userArray[i]],
    //         }
    //     )
    // }
    // console.log(users);
};




async function loadArrayData(path=""){
      let response = await fetch(BASE_URL + path + ".json");
      return responseToJson = await response.json();
};


async function loadData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    Object.assign(data, responseToJson);
    console.log(data, 'load');
};

async function loadDataStatus(){
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
    statusTask = responseToJson.status;
    console.log(statusTask, 'load');
};

// async function loadData(path = "") {
//     let response = await fetch(BASE_URL + path + ".json");
//     let responseToJson = await response.json();
//     console.log(responseToJson.status, "Full response from Firebase");
//     return responseToJson;
// }


async function postData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    console.log(responseToJson);
};


async function putData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    console.log(responseToJson, 'save');
};


async function deleteData(path=""){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    let responseToJson = await response.json();
    console.log(responseToJson);
};