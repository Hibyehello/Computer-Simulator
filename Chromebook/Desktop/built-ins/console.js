import {BaseApp} from "./app.js";
import {Shell} from "./shell.js";

export class devConsole extends BaseApp {
    constructor() {
        super("devConsole-new", "45vh", "40vw");
        this.displayType = "flex"
        this.appDiv.classList.add("window-App");
        this.appDiv.classList.add("resizable-win");
        this.appDiv.style.top = "0";
        this.appDiv.style.flexFlow = "column";
        this.appDiv.style.background = "#000000C8";
        this.appDiv.style.backdropFilter = "blur(5px)";

        this.createHeader("fft", true);
        this.appHeader.style.background = "white";

        this.shell = new Shell();
        this.initializeConsole();

        this.initializeConsole = this.initializeConsole.bind(this);

        console.log = this._log.bind(this);
        console.info = this._info.bind(this);
        console.warn = this._warn.bind(this);
        console.error = this._error.bind(this);

        this.createIcon("img/terminal_35dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png");
    }

    initializeConsole() {
        this.dev_text = document.createElement("div");
        this.dev_text.classList.add("dev-text-container")

        let input_div = document.createElement("form");
        input_div.classList.add("dev-input-container")

        let dev_input = document.createElement("input");
        dev_input.type = "text"
        dev_input.placeholder = "Enter Command";
        dev_input.style.outline = "None";
        dev_input.style.caretColor = "White";

        input_div.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Running Command: ", dev_input.value);
            this.shell.runCommand(dev_input.value);
            dev_input.value = "";
        });

        let clear_btn = document.createElement("h3");
        clear_btn.innerText = "Clear";

        clear_btn.addEventListener("click", () => {
            this.dev_text.innerHTML = "";
        });

        input_div.appendChild(dev_input);
        input_div.appendChild(clear_btn);

        this.appDiv.appendChild(this.dev_text);
        this.appDiv.appendChild(input_div);
    }

    _Log = console.log;
    _Info = console.info;
    _Warn = console.warn;
    _Error = console.error;

    _log(...args) {
        const log = document.createElement("span");
        log.classList.add("log");
        log.innerText = "System Log: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        this._Log.apply(console, args);
    }

    _info(...args) {
        const log = document.createElement("span");
        log.classList.add("info");
        log.innerText = "System Info: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        this._Info.apply(console, args);
    }

    _warn(...args) {
        const log = document.createElement("span");
        log.classList.add("warn");
        log.innerText = "System Warn: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        this._Warn.apply(console, args);
    }

    _error(...args) {
        const log = document.createElement("span");
        log.classList.add("error");
        log.innerText = "System Error: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        this._Error.apply(console, args);
    }
}

//   <div id="devConsole" class="dev-console resizable-win">
//     <div id="devConsole-header" class="app-menu">
//       <p>Dev Console</p>
//       <img class="app-menu-close" src="img/close_black_24dp.svg" onclick="closeApp('devConsole');">
//     </div>
//     <div class="dev-text-container">
//       <p id="devText"><span class="help">--- Type <b><i>@help</i></b> to get help ---</span><br></p>
//     </div>
//     <div class="dev-input-container">
//       <input id="devInput" type="text" onchange="devConsoleInput();">
//       <h3 onclick="devConsoleClear();">Clear</h3>
//     </div>
//   </div>