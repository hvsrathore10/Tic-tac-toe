let playerName = '';
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
const clickSound = document.getElementById('click-sound');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const gameContainer = document.getElementById('game');

function startGame() {
    playerName = document.getElementById('player-name').value;
    if (playerName) {
        gameContainer.classList.remove('hidden');
        updateStatus();
    } else {
        alert('Please enter your name to start the game!');
    }
}

function handleClick(index) {
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    clickSound.play();

    if (checkWin()) {
        statusDisplay.textContent = currentPlayer === 'X' ? `${playerName} Wins!` : 'Bot Wins!';
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    if (currentPlayer === 'O') {
        setTimeout(botMove, 500); // Add a delay for a more natural bot response
    }
}

function botMove() {
    const bestMoveIndex = minimax(board, true).index;
    board[bestMoveIndex] = 'O';
    cells[bestMoveIndex].textContent = 'O';

    if (checkWin()) {
        statusDisplay.textContent = 'Bot Wins!';
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    updateStatus();
}

function minimax(newBoard, isBot) {
    const availSpots = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWinner(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinner(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = isBot ? 'O' : 'X';

        const result = minimax(newBoard, !isBot);
        move.score = result.score;

        newBoard[availSpots[i]] = '';

        moves.push(move);
    }

    let bestMove;
    if (isBot) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function updateStatus() {
    statusDisplay.textContent = currentPlayer === 'X' ? `${playerName}'s turn` : "Bot's turn";
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => (cell.textContent = ''));
    updateStatus();
}

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winConditions.some(condition => {
        return board[condition[0]] &&
               board[condition[0]] === board[condition[1]] &&
               board[condition[0]] === board[condition[2]];
    });
}

function checkWinner(newBoard, player) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winConditions.some(condition => {
        return newBoard[condition[0]] === player &&
               newBoard[condition[0]] === newBoard[condition[1]] &&
               newBoard[condition[0]] === newBoard[condition[2]];
    });
}

function toggleTheme() {
    document.body.classList.toggle('light');
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.textContent = document.body.classList.contains('light') ? 'Switch to Dark Theme' : 'Switch to Light Theme';
}
