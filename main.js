const { app, BrowserWindow } = require('electron');
const path = require('path');
const { createServer } = require('http');
const next = require('next');
const fs = require('fs');

// 1. 배포 여부 및 경로 설정
const isProd = app.isPackaged;

// app.getAppPath()는 패키징 후 Resources/app.asar 폴더를 가리킵니다.
// .next 폴더와 next.config.mjs가 위치한 곳을 정확히 지정합니다.
const appPath = isProd 
  ? app.getAppPath() 
  : __dirname;

// 2. Next.js 앱 설정
const nextApp = next({ 
  dev: !isProd, 
  dir: appPath 
});
const handle = nextApp.getRequestHandler();

async function createWindow() {
  try {
    const Database = require('better-sqlite3');
    const isProd = app.isPackaged;
    const resourcesPath = process.resourcesPath;
    
    // DB 경로 설정
    const dbDir = isProd ? path.join(resourcesPath, 'DB') : path.join(process.cwd(), 'DB');
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const dbPath = path.join(dbDir, 'database.sqlite');
    const db = new Database(dbPath);

    // schema.sql 읽기 (패키징된 경로 고려)
    // 빌드 시 SQL 폴더가 Resources에 포함되도록 설정해야 함
    const sqlPath = isProd 
      ? path.join(resourcesPath, 'DB', 'schema.sql') 
      : path.join(process.cwd(), 'DB', 'SQL', 'schema.sql');

    if (fs.existsSync(sqlPath)) {
      const schema = fs.readFileSync(sqlPath, 'utf8');
      db.exec(schema);
      console.log("✅ DB 테이블 초기화 완료");
    }
    db.close();
  } catch (err) {
    console.error("❌ DB 자동 초기화 실패:", err);
  }

  
  try {
    // Next.js 서버 준비
    await nextApp.prepare();
    
    // 포트 3000에서 Next.js 서버 실행
    const server = createServer((req, res) => {
      handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });

    // Electron 윈도우 생성
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'), // 필요한 경우 사용
      },
    });

    // 서버가 구동된 후 URL 로드
    win.loadURL('http://localhost:3000');

    // 패키징 후에도 문제가 생기면 로그를 볼 수 있도록 개발자 도구 활성화 (선택)
    // if (isProd) win.webContents.openDevTools();

  } catch (err) {
    console.error('Next.js prepare failed:', err);
    // 에러 발생 시 앱 종료 방지를 위해 로그만 출력하거나 별도 처리
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});