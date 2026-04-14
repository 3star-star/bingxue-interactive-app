import zipfile
import re
from pathlib import Path

def extract_docx_content(file_path):
    """从docx文件中提取文本内容"""
    try:
        # 检查文件是否存在
        if not Path(file_path).exists():
            return f"文件不存在: {file_path}"

        # 使用zipfile打开docx文件
        with zipfile.ZipFile(file_path, 'r') as docx:
            # 提取document.xml文件（包含文档正文）
            document_xml = docx.read('word/document.xml')

            # 提取header.xml文件（包含页眉）
            header_xml = docx.read('word/header.xml').decode('utf-8')

            # 提取footer.xml文件（包含页脚）
            footer_xml = docx.read('word/footer.xml').decode('utf-8')

            # 使用正则表达式提取文本内容
            # 匹配<w:t>标签中的文本
            text_pattern = r'<w:t[^>]*>(.*?)</w:t>'
            texts = re.findall(text_pattern, document_xml.decode('utf-8'))

            # 清理文本
            clean_text = ' '.join(texts)

            return clean_text
    except Exception as e:
        return f"Error extracting content: {str(e)}"

# 使用示例
file_path = r"D:\AI工作区\conversations\conv-1775791118793\1775791162014-创新发展专项基金申报书 大学生专项目-207010108仵煜 最新版.docx"
text = extract_docx_content(file_path)
print(text[:2000])  # 打印前2000个字符