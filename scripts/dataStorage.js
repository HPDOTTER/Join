/**
 * Base URL for Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL = "https://join-f6aef-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Saves the current state of contacts, tasks, statusTask, and users to the database.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function save() {
  await putData("/contacts", contacts);
  await putData("/tasks", tasks);
  await putData("/status", statusTask);
  await putData("/users", users);
}

/**
 * Loads the state of contacts, tasks, users, and statusTask from the database.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function load() {
  await loadData("/contacts", contacts);
  await loadData("/tasks", tasks);
  await loadData("/users", users);
  await loadDataStatus();
}

/**
 * Loads data from the database for a specific path and merges it into the provided object.
 * @async
 * @function
 * @param {string} [path=""] - The database path to fetch data from.
 * @param {Object} [data={}] - The object to merge the fetched data into.
 * @returns {Promise<void>}
 */
async function loadData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  Object.assign(data, responseToJson);
}

/**
 * Loads the statusTask data from the database.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function loadDataStatus() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  statusTask = responseToJson.status;
}

/**
 * Updates the database with the provided data at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The database path to update data at.
 * @param {Object} [data={}] - The data to update in the database.
 * @returns {Promise<void>}
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
}

