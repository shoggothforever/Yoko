#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import cgi
from urllib.parse import urlparse, parse_qs

UPLOAD_DIR = "/root/.openclaw/workspace/upload-app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>阳子的私有上传接口</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 50px auto;
                        padding: 20px;
                        background: #0a0a0a;
                        color: #e0e0e0;
                    }
                    h1 { color: #e94560; }
                    form {
                        background: rgba(26, 26, 46, 0.8);
                        padding: 30px;
                        border-radius: 10px;
                        border: 1px solid #0f3460;
                    }
                    .form-group { margin-bottom: 20px; }
                    label { display: block; margin-bottom: 8px; color: #e94560; }
                    input[type="text"], textarea {
                        width: 100%;
                        padding: 10px;
                        background: rgba(15, 52, 96, 0.3);
                        border: 1px solid #0f3460;
                        border-radius: 5px;
                        color: #e0e0e0;
                    }
                    input[type="file"] {
                        padding: 10px 0;
                        color: #e0e0e0;
                    }
                    button {
                        background: linear-gradient(135deg, #e94560 0%, #533483 100%);
                        color: white;
                        padding: 12px 30px;
                        border: none;
                        border-radius: 5px;
                        font-size: 1rem;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <h1>阳子的私有上传接口</h1>
                <form method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="command">相关命令/描述</label>
                        <textarea id="command" name="command" rows="4" placeholder="请输入与图片相关的命令或描述..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="file">选择图片</label>
                        <input type="file" id="file" name="file" accept="image/*">
                    </div>
                    <button type="submit">上传</button>
                </form>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/":
            content_type, pdict = cgi.parse_header(self.headers.get("Content-Type"))
            if content_type == "multipart/form-data":
                pdict["boundary"] = pdict["boundary"].encode("utf-8")
                form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={"REQUEST_METHOD": "POST"}, **pdict)
                command = form.getvalue("command", "")
                file_item = form.getvalue("file")
                
                if file_item and file_item.file:
                    filename = os.path.basename(file_item.filename)
                    save_path = os.path.join(UPLOAD_DIR, filename)
                    with open(save_path, "wb") as f:
                        f.write(file_item.file.read())
                    
                    # Save command
                    if command:
                        with open(save_path + ".txt", "w", encoding="utf-8") as f:
                            f.write(command)
            
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>上传成功！</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 100px auto;
                        padding: 20px;
                        background: #0a0a0a;
                        color: #e0e0e0;
                        text-align: center;
                    }
                    h1 { color: #e94560; }
                    a { color: #e94560; }
                </style>
            </head>
            <body>
                <h1>上传成功！</h1>
                <p>图片和命令已保存。</p>
                <p><a href="/">返回上传页面</a></p>
            </body>
            </html>
            """
            self.wfile.write(html.encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server_address = ("0.0.0.0", 8081)  # 监听所有地址，开放访问
    httpd = HTTPServer(server_address, UploadHandler)
    print(f"阳子的上传接口运行在 http://0.0.0.0:8081")
    print(f"公网访问地址：http://118.145.99.224:8081")
    print("上传的文件保存在:", UPLOAD_DIR)
    httpd.serve_forever()
