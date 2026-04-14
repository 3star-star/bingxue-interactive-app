# 尝试使用在线服务提取docx内容
import requests
import json

def extract_with_online_service(file_path):
    """尝试使用在线服务提取docx内容"""
    try:
        # 这里只是示例，实际使用时需要替换为真实的API
        with open(file_path, 'rb') as f:
            files = {'file': f}
            # 注意：这只是一个示例，你需要替换为实际的API端点
            # response = requests.post('https://api.example.com/extract', files=files)
            # return response.text
        return "在线服务需要配置API"
    except Exception as e:
        return f"错误: {str(e)}"

# 检查文件基本信息
file_path = r"D:\AI工作区\conversations\conv-1775791118793\1775791162014-创新发展专项基金申报书 大学生专项目-207010108仵煜 最新版.docx"
import os
print(f"文件大小: {os.path.getsize(file_path)} 字节")
print(f"文件存在: {os.path.exists(file_path)}")