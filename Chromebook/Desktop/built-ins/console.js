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

        this.createHeader("fft", true);
        this.appHeader.style.background = "white";

        this.shell = new Tokenizer();
        this.initalizeConsole();

        this.initalizeConsole = this.initalizeConsole.bind(this)

        this.createIcon("img/terminal_35dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.png");
    }

    initalizeConsole() {
        let dev_text = document.createElement("div");
        dev_text.classList.add("dev-text-container")

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

        this.appDiv.appendChild(dev_text);
        this.appDiv.appendChild(input_div);
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
    _var_decl:       "var_decl",
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

class Tokenizer {
    constructor() {}

    runCommand(text_command) {
        let tokens = this.tokenize(text_command);
        if(tokens == {}) return;
        console.log(tokens);

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


            if(isWhitespace(text_command))
                continue;

            let error_fmt = "";
            for(let t = 0; t < text_command.length; t++) { 
                if(t == c)
                    error_fmt += "\x1B[4m\`";
                error_fmt += text_command[t]
                if(t == c)
                    error_fmt += "\`\x1B[0m";
            }
            
            console.error(`Unexpected Syntax: ${text_command[c]} in ${error_fmt}`);
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
                        console.error(`Syntax Error after \`${tokens[t].token_type}\` \n\texpected: \`()\``);
                    else
                        console.info("Should Exit");
                    break
                case TokenType._var_decl:
                    if(tokens[t+1].token_type != TokenType._ident || tokens[t+1] == undefined)
                        console.error(`Syntax Error after \`@\` \n\texpected a variable identifier`);
                    else
                        console.info(`Variable declared \`${tokens[++t].value}\``);
                    break;
                case TokenType._ident:
                    if(tokens[t+1] == undefined || tokens[t+1].token_type != TokenType._open_paren)
                        console.error(`Syntax Error after \`${tokens[t].value}\` \n\texpexted: \`(\``)
                    else
                    {
                        console.info(`Called Function: ${tokens[t].value}`);
                        t+= 2; //Consume the parens since I haven't implement checking for args
                    }
                    break;
                default:
                    console.error("Unexpected Syntax!");
            }

        }
    }

}