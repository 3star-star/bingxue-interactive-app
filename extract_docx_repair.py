import os
import shutil
from pathlib import Path

def repair_and_extract_docx(file_path):
    """尝试修复损坏的docx文件并提取内容"""
    try:
        # 创建临时目录
        temp_dir = Path("D:/AI工作区/temp_docx")
        temp_dir.mkdir(exist_ok=True)

        # 复制文件到临时目录进行修复
        temp_file = temp_dir / "temp.docx"
        shutil.copy2(file_path, temp_file)

        # 尝试直接作为文本读取前一部分
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            # 读取前10000个字符看看是否有可读内容
            content = f.read(10000)

            # 查找有用的文本模式
            lines = content.split('\n')
            useful_lines = []

            for line in lines:
                # 过滤掉空行和纯符号行
                if len(line.strip()) > 10 and any(c.isalpha() for c in line):
                    useful_lines.append(line)

            return '\n'.join(useful_lines[:50])  # 返回前50行有用的内容

    except Exception as e:
        return f"提取失败: {str(e)}"

# 提取文本
file_path = r"D:\AI工作区\conversations\conv-1775791118793/1775791162014-创新发展专项基金申报书 大学生专项目-207010108仵煜 最新版.docx"
result = repair_and_extract_docx(file_path)
print(result)