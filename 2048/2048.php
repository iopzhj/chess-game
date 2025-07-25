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

$conn = new mysqli($servername, $username, $password, $dbname);

// 取得要顯示排行榜的特定帳號
$targetAccount = $account;

// 执行查询，按分數降序排序
$sql = "SELECT user_account, score, time FROM e2048_scores WHERE user_account = '$targetAccount' ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);


// 检查查询结果


$sql2 = "SELECT user_account, score, time FROM e2048_scores ORDER BY score DESC LIMIT 5";
$result2 = $conn->query($sql2);

// 检查全體查询结果


// 关闭数据库连接
$conn->close();
// $servername = "localhost";
// $username = "root";
// $password = "542b431a";
// $dbname = "final_project";

// // 创建数据库连接
// $conn = new mysqli($servername, $username, $password, $dbname);

// // 检查连接是否成功
// if ($conn->connect_error) {
//     die("数据库连接失败: " . $conn->connect_error);
// }

// // 取得要顯示排行榜的特定帳號
// $targetAccount = $account;

// // 执行查询，按分數降序排序
// $sql = "SELECT user_account, score, time FROM snake_scores WHERE user_account = '$targetAccount' ORDER BY score DESC LIMIT 5";
// $result = $conn->query($sql);


// // 检查查询结果


// $sql2 = "SELECT user_account, score, time FROM snake_scores ORDER BY score DESC LIMIT 5";
// $result2 = $conn->query($sql2);

// // 检查全體查询结果


// // 关闭数据库连接
// $conn->close();

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
            margin-left: 50px;
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
        #gamehead {
            margin-left: -300px;
            /* 新增的左邊距 */
        }
        
    </style>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>

    <title>2048</title>
    <link rel="stylesheet" type="text/css" href="HC2048.css"/>
    <!--<script src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.3.min.js"></script>-->
    <script type="text/javascript" src="jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="2048Animation.js"></script>
    <script type="text/javascript" src="support.js"></script>
    <script type="text/javascript" src="2048.js"></script>
    <script >

        
    </script>

</head>
<body>
    <header id=gamehead>
        <h2>2048 (by HC)</h2>
        <a href="javascript:reload()"; id="newgamebutton">New Game</a>
        <p>score : <span id="score">0</span></p>
    </header id=gamehead>
    <div id="mainContainer">
        <div id="grid-container">
            <div class="grid-cell" id="grid-cell-0-0"></div>
            <div class="grid-cell" id="grid-cell-0-1"></div>
            <div class="grid-cell" id="grid-cell-0-2"></div>
            <div class="grid-cell" id="grid-cell-0-3"></div>

            <div class="grid-cell" id="grid-cell-1-0"></div>
            <div class="grid-cell" id="grid-cell-1-1"></div>
            <div class="grid-cell" id="grid-cell-1-2"></div>
            <div class="grid-cell" id="grid-cell-1-3"></div>

            <div class="grid-cell" id="grid-cell-2-0"></div>
            <div class="grid-cell" id="grid-cell-2-1"></div>
            <div class="grid-cell" id="grid-cell-2-2"></div>
            <div class="grid-cell" id="grid-cell-2-3"></div>

            <div class="grid-cell" id="grid-cell-3-0"></div>
            <div class="grid-cell" id="grid-cell-3-1"></div>
            <div class="grid-cell" id="grid-cell-3-2"></div>
            <div class="grid-cell" id="grid-cell-3-3"></div>
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
</body>
</html>