import os
import sys
from docx import Document

def read_word_document():
    # 查找所有docx文件
    doc_files = []
    for file in os.listdir('.'):
        if file.endswith('.docx'):
            doc_files.append(file)
        elif file.endswith('.doc'):
            doc_files.append(file)

    if not doc_files:
        print("未找到Word文档")
        return

    # 使用第一个找到的文档
    doc_path = doc_files[0]
    print(f"正在读取文档: {doc_path}")

    try:
        doc = Document(doc_path)

        # 提取所有段落
        paragraphs = []
        for para in doc.paragraphs:
            if para.text.strip():
                paragraphs.append(para.text.strip())

        print(f"共提取到 {len(paragraphs)} 个有效段落")

        # 查找章节
        chapters = []
        for i, text in enumerate(paragraphs):
            if '第' in text and '章' in text and len(text) < 50:
                chapters.append((i+1, text))

        print(f"找到 {len(chapters)} 个章节:")
        for idx, chapter in chapters:
            print(f"  {idx}. {chapter}")

        # 保存到文件
        output_file = "冰雪旅游智能化解决方案-文档提取内容.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("冰雪旅游智能化解决方案-文档提取内容\n")
            f.write("="*50 + "\n\n")

            for i, text in enumerate(paragraphs):
                f.write(f"{i+1}. {text}\n")

        print(f"\n内容已保存到: {output_file}")

        # 显示前20个段落
        print("\n前20个段落:")
        for i, text in enumerate(paragraphs[:20]):
            print(f"{i+1}. {text}")

    except Exception as e:
        print(f"读取文档时出错: {e}")

if __name__ == "__main__":
    read_word_document()