// Fungsi untuk membuka atau membuat database IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("AppDatabase", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Buat object store 'users' dan 'tokens'
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("tokens")) {
                db.createObjectStore("tokens", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Database error: ${event.target.errorCode}`);
        };
    });
}

// Fungsi untuk menambahkan data user ke IndexedDB
async function addUser(user) {
    const db = await openDatabase();
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
        const request = store.add(user);
        request.onsuccess = () => resolve("User berhasil disimpan!");
        request.onerror = (event) => reject(`Gagal menambahkan user: ${event.target.error}`);
    });
}

// Fungsi untuk menambahkan token ke IndexedDB
async function addToken(token) {
    const db = await openDatabase();
    const transaction = db.transaction("tokens", "readwrite");
    const store = transaction.objectStore("tokens");

    return new Promise((resolve, reject) => {
        const request = store.add({ token });
        request.onsuccess = () => resolve("Token berhasil disimpan!");
        request.onerror = (event) => reject(`Gagal menambahkan token: ${event.target.error}`);
    });
}

// Fungsi untuk mengambil semua data users dari IndexedDB
async function getUsers() {
    const db = await openDatabase();
    const transaction = db.transaction("users", "readonly");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(`Gagal mengambil data user: ${event.target.error}`);
    });
}

// Fungsi untuk mengambil semua token dari IndexedDB
async function getTokens() {
    const db = await openDatabase();
    const transaction = db.transaction("tokens", "readonly");
    const store = transaction.objectStore("tokens");

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(`Gagal mengambil token: ${event.target.error}`);
    });
}

// Fungsi untuk memperbarui data user berdasarkan ID
async function updateUser(id, newUser) {
    const db = await openDatabase();
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
        const request = store.put({ ...newUser, id });
        request.onsuccess = () => resolve("User berhasil diperbarui!");
        request.onerror = (event) => reject(`Gagal memperbarui user: ${event.target.error}`);
    });
}

// Fungsi untuk menghapus user berdasarkan ID
async function deleteUser(id) {
    const db = await openDatabase();
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve("User berhasil dihapus!");
        request.onerror = (event) => reject(`Gagal menghapus user: ${event.target.error}`);
    });
}

// Fungsi contoh penggunaan
async function main() {
    try {
        // Menambahkan user
        const user = { name: "Agus Siswanto", email: "siswantoa956@gmail.com" };
        console.log(await addUser(user));

        // Menambahkan token
        const token = "your-authentication-token";
        console.log(await addToken(token));

        // Mengambil semua users
        const users = await getUsers();
        console.log("Users:", users);

        // Mengambil semua tokens
        const tokens = await getTokens();
        console.log("Tokens:", tokens);

        // Memperbarui user
        if (users.length > 0) {
            const userId = users[0].id;
            const updatedUser = { name: "Agus Updated", email: "updated@gmail.com" };
            console.log(await updateUser(userId, updatedUser));
        }

        // Menghapus user
        if (users.length > 0) {
            const userId = users[0].id;
            console.log(await deleteUser(userId));
        }
    } catch (error) {
        console.error(error);
    }
}

// Panggil fungsi main untuk menjalankan semua contoh
main();
