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

function startGame(){
    let gameBoard = new GameBoard(4, 9);
    document.documentElement.style.setProperty("--column-number", gameBoard.col);

    const piecesList = [];
    for(let i = 1; i <= 18; i++){
        const piece = new Piece(i, `images/pieces${i}.png`);
        piecesList.push(piece);
    }

    generateBoard(gameBoard.board, piecesList);
    let divElements = document.querySelectorAll('[data-cell]');
    divElements.forEach(div => {
        div.addEventListener("click", handleClick, {one: true});
    });
}

function handleClick(){

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