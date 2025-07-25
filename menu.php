<?php
session_start();

// 检查用户是否已登录，如果未登录则重定向到登录页面
if (!isset($_SESSION["account"])) {
    header("Location: index.php");
    exit;
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>遊戲菜單</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 20px;
        }

        h2 {
            text-align: center;
            color: #333;
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin: 20px auto;
            max-width: 400px;
            text-align: center;
        }

        li {
            margin-bottom: 10px;
        }

        a {
            display: block;
            background-color: #4caf50;
            color: #fff;
            text-decoration: none;
            padding: 10px;
            border-radius: 3px;
            transition: background-color 0.3s ease;
        }

        a:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h2>遊戲菜單</h2>
    <ul>
        <li><a href="snake.php">貪食蛇</a></li>
        <li><a href="./2048/2048.php">2048</a></li>
        <li><a href="./minesweeper.php">MineSweeper</a></li>
        <li><a href="chess.php">Defend Chess</a></li>
    </ul>
    <p>歡迎, <?php echo $_SESSION["account"]; ?>！</p>
    <p><a href="logout.php">登出</a></p>
</body>
</html>
