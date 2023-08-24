function MicroDACO(){
    const { spawn } = require('child_process');

// 要执行的 Python 脚本和参数
    const pythonScript = './main.py';
    const args = ['1', '2'];

// 创建子进程，执行 Python 脚本
    const pythonProcess = spawn('python', [pythonScript, ...args]);

// 监听子进程的标准输出
    pythonProcess.stdout.on('data', (data) => {
        console.log('Python stdout:', data.toString());
    });

    // 监听子进程的错误输出
    pythonProcess.stderr.on('data', (data) => {
        console.error('Python stderr:', data.toString());
    });

    // 监听子进程的退出事件
    pythonProcess.on('close', (code) => {
        console.log('Python process exited with code:', code);
    });
}
module.exports = MicroDACO;