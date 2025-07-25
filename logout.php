<?php
session_start();

// 清除 session 資料
session_unset();
session_destroy();

// 重新導向回 index.php
header("Location: index.php");
exit;
?>