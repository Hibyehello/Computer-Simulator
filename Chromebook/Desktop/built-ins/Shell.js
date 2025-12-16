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

export class Shell {
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

    callCustomFunc(_func, _args) {
        // TODO Implement custom functions
        console.warn("Custom functions not implemented! Not sure how you go here");
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