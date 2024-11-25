// script.js

let ws; // WebSocket 实例
let serverUrl = prompt("请输入接收数据的服务器 URL（例如：http://192.168.1.100:5000）");

// 如果没有输入 URL 地址，则提示并停止执行
if (!serverUrl) {
    alert("未输入服务器 URL，无法发送数据！");
} else {
    // 使用 URL 对象解析用户输入的 URL，提取服务器的 IP 和端口
    let url = new URL(serverUrl); // 解析 URL
    let serverIp = url.hostname; // 获取 IP 地址
    let serverPort = url.port || "8080"; // 获取端口，默认使用 8080，如果没有指定端口

    const wsUrl = `ws://${serverIp}:${serverPort}`; // 连接到 WebSocket 服务器的 URL

    // 初始化 WebSocket 连接
    ws = new WebSocket(wsUrl);

    // WebSocket 连接成功
    ws.onopen = () => {
        console.log("WebSocket 连接成功");
    };

    // WebSocket 错误处理
    ws.onerror = (error) => {
        console.error("WebSocket 连接错误：", error);
        displayErrorMessage("WebSocket 连接错误，请检查 IP 地址和服务器状态！");
    };

    // WebSocket 关闭
    ws.onclose = () => {
        console.log("WebSocket 连接关闭");
        displayErrorMessage("WebSocket 连接已关闭！");
    };
}

// 设备传感器数据监听
if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === "granted") {
                    setupListeners();
                } else {
                    alert("权限被拒绝，无法读取设备传感器数据！");
                }
            })
            .catch(console.error);
    } else {
        setupListeners();
    }
} else {
    alert("你的设备或浏览器不支持设备传感器功能！");
}

// 设置传感器监听
function setupListeners() {
    // 监听陀螺仪数据
    window.addEventListener("deviceorientation", (event) => {
        const alpha = event.alpha ? event.alpha.toFixed(2) : 0;
        const beta = event.beta ? event.beta.toFixed(2) : 0;
        const gamma = event.gamma ? event.gamma.toFixed(2) : 0;

        const gyroData = `α: ${alpha}°, β: ${beta}°, γ: ${gamma}°`;
        document.getElementById("gyro").textContent = gyroData;

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "gyro", alpha, beta, gamma }));
        } else {
            displayErrorMessage("WebSocket 未连接，无法发送陀螺仪数据！");
        }
    });

    // 监听加速度计数据
    window.addEventListener("devicemotion", (event) => {
        const x = event.acceleration.x ? event.acceleration.x.toFixed(2) : 0;
        const y = event.acceleration.y ? event.acceleration.y.toFixed(2) : 0;
        const z = event.acceleration.z ? event.acceleration.z.toFixed(2) : 0;

        const accelData = `X: ${x} m/s², Y: ${y} m/s², Z: ${z} m/s²`;
        document.getElementById("accel").textContent = accelData;

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "accel", x, y, z }));
        } else {
            displayErrorMessage("WebSocket 未连接，无法发送加速度计数据！");
        }
    });
}

// 显示错误信息
function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById("error-message");
    const errorTextElement = document.getElementById("error-text");

    errorTextElement.textContent = message;
    errorMessageElement.style.display = "block";
}
