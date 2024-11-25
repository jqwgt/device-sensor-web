

let socket   套接字;

// 初始化 WebSocket
function   函数 initWebSocket(ipAddress) {
  const socketUrl = `ws://${ipAddress}:8080`;
  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log("WebSocket连接成功");
    alert("WebSocket连接成功！");
  };

  socket.onerror = (error) => {
    console.error("WebSocket连接错误:", error);
    alert("WebSocket连接失败，请检查服务器地址！");
  };

  socket.onclose = () => {
    console.log("WebSocket已关闭");
    alert("WebSocket已关闭！");
  };
}

// 初始化传感器监听
function   函数 initSensors() {
  const gyroElement = document.getElementById('gyroData');
  const accelElement = document.getElementById('accelData');

  // 陀螺仪监听
  window.addEventListener('deviceorientation', (event) => {
    const data   数据 = {   Const data = {
      type: "gyroscope",
      alpha: event.alpha,
      beta   β: event.beta   β,
      gamma: event.gamma
    };
    gyroElement.textContent = `α: ${event.alpha.toFixed(2)}, β: ${event.beta   β.toFixed(2)}, γ: ${event.gamma.toFixed(2)}`;

    // 发送数据到服务器
    if (socket && socket.readyState === WebSocket.OPEN   开放) {
      socket.send(JSON.stringify(data));
    }
  });

  // 加速度计监听
  window.addEventListener('devicemotion', (event) => {
    const accel = event.accelerationIncludingGravity;
    const data   数据 = {
      type: "accelerometer",
      x: accel.x,
      y: accel.y,
      z: accel.z
    };
    accelElement.textContent = `X: ${accel.x.toFixed(2)}, Y: ${accel.y.toFixed(2)}, Z: ${accel.z.toFixed(2)}`;

    // 发送数据到服务器
    if (socket && socket.readyState === WebSocket.OPEN   开放) {如果(socket && socket。readyState === WebSocket.OPEN   开放) {
      socket.send(JSON.stringify(data));socket.send (JSON.stringify(数据));
    }
  });
}

// 动态获取 IP 地址并启动
window.onload = () => {
  const ipAddress = prompt("请输入电脑的 IP 地址:", "192.168.1.100");
  if (ipAddress) {
    initWebSocket(ipAddress);
    initSensors();
  } else {
    alert("IP 地址不能为空！");
  }
};
