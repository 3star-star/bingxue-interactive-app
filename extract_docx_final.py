import os
import shutil
from pathlib import Path

def repair_and_extract_docx(file_path):
    """尝试修复损坏的docx文件并提取内容"""
    try:
        # 使用binary方式读取文件
        with open(file_path, 'rb') as f:
            content = f.read()

        # 尝试在binary内容中寻找文本模式
        text_part = content.decode('utf-8', errors='ignore')

        # 查找常见的文本模式
        lines = text_part.split('\n')
        useful_lines = []

        for line in lines:
            # 过滤掉空行和纯符号行
            if len(line.strip()) > 10 and any(c.isalpha() for c in line):
                # 移除特殊字符
                clean_line = ''.join(c for c in line if c.isprintable())
                if clean_line:
                    useful_lines.append(clean_line)

        return '\n'.join(useful_lines[:100])  # 返回前100行有用的内容

    except Exception as e:
        return f"提取失败: {str(e)}"

# 提取文本
file_path = r"D:\AI工作区\conversations\conv-1775791118793/1775791162014-创新发展专项基金申报书 大学生专项目-207010108仵煜 最新版.docx"
result = repair_and_extract_docx(file_path)

# 保存到文件避免编码问题
with open('D:/AI工作区/extracted_content.txt', 'w', encoding='utf-8') as f:
    f.write(result)

print("内容已保存到 extracted_content.txt")