<?php
session_start();
$account = $_SESSION["account"]; // 請確保使用的 session 鍵與你在 index.php 中存入的鍵相同

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
$sql = "SELECT user_account, score, time FROM snake_scores WHERE user_account = '$targetAccount' ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);


// 检查查询结果


$sql2 = "SELECT user_account, score, time FROM snake_scores ORDER BY score DESC LIMIT 5";
$result2 = $conn->query($sql2);

// 检查全體查询结果


// 关闭数据库连接
$conn->close();
?>