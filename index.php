<?php
// 在使用者登入成功後
session_start();

// 数据库连接信息
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

// 处理登录表单提交
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['login'])) {
        $account = $_POST['account'];
        $password = $_POST['password'];

        // 执行查询
        $sql = "SELECT * FROM users WHERE account = '$account' AND password = '$password'";
        $result = $conn->query($sql);

        // 检查查询结果
        if ($result->num_rows == 1) {
            // 登录成功
            header("Location: menu.php");
        } else {
            // 登录失败
            echo "帳號或密碼錯誤！";
        }
    } elseif (isset($_POST['signup'])) {
        $account = $_POST['account'];
        $password = $_POST['password'];

        // 执行插入操作
        $sql = "INSERT INTO users (account, password) VALUES ('$account', '$password')";
        if ($conn->query($sql) === TRUE) {
            echo "註冊成功！";
        } else {
            echo "註冊失敗請重新輸入: " . $conn->error;
        }
    } elseif (isset($_POST['guest'])) {
        // Handle guest login
        $account = '訪客';
        $password = '訪客';

        // 执行查询
        $sql = "SELECT * FROM users WHERE account = '$account' AND password = '$password'";
        $result = $conn->query($sql);

        // 检查查询结果
        if ($result->num_rows == 1) {
            // 登录成功
            header("Location: menu.php");
        } else {
            // 登录失败
            echo "訪客登入失敗！";
        }
    }
    // 將帳號資訊存入 session
    $_SESSION["account"] = $account; // 將 $account 替換為實際的帳號資訊
}

// 关闭数据库连接
$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>登錄頁面</title>
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

        form {
            max-width: 400px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        input[type="text"],
        input[type="password"] {
            width: 95%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }

        input[type="submit"],
        button {
            background-color: #4caf50;
            color: #fff;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: block;
            width: 45%;
            margin: 0 auto;
            font-size: 14px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-bottom: 10px;
        }

        input[type="submit"]:hover,
        button:hover {
            background-color: #45a049;
        }

        .error {
            color: red;
            margin-bottom: 10px;
        }

        .guest-login {
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h2>登錄</h2>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <label for="account">帳號：</label>
        <input type="text" name="account" id="account" required><br><br>
        <label for="password">密碼：</label>
        <input type="password" name="password" id="password" required><br><br>
        <input type="submit" name="login" value="登錄">
        <input type="submit" name="signup" value="註冊">
        <div class="guest-login">
            <button type="submit" name="guest" value="guest" onclick="removeRequiredValidation()">訪客登錄</button>
        </div>
    </form>
    <script>
        function removeRequiredValidation() {
            document.getElementById('account').removeAttribute('required');
            document.getElementById('password').removeAttribute('required');
        }
    </script>
</body>
</html>
