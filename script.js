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
        this.board = new Array(this.row + 2);
        for(let i = 0; i < this.board.length; i++){
            this.board[i] = new Array(this.col + 2);
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
const UP = [-1, 0];
const RIGHT = [0, 1];
const DOWN = [1, 0];
const LEFT = [0, -1];
let divElements;
function startGame(){
    gameBoard = new GameBoard(6, 9);
    document.documentElement.style.setProperty("--column-number", gameBoard.col);

    const piecesList = [];
    for(let i = 1; i <= 27; i++){
        const piece = new Piece(i, `images/pieces${i}.png`);
        piecesList.push(piece);
    }

    generateBoard(gameBoard.board, piecesList);
    divElements = document.querySelectorAll('[data-cell]');
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
        let board = gameBoard.board;
        let currentPos = currentDiv.getAttribute("data-cell").split(",").map(el => el = +el);
        let previousPos = previousDiv.getAttribute("data-cell").split(",").map(el => el = +el);
        if(board[currentPos[0]][currentPos[1]] != board[previousPos[0]][previousPos[1]]){
            previousDiv.classList.remove("selected");
            previousDiv = null;
        } else {
            let direction = [];
            let distanceRow = currentPos[0] - previousPos[0];
            let distanceCol = currentPos[1] - previousPos[1];
            if(distanceRow > 0 && distanceCol > 0) direction = [UP, LEFT, DOWN];
            else if(distanceRow > 0 && distanceCol < 0) direction = [UP, RIGHT, DOWN];
            else if(distanceRow > 0 && distanceCol == 0) direction = [UP, LEFT, RIGHT];
            else if(distanceRow < 0 && distanceCol > 0) direction = [DOWN, LEFT, UP];
            else if(distanceRow < 0 && distanceCol < 0) direction = [DOWN, RIGHT, UP];
            else if(distanceRow < 0 && distanceCol == 0) direction = [DOWN, LEFT, RIGHT];
            else if(distanceRow == 0 && distanceCol > 0) direction = [LEFT, UP, DOWN];
            else if(distanceRow == 0 && distanceCol < 0) direction = [RIGHT, UP, DOWN];
            let path = [];
            depthFirstSearch(currentPos, previousPos, direction, path);
            if(loopBreak){
                removePiece(currentDiv, previousDiv, currentPos, previousPos);
            } else {
                previousDiv.classList.remove("selected");
                previousDiv = null;
            }
        }
    }
}

let loopBreak = false;
function depthFirstSearch(start, target, direct, path, visited = new Set()){
    path.push(start);
    if(start[0] == target[0]){
        if(start[1] == target[1] || Math.abs(start[1] - target[1]) == 1){
            loopBreak = true;
            console.log(`Target: ${target}`);
            console.log(path);
            return;
        } else {
            loopBreak = false;
        }
    } else if(start[1] == target[1]){ 
        if(start[0] == target[0] || Math.abs(start[0] - target[0]) == 1){
            loopBreak = true;
            console.log(`Target: ${target}`);
            console.log(path);
            return;
        } else {
            loopBreak = false;
        }
    } else if (Math.abs(start[0] - target[0]) == 1){
        if(start[1] == target[1]){
            loopBreak = true;
            console.log(`Target: ${target}`);
            console.log(path);
            return;
        } else {
            loopBreak = false;
        }
    } else if (Math.abs(start[1] - target[1]) == 1){
        if(start[0] == target[0]){
            loopBreak = true;
            console.log(`Target: ${target}`);
            console.log(path);
            return;
        } else {
            loopBreak = false;
        }
     } else {
        loopBreak = false;
        if(visited.length == gameBoard.board.length * gameBoard.board[0].length) {
            loopBreak = false;
            return;
        }
    }

    visited.add(start.join(""));

    let r = start[0];
    let c = start[1];

    for(let i = 0, turn = 0; i < direct.length, turn < 3; i++, turn++){
        let adjR = r + direct[i][0];
        let adjC = c + direct[i][1];
        let adjacent = [adjR, adjC];
        if(loopBreak) return;
        if(isValid(adjacent, visited)) {
            console.log(`Turn: ${turn}`)
            depthFirstSearch(adjacent, target, direct, path, visited);
        }
    }
}

function isValid(pos, visited) {
    let result = true;
    let board = gameBoard.board;

    if(pos[0] < 0 || pos[0] >= gameBoard.board.length 
        || pos[1] < 0 || pos[1] >= gameBoard.board[0].length) result = false;
    else if(visited.has(pos.join(""))) result = false;
    else if(board[pos[0]][pos[1]] != undefined) result = false;
    
    return result;
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

function generateBoard(board, pieceList){
    let boardDisplay = document.getElementById("board");
    let plist = [...pieceList];
    for(let r = 1; r < board.length-1; r++){
        for(let c = 1; c < board[r].length-1; c++){
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