const InstalledModules = new Map();
let focusedApp;

// Declared here to be a spot for any app to be able to access specific functions, much like a syscall
const builtinFunctions = ["sys_log", "clear", "close", "openCalc", "toggleSearchApps", "logOut", "lock",
    "openSettings", "toggleSearchAppsBig", "main", "power", "restart", "showDesk", "hideDesk", "autohideShelf",
    "getBattery", "devCommand", "devVar"];

async function loadApp(path) {
    let moduleName = path.match(/[^/]+(?=(?:\.[^.]+)?$)/)[0];
    moduleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1, moduleName.length - 3);

    console.log(moduleName);

    InstalledModules.set(moduleName, await import(path));
}

function FocusApp(element) {
    console.log("Element:", element);
    let oldFocused = focusedApp;
    focusedApp = element;

    console.log("Old Focused:", oldFocused);
    if (oldFocused !== undefined) {
        oldFocused.unfocusApp();
    }

    console.log("FocusApp:", focusedApp.id);

    return true;
}

function addIcons(node) {
    for (let i = 1; i <= num; i++) {
        var icon = document.createElement('div');
        icon.classList.add("icon");

        document.getElementById("Apps-Container").appendChild(icon);
    }
}

function sys_log(...input) {
    console.log(input);
}