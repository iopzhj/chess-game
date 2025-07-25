//save_score
<?php
session_start();
$account = $_SESSION["account"]; // 請確保使用的 session 鍵與你在 index.php 中存入的鍵相同
// 獲取 POST 參數中的分數
$score = $_POST["score"];

// 在這裡寫下儲存分數到資料庫的程式碼
// 例如，使用 MySQLi 連接資料庫並執行 INSERT 語句
$servername = "localhost";
$username = "root";
$password = "542b431a";
$dbname = "final_project";

// 創建資料庫連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接是否成功
if ($conn->connect_error) {
    die("連接失敗：" . $conn->connect_error);
}

// 執行 INSERT 語句，將分數插入到資料庫中的指定表格
$sql = "INSERT INTO minesweeper_scores (score, user_account) VALUES ('$score', '$account')";

if ($conn->query($sql) === true) {
    echo "分數和帳號已儲存到資料庫";
} else {
    echo "錯誤：" . $sql . "<br>" . $conn->error;
}

// 關閉資料庫連接
$conn->close();
?>
