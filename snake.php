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
    die("数据库连接失败: " . $conn->connect_error);
}

// 取得要顯示排行榜的特定帳號
$targetAccount = $account;

// 执行查询，按分數降序排序
$sql = "SELECT user_account, score, time FROM snake_scores WHERE user_account = '$targetAccount' ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);


// 检查查询结果


$sql2 = "SELECT user_account, score, time FROM snake_scores ORDER BY score DESC LIMIT 5";
$result2 = $conn->query($sql2);

// 检查全體查询结果


// 关闭数据库连接
$conn->close();

// // 引入WebSocket库
// require_once 'path/to/WebSocket.php';

// // 创建WebSocket服务器
// $server = new WebSocket("localhost", 8080);

// // 处理WebSocket连接事件
// $server->on('open', function ($connection) use ($targetAccount) {
//     // 当WebSocket连接建立时，发送初始排行榜数据给客户端
//     $leaderboardData = getLeaderboardData($targetAccount);
//     $connection->send(json_encode($leaderboardData));
// });

// // 处理WebSocket消息事件
// $server->on('message', function ($connection, $message) use ($targetAccount) {
//     // 当接收到客户端发送的消息时，更新排行榜数据并发送给所有客户端
//     $leaderboardData = getLeaderboardData($targetAccount);
//     $connection->broadcast(json_encode($leaderboardData));
// });

// // 启动WebSocket服务器
// $server->start()
    ?>

<!DOCTYPE html>
<html>

<head>
    <title>貪食蛇遊戲</title>
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
            margin-left: 0px;
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
    <h2 id='gamename'>貪食蛇遊戲</h2>
    <div id="mainContainer">
        <div id="gameArea">
            <canvas id="gameCanvas" width="400" height="400"></canvas>
            <div id="score">Score: 0</div>
            <button id="restartButton">Restart</button>
            <div id="gameOver">Game Over</div>
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
        // 獲取遊戲畫布和計分板
        var canvas = document.getElementById("gameCanvas");
        var context = canvas.getContext("2d");
        var scoreElement = document.getElementById("score");
        var gameOverElement = document.getElementById("gameOver");
        // 定義遊戲參數
        var snakeSize = 20;
        var snakeColor = "#000";
        var foodColor = "#f00";
        // 獲取開始遊戲按鈕元素
        var restartButton = document.getElementById("restartButton");
        var gameSpeed = 100;

        // 前端代码中的WebSocket连接和消息处理
        // var socket = new WebSocket('ws://localhost:8080');
        // socket.addEventListener('open', function (event) {
        //     console.log('WebSocket连接已建立');
        // });

        // 綁定按鈕點擊事件處理程序
        restartButton.addEventListener("click", function () {
            restart();
        });

        // 開始遊戲函數
        // 隱藏開始遊戲按鈕

        // 重置遊戲狀態
        isGameOver = false;
        gameOverElement.style.display = "none";
        score = 0;
        scoreElement.innerText = "Score: " + score;
        restartButton.style.display = "none";

        // 初始化貪食蛇位置和方向
        snake = [
            { x: 40, y: 40 },
            { x: 60, y: 40 },
            { x: 80, y: 40 }
        ];
        direction = "right";

        // 初始化食物位置
        food = {
            x: Math.floor(Math.random() * canvas.width / snakeSize) * snakeSize,
            y: Math.floor(Math.random() * canvas.height / snakeSize) * snakeSize
        };

        // 開始遊戲主循環
        gameLoop();

    function restart(){
        location.reload();
    }

        // 繪製貪食蛇和食物
        function draw() {
            // 清除畫布
            context.clearRect(0, 0, canvas.width, canvas.height);

            // 繪製貪食蛇
            for (var i = 0; i < snake.length; i++) {
                context.fillStyle = snakeColor;
                context.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
            }

            // 繪製食物
            context.fillStyle = foodColor;
            context.fillRect(food.x, food.y, snakeSize, snakeSize);
        }

        // 更新遊戲狀態
        function update() {
            if (isGameOver) {
                return;
            }

            // 移動貪食蛇
            var head = { x: snake[0].x, y: snake[0].y };
            if (direction === "right") head.x += snakeSize;
            if (direction === "left") head.x -= snakeSize;
            if (direction === "up") head.y -= snakeSize;
            if (direction === "down") head.y += snakeSize;

            // 檢查是否撞牆
            if (
                head.x < 0 ||
                head.y < 0 ||
                head.x >= canvas.width ||
                head.y >= canvas.height
            ) {
                gameOver();
                return;
            }

            if (snake.length > 3) {
                for (var i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        // 蛇咬到自己，遊戲結束
                        gameOver();
                        return;
                    }
                }
            }

            snake.unshift(head);

            // 檢查是否吃到食物
            if (head.x === food.x && head.y === food.y) {
                // 生成新的食物位置
                food.x = Math.floor(Math.random() * canvas.width / snakeSize) * snakeSize;
                food.y = Math.floor(Math.random() * canvas.height / snakeSize) * snakeSize;
                // 更新分數
                score += 10;
                scoreElement.innerText = "Score: " + score;
            } else {
                // 移除貪食蛇尾部
                snake.pop();
            }
            setTimeout(gameLoop, gameSpeed);
        }

        // 監聽鍵盤事件
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 37 && direction !== "right") direction = "left";
            if (event.keyCode === 38 && direction !== "down") direction = "up";
            if (event.keyCode === 39 && direction !== "left") direction = "right";
            if (event.keyCode === 40 && direction !== "up") direction = "down";
        });

        // 結束遊戲
        // 當遊戲結束時，將分數傳送到後端 PHP 腳本處理
        function gameOver() {
            isGameOver = true;
            gameOverElement.style.display = "block";
            restartButton.style.display = "block";

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "save_score.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log("分數已儲存到資料庫");
                }
            };
            xhr.send("score=" + score);
        }

        // 遊戲主循環
        function gameLoop() {
            draw();
            update();
            
        }

        // 初始化遊戲
        var food = {
            x: Math.floor(Math.random() * canvas.width / snakeSize) * snakeSize,
            y: Math.floor(Math.random() * canvas.height / snakeSize) * snakeSize
        };
        // gameLoop();
    </script>
</body>

</html>