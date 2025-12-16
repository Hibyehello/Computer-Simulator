import {BaseApp} from "./app.js";

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

        this.shell = new Tokenizer();
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

        input_div.submit(function (e) {
            e.preventDefault()
        });

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

const TokenType =
    {
        _exit: "exit",
        _ident: "identifier",
        _open_paren: "open_paren",
        _close_paren: "close_paren",
        _data: "value",
        _separator: "separator",
        _equals: "equals",
        _var_decl: "var_decl",
    };

function isAlpha(char) {
    return /[a-zA-Z._]/.test(char) && char !== undefined;
}

function isNumeric(char) {
    return (/[0-9]/.test(char) || char === ".") && char !== undefined;
}

function isWhitespace(char) {
    return /\s/.test(char) && char !== undefined;
}

class Token {
    constructor(token_type, value) {
        this.token_type = token_type;
        this.value = value;
    }
}

class Tokenizer {
    constructor() {
        this.m_variables = []
        this.m_functions = []
    }

    callBuiltinFunc(func, args) {
        if (builtinFunctions.includes(func))
            window[func](args);
        else
            console.error("Unknown Function called `" + func + "`");
    }

    callCustomFunc(func, args) {
        // TODO Implement custom functions
        console.info("Custom functions not implemented!");
    }

    runCommand(text_command) {
        let tokens = this.tokenize(text_command);
        if (tokens === {}) return;

        this.parseTokens(tokens);
    }

    tokenize(text_command) {
        let tokens = []
        for (let c = 0; c < text_command.length; c++) {
            if (isAlpha(text_command[c])) {
                let name = text_command[c];
                while (isAlpha(text_command[c + 1])) {
                    if (isAlpha(text_command[c + 1]))
                        name += text_command[++c];
                }

                if (name === "exit")
                    tokens.push(new Token(TokenType._exit, name));
                else
                    tokens.push(new Token(TokenType._ident, name));

                continue;
            }

            if (isNumeric(text_command[c])) {
                let value = text_command[c];
                while (isNumeric(text_command[c + 1])) {
                    if (isNumeric(text_command[c + 1]))
                        value += text_command[++c];
                }

                tokens.push(new Token(TokenType._data, value));
                continue;
            }

            if (text_command[c] === "(") {
                tokens.push(new Token(TokenType._open_paren, ""));
                continue;
            }
            if (text_command[c] === ")") {
                tokens.push(new Token(TokenType._close_paren, ""));
                continue;
            }
            if (text_command[c] === ",") {
                tokens.push(new Token(TokenType._separator, ""));
                continue;
            }
            if (text_command[c] === "=") {
                tokens.push(new Token(TokenType._equals, ""))
                continue;
            }
            if (text_command[c] === "@") {
                tokens.push(new Token(TokenType._var_decl, ""));
                continue;
            }
            if (text_command[c] === "\"") {
                let string_val = ""
                while (isAlpha(text_command[c + 1]) || isNumeric(text_command[c + 1]) || isWhitespace(text_command[c + 1])) {
                    string_val += text_command[++c];
                }
                if (text_command[++c] !== "\"") {
                    console.error("Syntax Error: expected \" but got " + text_command[c]);
                    return {};
                }
                tokens.push(new Token(TokenType._data, string_val));
                continue;
            }

            if (isWhitespace(text_command))
                continue;

            console.error(`Syntax Error: got ${text_command[c]} in \`${text_command}\``);
            return {};
        }

        return tokens;
    }

    parseTokens(tokens) {
        for (let t = 0; t < tokens.length; t++) {
            switch (tokens[t].token_type) {
                case TokenType._exit:
                    if ((tokens[t + 1] === undefined && tokens[t + 2] === undefined) ||
                        tokens[++t].token_type !== TokenType._open_paren ||
                        tokens[++t].token_type !== TokenType._close_paren) {
                        console.error(`Syntax Error after \`${tokens[t].token_type}\` \n\tExpected: \`()\``);
                        return;
                    } else
                        console.info("Should Exit");
                    break
                case TokenType._var_decl:
                    if (tokens[t + 1].token_type !== TokenType._ident || tokens[t + 1] === undefined) {
                        console.error(`Syntax Error after \`@\` \n\texpected a variable identifier`);
                        return;
                    } else {
                        if (tokens[++t].value in this.m_variables) {
                            let var_name = tokens[t].value;
                            console.log(this.m_variables[var_name]);
                        } else if (tokens[t + 1] !== undefined && tokens[t + 1].token_type === TokenType._equals) {
                            let name = tokens[t].value; // store name and consume
                            if (tokens[t + 1] === undefined || tokens[t + 1].token_type !== TokenType._equals) {
                                console.error(`Syntax Error after \`${name}\` \n\texpected an \`=\``);
                                return;
                            }
                            t++; // Consume the Identifier
                            let valid = tokens[t + 1].token_type === TokenType._data;

                            if (tokens[t + 1] === undefined || !valid) {
                                console.error(`Syntax Error after \`${name}\` \n\texpected a value`);
                                return;
                            }

                            t++; // Consume the Equals

                            // Store number and consume
                            this.m_variables[name] = tokens[t++].value;
                        } else {
                            console.error(`Undefined Variable: \`${tokens[t].value}\``)
                            return;
                        }
                    }
                    t++;
                    break;
                case TokenType._ident:
                    let func_name = tokens[t].value;
                    if (tokens[t + 1] === undefined || tokens[t + 1].token_type !== TokenType._open_paren) {
                        console.error(`Syntax Error after \`${tokens[t].value}\` \n\tExpected: \`(\``)
                        return;
                    } else {
                        t++; // Consume open parentheses
                        let args = []
                        while (true) {
                            if (tokens[t + 1].token_type === TokenType._ident) {
                                let var_name = tokens[++t].value;
                                if (this.m_variables[var_name] === undefined) {
                                    console.error(`Undefined Variable: \`${var_name}\``);
                                    return;
                                } else {
                                    args.push(this.m_variables[var_name]);
                                }
                            } else if (tokens[t + 1].token_type === TokenType._data)
                                args.push(tokens[++t].value);
                            else if (tokens[t + 1].token_type === TokenType._separator)
                                t++;
                            else if (tokens[t + 1].token_type === TokenType._close_paren || tokens[t + 1] === undefined)
                                break;
                        }
                        t += 2; // Consume Last Args & Closing parentheses

                        if (func_name in this.m_functions) {
                            this.callCustomFunc(func_name, args);
                        } else {
                            this.callBuiltinFunc(func_name, args);
                        }
                    }
                    break;
                default:
                    console.error("Syntax Error!");
                    return;
            }

        }
    }

}