// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const firebaseConfig = {
    apiKey: "AIzaSyCUHpJ8VOtGZ2XuIdfhvFmbeTC4sa2yNRw",
    authDomain: "umrahtrasnsport.firebaseapp.com",
    databaseURL: "https://umrahtrasnsport-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "umrahtrasnsport",
    storageBucket: "umrahtrasnsport.firebasestorage.app",
    messagingSenderId: "889214407819",
    appId: "1:889214407819:web:755986a87e1b4cbd55308e"
};

let mainApp, auth, db, secondaryApp, secondaryAuth;

try {
    if (!firebase.apps.length) {
        mainApp = firebase.initializeApp(firebaseConfig);
    } else {
        mainApp = firebase.app();
    }
    auth = firebase.auth(mainApp);
    db = firebase.database(mainApp);

    if (!firebase.apps.some(app => app.name === "Secondary")) {
        secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
    } else {
        secondaryApp = firebase.app("Secondary");
    }
    secondaryAuth = firebase.auth(secondaryApp);
} catch (e) {
    console.warn("Firebase init error:", e);
}

const getEmail = (username) => {
    if (username && username.includes('@')) return username;
    return `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@umrahtransport.local`;
};