class Game {
    constructor(time, point, swapTime){
        this.time = time;
        this.point = point;
        this.swapTime = swapTime;
    }
}

class GameBoard {
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.board = new Array(this.row);
        for(let i = 0; i < this.board.length; i++){
            this.board[i] = new Array(this.col);
        }
    }
};

class Piece {
    constructor(id, url){
        this.id = id;
        this.url = url;
        this.current = 0;
        this.count = 2;
    }
};

let previousDiv = null;
let gameBoard;

function startGame(){
    gameBoard = new GameBoard(4, 9);
    document.documentElement.style.setProperty("--column-number", gameBoard.col);

    const piecesList = [];
    for(let i = 1; i <= 18; i++){
        const piece = new Piece(i, `images/pieces${i}.png`);
        piecesList.push(piece);
    }

    generateBoard(gameBoard.board, piecesList);
    let divElements = document.querySelectorAll('[data-cell]');
    divElements.forEach(div => {
        div.removeEventListener("click", handleClick);
        div.addEventListener("click", handleClick);
    });
}

function handleClick(event){
    let currentDiv = event.currentTarget;
    if(previousDiv == null){
        currentDiv.classList.add("selected");
        previousDiv = currentDiv;
    } else if(currentDiv == previousDiv) {
        currentDiv.classList.remove("selected");
        previousDiv = null;
    } else if(currentDiv != previousDiv){
        isConnectable(currentDiv);
    }
}

function isConnectable(currentDiv){
    let currentDivPos = currentDiv.getAttribute("data-cell").split(",").map(el => el = +el);
    let previousDivPos = previousDiv.getAttribute("data-cell").split(",").map(el => el = +el);
    let board = gameBoard.board;
    let currentDivPiece = board[currentDivPos[0]][currentDivPos[1]];
    let previousDivPiece = board[previousDivPos[0]][previousDivPos[1]];
    if(currentDivPiece == previousDivPiece){                                    // So sánh 2 hình giống nhau hay không
        if(currentDivPos[0] == previousDivPos[0]) {                             // Hàng của 2 hình có bằng ko
            if(havePiecesBetween(currentDivPos, previousDivPos, 'row')){
                removePiece(currentDiv, previousDiv, currentDivPos, previousDivPos);
            }
        } else if(currentDivPos[1] == previousDivPos[1]){                       // Cột của 2 hình có bằng không
            if(havePiecesBetween(currentDivPos, previousDivPos, 'column')){     // Khoảng cách giữa 2 hàng
                removePiece(currentDiv, previousDiv, currentDivPos, previousDivPos);
            }
        } else {                                                                // Hàng, cột đều không bằng nhau

        }
    } else {
        previousDiv.classList.remove("selected");
        previousDiv = null;
    }
}

function removePiece(current, previous, currentPos, previousPos){
    let board = gameBoard.board;
    current.style.visibility = "hidden";
    previous.style.visibility = "hidden";
    current.classList.remove("selected");
    previous.classList.remove("selected");
    board[currentPos[0]][currentPos[1]] = undefined;
    board[previousPos[0]][previousPos[1]] = undefined;
    previousDiv = null;
}

function havePiecesBetween(current, previous, line){
    let result = false;
    let board = gameBoard.board;
    switch (line){
        case "row":
            {
                let row = current[0];
                let first = current[1] - previous[1] > 0 ? previous[1] : current[1];
                let last = current[1] - previous[1] > 0 ? current[1] : previous[1];
                let count = 0;
                if(last - first == 1){
                    result = true;
                }
                for(let i = first + 1; i < last; i++){
                    if(board[row][i] == undefined){
                        count++;
                    }
                }
                if(count == (last - first - 1)){
                    result = true;
                }
            }
            break;
        case "column":
            {
                let col = current[1];
                let first = current[0] - previous[0] > 0 ? previous[0] : current[0];
                let last = current[0] - previous[0] > 0 ? current[0] : previous[0];
                let count = 0;
                if(last - first == 1){
                    result = true;
                }
                for(let i = first + 1; i < last; i++){
                    if(board[i][col] == undefined){
                        count++;
                    }
                }
                if(count == (last - first - 1)){
                    result = true;
                }
            }
            break;
    }
    return result;
}

function generateBoard(board, pieceList){
    let boardDisplay = document.getElementById("board");
    let plist = [...pieceList];
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[r].length; c++){
            let piece = plist[randomNumber(plist.length)];
            if(++piece.current == piece.count){
                plist.splice(plist.indexOf(piece), 1);
            }
            let pieceDiv = document.createElement("div");
            pieceDiv.className = "piece";
            pieceDiv.setAttribute("data-cell", [r,c]);
            board[r][c] = piece.id;
            let pieceImage = document.createElement("img");
            pieceImage.src = piece.url;

            pieceDiv.appendChild(pieceImage);
            boardDisplay.appendChild(pieceDiv);
        }
    }
}

function randomNumber(num){
    return Math.floor(Math.random() * num);
}

startGame();