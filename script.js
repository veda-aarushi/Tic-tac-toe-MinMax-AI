const board = document.getElementById("board");
const status = document.querySelector(".status");
let gameBoard = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";

function renderBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        if (cell) cellDiv.classList.add("taken");
        cellDiv.innerText = cell;
        cellDiv.addEventListener("click", () => makeMove(index));
        board.appendChild(cellDiv);
    });
}

function makeMove(index) {
    if (gameBoard[index] === "" && !checkWinner()) {
        gameBoard[index] = human;
        renderBoard();
        if (!checkWinner() && gameBoard.includes("")) {
            setTimeout(aiMove, 500);
        }
    }
}

function aiMove() {
    let bestMove = minimax(gameBoard, ai).index;
    gameBoard[bestMove] = ai;
    renderBoard();
    checkWinner();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            status.innerText = `${gameBoard[a]} wins!`;
            return true;
        }
    }
    if (!gameBoard.includes("")) {
        status.innerText = "It's a tie!";
        return true;
    }
    status.innerText = "Your turn!";
    return false;
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);
    if (checkWin(newBoard, human)) return { score: -10 };
    if (checkWin(newBoard, ai)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i of availableSpots) {
        let move = { index: i };
        newBoard[i] = player;
        move.score = minimax(newBoard, player === ai ? human : ai).score;
        newBoard[i] = "";
        moves.push(move);
    }

    return moves.reduce((best, move) => {
        if ((player === ai && move.score > best.score) || (player === human && move.score < best.score)) {
            return move;
        }
        return best;
    }, { score: player === ai ? -Infinity : Infinity });
}

function checkWin(board, player) {
    return [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ].some(pattern => pattern.every(i => board[i] === player));
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    status.innerText = "Your turn!";
    renderBoard();
}

renderBoard();