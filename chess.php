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
$sql = "SELECT user_account, score, time FROM chess_scores WHERE user_account = '$targetAccount' ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);


// 检查查询结果


$sql2 = "SELECT user_account, score, time FROM chess_scores ORDER BY score DESC LIMIT 5";
$result2 = $conn->query($sql2);

// 检查全體查询结果


// 关闭数据库连接
$conn->close();
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width,height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <title>Defend Chess</title>
    <link rel="stylesheet" type="text/css" href="mygame.css" />
    <script type="text/javascript" src="./js/jquery.min.js"></script>
    <script type="text/javascript" src="./js/underscore.min.js"></script>
    <script type="text/javascript" src="./js/support.js"></script>
    <script type="text/javascript" src="./js/mygame.js"></script>
    <script>
        function logout (){
            window.location.href = '../logout.php';
        }
        function backtomenu (){
            window.location.href = '../menu.php';
        }
    </script>
    <style>
        #button{
            display: inline-block;
            margin: 10px auto;
            font-size: 20px;
            font-weight: bold;
            width: auto;
            height: auto;
            padding: 10px 10px;
            background-color: #8f7a66;
            font-family: Arial;
            color: white;
            border-radius: 10px;
            text-decoration: none;
            background-color: #9f8b77;
        }
    </style>
</head>

<body>
    <header>
        <h1 id="titletext">Defend Chess</h1>
        <div id="header-content">
            <div id="header-left">
                <span id="stage">Stage 1</span>
                <a href="javascript:newgame()" id="newgamebutton">New Game</a>
                <p id="scoretext">Score : <span id="score">0</span></p>
                <span id="moveleft">2 Move Left</span>
            </div>
            <div id="header-right">
                <!-- <a href="javascript:login()" id="loginbutton">Log In</a>
                <a href="javascript:signup()" id="signupbutton">Sign Up</a> -->
                <button id='button' onclick=logout()>LogOut</button>
                <button id='button' onclick=backtomenu()>Back To Menu</button>

            </div>
        </div>
    </header>
    <div id="display">
        <div id="left-of-display" class="displaydiv">
            <div id="grid-container">
                <div class="grid-cell-e" id="grid-cell-0-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-0-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-0-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-0-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-0-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-0-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-0-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-0-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-o" id="grid-cell-1-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-1-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-1-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-1-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-1-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-1-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-1-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-1-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-e" id="grid-cell-2-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-2-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-2-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-2-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-2-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-2-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-2-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-2-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-o" id="grid-cell-3-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-3-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-3-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-3-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-3-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-3-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-3-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-3-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-e" id="grid-cell-4-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-4-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-4-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-4-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-4-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-4-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-4-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-4-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-o" id="grid-cell-5-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-5-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-5-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-5-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-5-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-5-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-5-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-5-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-e" id="grid-cell-6-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-6-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-6-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-6-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-6-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-6-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-6-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-6-7" onclick="parentclick(this.id)"></div>

                <div class="grid-cell-o" id="grid-cell-7-0" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-7-1" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-7-2" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-7-3" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-7-4" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-7-5" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-o" id="grid-cell-7-6" onclick="parentclick(this.id)"></div>
                <div class="grid-cell-e" id="grid-cell-7-7" onclick="parentclick(this.id)"></div>
            </div>
        </div>
        <div id="right-of-display" class="displaydiv">
        <h2 id='tablehead'><?php echo $targetAccount; ?> 的排行榜</h2>
            <div id="allscore-board">
            <table id="allscore-table">
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
            </div>
            <div class="score-separator"></div>
            <h2 id='tablehead'>全體排行榜</h2>
            <div id="myscore-board">
                <table id="myscore-table">
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
    </div>
    </div>
</body>

</html>