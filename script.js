// 初始化变量
let   让 ws; // WebSocket 实例
let   让 serverIp = prompt   提示("请输入接收数据的服务器 IP（例如：192.168.1.100）");

if   如果 (!serverIp) {
    alert   警报("未输入 IP 地址，无法发送数据！");
} else   其他的 {
    // 初始化 WebSocket 连接
    const   常量 wsUrl = `ws://   “ws: / /${serverIp}:8080`; // 假设服务器监听 8080 端口
    ws = new   新 WebSocket(wsUrl);

    ws.onopen = () => {
        console.log   日志("WebSocket 连接成功");
    };

    ws.onerror = (error   错误) => {
        console.error   错误("WebSocket 连接错误：", error);
    };

    ws.onclose = () => {
        console.log   日志("WebSocket 连接关闭");
    };
}

// 检查浏览器是否支持设备传感器功能
if   如果 (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    // 请求权限（针对 iOS 设备）
    if   如果 (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if   如果 (permissionState === "granted") {
                    setupListeners();
                } else   其他的 {
                    alert   警报("权限被拒绝，无法读取设备传感器数据！");
                }
            })
            .catch(console.error);
    } else {
        // 不需要权限，直接添加监听器
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

        // 发送数据到 WebSocket 服务器
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "gyro", alpha, beta, gamma }));
        }
    });

    // 监听加速度计数据
    window.addEventListener("devicemotion", (event) => {
        const x = event.acceleration.x ? event.acceleration.x.toFixed(2) : 0;
        const y = event.acceleration.y ? event.acceleration.y.toFixed(2) : 0;
        const z = event.acceleration.z ? event.acceleration.z.toFixed(2) : 0;

        const accelData = `X: ${x} m/s², Y: ${y} m/s², Z: ${z} m/s²`;
        document.getElementById("accel").textContent = accelData;

        // 发送数据到 WebSocket 服务器
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "accel", x, y, z }));
        }
    });
}
