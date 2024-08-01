import streamlit as st
import fitz  # PyMuPDF

# Function to display the PDF
def display_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    num_pages = doc.page_count
    st.write(f"Number of pages: {num_pages}")

    for page_num in range(num_pages):
        page = doc.load_page(page_num)
        pix = page.get_pixmap()
        img = pix.tobytes("png")
        st.image(img, caption=f"Page {page_num + 1}")

# Streamlit app
st.title("PDF Viewer")

# Upload PDF file
uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")

if uploaded_file is not None:
    display_pdf(uploaded_file)