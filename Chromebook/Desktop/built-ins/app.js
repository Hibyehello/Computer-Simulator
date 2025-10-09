export class BaseApp {
    appHeader;

    constructor(name, height, width) {
        this.appDiv = document.createElement("div");
        this.appDiv.tabIndex = "-1";
        this.id = name;
        this.appDiv.id = name;
        this.appDiv.style.height = height;
        this.appDiv.style.width = width;
        this.displayType = "flex";
        this.open = false;
        this.focused = false;
        this.icon = null;
        this.small_icon = null;
        this.installed = false;

        // Make sure these functions are bound
        this.openApp = this.openApp.bind(this);
        this.closeApp = this.closeApp.bind(this);
        this.minimizeApp = this.minimizeApp.bind(this);
        this.maximizeApp = this.maximizeApp.bind(this);
        this.focusApp = this.focusApp.bind(this);
        this.unfocusApp = this.unfocusApp.bind(this);
    }

    openApp() {
        this.open = true;
        this.appDiv.style.display = this.displayType;
        document.body.appendChild(this.appDiv);

        if(this.appHeader && this.appHeader.onmousedown == null) { 
            this.EnableDragging();
        }
        this.focusApp();
        this.appDiv.addEventListener("click", this.focusApp);
    }

    minimizeApp() {
        this.appDiv.style.display = "none";
    }
    
    maximizeApp() {
        console.log("TODO: Implement maximize");
    }

    closeApp() {
        this.open = false;
        document.body.removeChild(this.appDiv);
    }

    addClassName(className) {
        this.appDiv.classList.add(className);
    }

    createHeader(showButtons="ttt", showName=false) {
        this.appHeader = document.createElement("div");
        this.appHeader.classList.add("app-menu");
        this.appHeader.id = this.appDiv.id + "-header";

        this.appHeader.addEventListener("click", this.focusApp);

        if(showName) {
            let appNameDisplay = document.createElement("p")
            appNameDisplay.innerHTML = this.id;
            this.appHeader.appendChild(appNameDisplay);
        }

        this.appHeader.appendChild(this.createWindowMenu(showButtons))

        this.appDiv.appendChild(this.appHeader);
    }

    createWindowMenu(buttons) {
        var windowMenu = document.createElement("table");
        windowMenu.classList.add("app-menu-close");

    if(buttons[0] == "t")
    { // Minimize
        var minImg = document.createElement("img");
        minImg.classList.add("settings-option");
        minImg.addEventListener("mouseup", this.minimizeApp );
        minImg.src = "img/minimize_black_24dp.svg";

        windowMenu.appendChild(minImg);
    }

    if(buttons[1] == "t")
    { // Fullscreen
        var maxImg = document.createElement("img");
        maxImg.classList.add("settings-option");
        maxImg.addEventListener("mouseup", this.maximizeApp );
        maxImg.src = "img/fullscreen_black_24dp.svg";

        windowMenu.appendChild(maxImg);
    }

    if(buttons[2] == "t")
    { // Close
        var closeImg = document.createElement("img");
        closeImg.classList.add("settings-option");
        closeImg.addEventListener("mouseup", this.closeApp );
        closeImg.src = "img/close_black_24dp.svg";

        windowMenu.appendChild(closeImg);
    }



        return windowMenu
    }

    focusApp() {
        if(!this.focused) {
            console.log(this);
            this.focused = FocusApp(this);
            this.appDiv.classList.add("window-App-On-Top");
        }
    }

    unfocusApp() {
        this.focused = false;
        this.appDiv.blur();
        this.appDiv.classList.remove("window-App-On-Top");
        console.log(this.id, "unfocused");
    }

    createIcon(iconPath) {
        this.icon = document.createElement("img");
        this.small_icon = document.createElement("img");

        this.icon.src = iconPath;
        this.icon.classList.add("icon");

        this.small_icon.src = iconPath;
        this.small_icon.classList.add("small-icon");

        //onmouseover="changeHoverMenu('Chrome <br> <b>Exit: Ctrl+W</b>', 'open')" onmouseleave="changeHoverMenu('', 'close')"

        this.icon.addEventListener("click", this.openApp)
        this.small_icon.addEventListener("click", this.openApp)
    }

    InstallApp() {
        if(this.installed) {
            console.error(this.appDiv.id, "is already installed!")
            return;
        }
        if(!this.icon) {
            console.error(this.appDiv.id, "cannot be installed: No icon error!");
            return;
        }
        document.getElementById("Apps-Container").appendChild(this.icon);
        this.addDesktopMenuIcon();
        registerApp(this);
        this.installed = true;
    }

    addDesktopMenuIcon() {
        document.getElementById("desktopMenu-Center").appendChild(this.small_icon);
    }

    EnableDragging() {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (this.appHeader) {
            this.appHeader.onmousedown = dragMouseDown;
            this.appHeader.addEventListener('touchstart', dragMouseDown, { passive: false });
        }

        let elmnt = this.appDiv;
        let parent = this;
        let l = "t";
        function dragMouseDown(e) {
            parent.focusApp();
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            document.addEventListener('touchmove', elementDrag, { passive: false });
            document.addEventListener('touchend', closeDragElement);
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - (e.touches ? e.touches[0].clientX : e.clientX);
            pos2 = pos4 - (e.touches ? e.touches[0].clientY : e.clientY);
            pos3 = e.touches ? e.touches[0].clientX : e.clientX;
            pos4 = e.touches ? e.touches[0].clientY : e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            document.removeEventListener('touchmove', elementDrag);
            document.removeEventListener('touchend', closeDragElement);
        }
    }
}