<?php
session_start();
$account = $_SESSION["account"]; // 請確保使用的 session 鍵與你在 index.php 中存入的鍵相同
if (!isset($_SESSION['account'])) {
    // 使用者尚未登入，重新導向回 index.php
    header("Location: index.php");
    exit;
}

$servername = "localhost";
$username = "root";
$password = "542b431a";
$dbname = "final_project";

// 创建数据库连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接是否成功
if ($conn->connect_error) {
    die("資料庫連接失敗: " . $conn->connect_error);
}

// 取得要顯示排行榜的特定帳號
$targetAccount = $account;

// 执行查询，按分數降序排序
$sql = "SELECT user_account, score, time FROM minesweeper_scores WHERE user_account = '$targetAccount' ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);


// 检查查询结果


$sql2 = "SELECT user_account, score, time FROM minesweeper_scores ORDER BY score DESC LIMIT 5";
$result2 = $conn->query($sql2);

// 检查全體查询结果


// 关闭数据库连接
$conn->close();
    ?>

<!DOCTYPE html>
<html>

<head>
    <title>Minesweeper</title>
    <style>
        /* 外部 CSS 樣式表或內部 <style> 標籤中的 CSS 樣式 */
        body {
            font-family: Arial, sans-serif;
        }

        #gameCanvas {
            border: 1px solid #000;
            margin-bottom: 10px;
        }

        #score {
            margin-bottom: 10px;
        }

        #gameOver {
            display: none;
            text-align: center;
            font-size: 24px;
            margin-bottom: 10px;
            margin-left: auto;
            /* 將左邊距設置為自動 */
        }

        #account {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            max-width: 500px;
        }

        th,
        td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        tr:hover {
            background-color: #f5f5f5;
        }

        th {
            background-color: #4CAF50;
            color: white;
        }

        #mainContainer {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #gameArea {
            margin: 0 auto;
            flex: 0.8;
            margin-left: 50px;
        }

        #Leaderboard {
            flex: 1.3;
            margin-left: 50px;
            margin-top: -100px;
        }

        #account {
            margin-bottom: 10px;
            margin-left: 50px;
            /* 新增的左邊距 */
        }

        #gamename {
            margin-bottom: 10px;
            margin-left: 50px;
            /* 新增的左邊距 */
        }

        #mainContainer {
            /* margin-bottom: 10px; */
            margin-left: 50px;
            /* 新增的左邊距 */
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(10, 40px);
            gap: 2px;
            /* margin-top: -300px; */
        }

        .cell {
            width: 40px;
            height: 40px;
            background-color: #ccc;
            text-align: center;
            line-height: 40px;
            font-size: 20px;
            cursor: pointer;
        }

        .revealed {
            background-color: lightpink;
        }

        .flagged {
            background-color: #f00;
            color: #fff;
        }

        #restartButton {
            margin: 10px auto 0;
            display: block; 
        }
        #score {
            margin-bottom: 10px;
        }
        #backToMenu {
            margin-left: 50px;
        }
    </style>
</head>

<body>
    <div id="account">
        Username:
        <?php echo $_SESSION['account']; ?> <a href="logout.php">登出</a>
        <a id= backToMenu , href="menu.php">回主選單</a>
    </div>
    <h2 id='gamename'>Minesweeper</h2>
    <div id="mainContainer">
        <div>
            <div class="grid">
            </div>
            <button id="restartButton">Restart</button>
        </div>
        <div id="Leaderboard">
            <h2>
                <?php echo $targetAccount; ?> 的排行榜
            </h2>
            <table id="targetLeaderboard">
                <tr>
                    <th>帳號</th>
                    <th>分數</th>
                    <th>時間</th>
                </tr>
                <?php
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $row['user_account'] . "</td>";
                    echo "<td>" . $row['score'] . "</td>";
                    echo "<td>" . $row['time'] . "</td>";
                    echo "</tr>";
                }
                ?>
            </table>

            <h2>全體排行榜</h2>
            <table id="globalLeaderboard">
                <tr>
                    <th>帳號</th>
                    <th>分數</th>
                    <th>時間</th>
                </tr>
                <?php
                while ($row2 = $result2->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $row2['user_account'] . "</td>";
                    echo "<td>" . $row2['score'] . "</td>";
                    echo "<td>" . $row2['time'] . "</td>";
                    echo "</tr>";
                }
                ?>
            </table>
        </div>
    </div>

    <script>
        // Define constants for the grid size and number of mines
        const gridSize = 10;
        const numMines = 20;

        let grid = [];
        let mines = [];
        let revealedCells = 0;
        let gameOver = false; // Game over flag
        let score = 0;

        // Create the grid
        const gridContainer = document.querySelector('.grid');
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                cell.addEventListener('contextmenu', handleCellContextMenu);
                gridContainer.appendChild(cell);
                grid[i][j] = { isMine: false, isRevealed: false, isFlagged: false, element: cell };
            }
        }

        // Generate random mine positions
        while (mines.length < numMines) {
            const randomRow = Math.floor(Math.random() * gridSize);
            const randomCol = Math.floor(Math.random() * gridSize);
            if (!grid[randomRow][randomCol].isMine) {
                grid[randomRow][randomCol].isMine = true;
                mines.push(grid[randomRow][randomCol]);
            }
        }

        
        let clickCount = 0; // 追蹤點擊次數
        const maxScore = 1000; // 最大分數
        const minIncrement = 3; // 每次點擊的最小增量
        const maxIncrement = 30; // 每次點擊的最大增量

        function handleCellClick(event) {
            if (gameOver) {
                return;
            }

            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            const cell = grid[row][col];

            if (cell.isRevealed) {
                return;
            }

            if (event.button === 0) { // Left-click
                if (event.shiftKey) { // Shift + left-click to reveal neighbors
                    revealNeighbors(row, col);
                } else { // Single left-click to reveal cell
                    if (cell.isMine) {
                        revealMines();
                        lockGame();
                        alert('Oops! You stepped on a mine.');
                    } else {
                        revealCell(cell);
                        clickCount++;
                        const increment = calculateScoreIncrement(clickCount);
                        score += increment;
                        if (revealedCells === gridSize * gridSize - numMines) {
                            revealMines();
                            lockGame();
                            alert('Congratulations! You won the game.');
                        }
                        document.getElementById('scoreValue').textContent = score;
                    }
                }
            }
        }

        
        function handleCellContextMenu(event) {
            event.preventDefault();

            if (gameOver) {
                return;
            }

            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            const cell = grid[row][col];

            if (!cell.isRevealed) {
                cell.isFlagged = !cell.isFlagged;
                cell.element.classList.toggle('flagged');
            }
        }

        function calculateScoreIncrement(clickCount) {
            // 使用一個非線性的函式來計算分數增量
            const incrementRange = maxIncrement - minIncrement;
            const incrementFactor = 1 - (clickCount / 100); // 增量因子，根據點擊次數線性遞減
            const increment = minIncrement + (incrementRange * incrementFactor);
            return Math.round(increment);
        }

        function lockGame() {
            gameOver = true;
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    grid[i][j].element.removeEventListener('click', handleCellClick);
                    grid[i][j].element.removeEventListener('contextmenu', handleCellContextMenu);
                }
            }
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "save_score_forminesweeper.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log("分數已儲存到資料庫");
                }
            };
            xhr.send("score=" + score);

        }


        function restartGame() {
            location.reload(); // Reload the page to restart the game
        }

        function revealCell(cell) {
            if (cell.isRevealed) {
                return;
            }
            cell.isRevealed = true;
            revealedCells++;
            cell.element.classList.add('revealed');

            if (!cell.isMine) {
                const row = parseInt(cell.element.dataset.row);
                const col = parseInt(cell.element.dataset.col);
                const neighborMines = countNeighborMines(row, col);
                if (neighborMines > 0) {
                    cell.element.textContent = neighborMines;
                } else {
                    revealNeighbors(row, col);
                }
            }
        }
        function revealNeighbors(row, col) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        const neighborCell = grid[newRow][newCol];
                        if (!neighborCell.isRevealed) {
                            revealCell(neighborCell);
                        }
                    }
                }
            }
        }

        function countNeighborMines(row, col) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        if (grid[newRow][newCol].isMine) {
                            count++;
                        }
                    }
                }
            }
            return count;
        }

        function revealMines() {
            for (const mine of mines) {
                mine.element.classList.add('mine');
                mine.element.textContent = 'X';
            }
        }

        document.getElementById('restartButton').addEventListener('click', restartGame);

    </script>
</body>

</html>