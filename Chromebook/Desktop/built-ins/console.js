import { BaseApp } from "./app.js";

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
        this.dev_text;

        this.createHeader("fft", true);
        this.appHeader.style.background = "white";

        this.shell = new Tokenizer();
        this.initalizeConsole();

        this.initalizeConsole = this.initalizeConsole.bind(this)

        console.log = this._log.bind(this);
        console.info = this._info.bind(this);
        console.warn = this._warn.bind(this);
        console.error = this._error.bind(this);

        this.createIcon("img/terminal_35dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png");
    }

    initalizeConsole() {
        this.dev_text = document.createElement("div");
        this.dev_text.classList.add("dev-text-container")

        let input_div = document.createElement("form");
        input_div.classList.add("dev-input-container")

        let dev_input = document.createElement("input");
        dev_input.type = "text"
        dev_input.placeholder = "Enter Command";
        dev_input.style.outline = "None";
        dev_input.style.caretColor = "White";

        input_div.submit(function(e) {
            e.preventDefault()
        });
        
        input_div.addEventListener("submit", (e) => { 
            e.preventDefault();
            this.shell.runCommand(dev_input.value); 
            dev_input.value = "";
        });

        let clear_btn = document.createElement("h3");
        clear_btn.innerText = "Clear";

        clear_btn.addEventListener("onclick", ()=>{ dev_text.innerHTML = ""; });

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
        var log = document.createElement("span");
        log.classList.add("log");
        log.innerText = "System Log: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        _Log.apply(console, args);
    }

    _info(...args) {
        var log = document.createElement("span");
        log.classList.add("info");
        log.innerText = "System Info: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        _Info.apply(console, args);
    }

    _warn(...args) {
        var log = document.createElement("span");
        log.classList.add("warn");
        log.innerText = "System Warn: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        _Warn.apply(console, args);
    }

    _error(...args) {
        var log = document.createElement("span");
        log.classList.add("error");
        log.innerText = "System Error: " + args.toString().replace(/,/g, " ");

        this.dev_text.appendChild(log);
        this.dev_text.appendChild(document.createElement("br"));

        _Error.apply(console, args);
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
    _exit:          "exit",
    _ident:         "identifier",
    _open_paren:    "open_paren",
    _close_paren:   "close_paren",
    _value:         "value",
    _separator:     "separator",
    _equals:        "equals",
    _var_decl:      "var_decl",
    _semi_colon:    "semi_colon"
};

function isAlpha(char)
{
    return /[a-zA-Z]/.test(char) && char != undefined;
}

function isNumeric(char)
{
    return (/[0-9]/.test(char) || char == ".") && char != undefined;
}

function isWhitespace(char) {
  return /\s/.test(char) && char != undefined;
}

class Token
{
    constructor(token_type, value)
    {
        this.token_type = token_type;
        this.value = value;
    }
}

class NodeVar {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class Tokenizer {
    constructor() {
        this.m_variables = []
    }

    runCommand(text_command) {
        console.info(`Entered Command: ${text_command}`);
        let tokens = this.tokenize(text_command);
        if(tokens == {}) return;

        this.parseTokens(tokens);
    }

    tokenize(text_command) {
        let tokens = []
        for(let c = 0; c < text_command.length; c++) {
            if(isAlpha(text_command[c])) {
                let name = text_command[c];
                while(isAlpha(text_command[c+1])) {
                    if(isAlpha(text_command[c+1]))
                        name += text_command[++c];
                }
                
                if(name == "exit")
                    tokens.push(new Token(TokenType._exit, name));
                else
                    tokens.push(new Token(TokenType._ident, name));

                continue;
            }

            if(isNumeric(text_command[c])) {
                let value = text_command[c];
                while(isNumeric(text_command[c+1])) {
                    if(isNumeric(text_command[c+1]))
                        value += text_command[++c];
                }
                
                tokens.push(new Token(TokenType._value, value));
                continue;
            }

            if(text_command[c] == "(") {
                tokens.push(new Token(TokenType._open_paren, ""));
                continue;
            }
            if(text_command[c] == ")") {
                tokens.push(new Token(TokenType._close_paren, ""));
                continue;
            }
            if(text_command[c] == ",") {
                tokens.push(new Token(TokenType._separator, ""));
                continue;
            }
            if(text_command[c] == "=") {
                tokens.push(new Token(TokenType._equals, ""))
                continue;
            }
            if(text_command[c] == "@") {
                tokens.push(new Token(TokenType._var_decl, ""));
                continue;
            }
            if(text_command[c] == ";") {
                tokens.push(new Token(TokenType._semi_colon, ""));
                continue;
            }


            if(isWhitespace(text_command))
                continue;
            
            console.error(`Syntax Error: got ${text_command[c]} in \`${text_command}\``);
            return {};
        }

        return tokens;
    }

    parseTokens(tokens) {
        for(let t = 0; t < tokens.length; t++) {
            switch(tokens[t].token_type) {
                case TokenType._exit:
                    if( (tokens[t+1] == undefined && tokens[t+2] == undefined) ||
                        tokens[++t].token_type != TokenType._open_paren ||
                        tokens[++t].token_type != TokenType._close_paren)
                        console.error(`Syntax Error after \`${tokens[t].token_type}\` \n\tExpected: \`()\``);
                    else
                        console.info("Should Exit");
                    break
                case TokenType._var_decl:
                    if(tokens[t+1].token_type != TokenType._ident || tokens[t+1] == undefined)
                        console.error(`Syntax Error after \`@\` \n\texpected a variable identifier`);
                    else {
                        if(tokens[++t].value in this.m_variables && 
                            (tokens[t+1] != undefined && tokens[t+1].token_type == TokenType._semi_colon)) {
                                let var_name = tokens[t].value;
                                console.log(this.m_variables[var_name]);
                        } else if(tokens[t+1] != undefined && tokens[t+1].token_type == TokenType._equals) {
                            let name = tokens[t].value; // store name and consume
                            if(tokens[t+1] == undefined || tokens[t+1].token_type != TokenType._equals) {
                                console.error(`Syntax Error after \`${name}\` \n\texpected an \`=\``);
                                return;
                            }
                            t++; // Consume the Identifier
                            if(tokens[t+1] == undefined || tokens[t+1].token_type != TokenType._value)
                            {
                                console.error(`Syntax Error after \`${name}\` \n\texpected a value`);
                                return;
                            }

                            t++; // Consume the Equals

                            let value = tokens[t++].value; // Store number and consume

                            this.m_variables[name] = value;

                            if(tokens[t] == undefined || tokens[t].token_type != TokenType._semi_colon) {
                                console.error(`Syntax Error: Expected a \`;\``);
                            }
                        } else if(tokens[t+1] == undefined) {
                            console.error(`Syntax Error: Expected a \`;\``);
                        } else {
                            console.error(`Undefined Variable: \`${tokens[t].value}\``)
                        }
                    }
                        t++;
                    break;
                case TokenType._ident:
                    var func_name = tokens[t].value;
                    if(tokens[t+1] == undefined || tokens[t+1].token_type != TokenType._open_paren)
                        console.error(`Syntax Error after \`${tokens[t].value}\` \n\tExpected: \`(\``)
                    else
                    {
                        t++; // Consume Open Parenthese
                        let args = []
                        while(true) {
                            if(tokens[t+1].token_type == TokenType._ident) {
                                let var_name = tokens[++t].value;
                                if(this.m_variables[var_name] == undefined) {
                                    console.error(`Undefined Variable: \`${var_name}\``);
                                } else {
                                    args.push(this.m_variables[var_name]);
                                }
                            }
                            else if(tokens[t+1].token_type == TokenType._value)
                                args.push(tokens[++t].value);
                            else if(tokens[t+1].token_type == TokenType._separator)
                                t++;
                            else if(tokens[t+1].token_type == TokenType._close_paren || tokens[t+1] == undefined)
                                break;
                        }
                        t+=2; // Consume Last Args & Closing parenthese
                        if(tokens[t]== undefined || tokens[t].token_type != TokenType._semi_colon){
                            console.error(`Syntax Error: Expected a \`;\``);
                            return;
                        }
                        t++; // Consume Semicolon
                        console.log(func_name, args);
                    }
                    break;
                default:
                    console.error("Syntax Error!");
            }

        }
    }

}