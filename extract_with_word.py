import win32com.client
import os

def extract_with_word_com(file_path):
    """使用Word COM接口提取文本"""
    try:
        # 启动Word应用程序
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False

        # 打开文档
        doc = word.Documents.Open(file_path)

        # 提取文本
        text = doc.Content.Text

        # 关闭文档
        doc.Close()
        word.Quit()

        return text
    except Exception as e:
        return f"错误: {str(e)}"
    finally:
        try:
            word.Quit()
        except:
            pass

# 使用示例
file_path = r"D:\AI工作区\conversations\conv-1775791118793\1775791162014-创新发展专项基金申报书 大学生专项目-207010108仵煜 最新版.docx"
result = extract_with_word_com(file_path)
print(result[:2000])  # 打印前2000个字符