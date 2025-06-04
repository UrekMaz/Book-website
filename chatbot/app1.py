import streamlit as st
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings.spacy_embeddings import SpacyEmbeddings
from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.tools.retriever import create_retriever_tool
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader

# Load environment variables
load_dotenv()
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
groq_api_key = os.getenv('GROQ_API_KEY')

# Initialize SpaCy embeddings
embeddings = SpacyEmbeddings(model_name="en_core_web_sm")

def pdf_read(pdf_doc):
    """Extract text from uploaded PDF documents"""
    text = ""
    for pdf in pdf_doc:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            try:
                text += page.extract_text()
            except UnicodeEncodeError:
                text += page.extract_text().encode('utf-8', 'ignore').decode('utf-8')
    return text

def get_chunks(text):
    """Split text into manageable chunks"""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    return chunks

def vector_store(text_chunks):
    """Create and save vector store from text chunks"""
    try:
        vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
        vector_store.save_local("faiss_db")
    except UnicodeEncodeError:
        clean_chunks = [chunk.encode('utf-8', 'ignore').decode('utf-8') for chunk in text_chunks]
        vector_store = FAISS.from_texts(clean_chunks, embedding=embeddings)
        vector_store.save_local("faiss_db")

def check_pdf_content(retriever, question):
    """Check if the PDF has relevant content for the question"""
    docs = retriever.get_relevant_documents(question)
    return docs if docs else None

def get_llm_response(question, context=None):
    """Get response from LLM with or without PDF context"""
    llm = ChatGroq(groq_api_key=groq_api_key, model_name="llama3-8b-8192")
    
    if context:
        # Create prompt with PDF context
        prompt = ChatPromptTemplate.from_template(
            """Answer the following question based on this information from the PDF:
            
            PDF CONTENT:
            {context}
            
            QUESTION: {question}
            
            Provide a detailed and helpful answer based on the PDF content above."""
        )
        response = prompt.format_messages(context=context, question=question)
        result = llm.invoke(response)
        return result.content
    else:
        # Create prompt for general knowledge answer (without mentioning lack of PDF content)
        prompt = ChatPromptTemplate.from_template(
            """Answer the following question helpfully and thoroughly:
            
            QUESTION: {question}
            
            Provide a detailed and helpful answer."""
        )
        response = prompt.format_messages(question=question)
        result = llm.invoke(response)
        return result.content

def answer_question(question):
    """Process the question and return an answer, prioritizing PDF content"""
    try:
        # Try to load the vector database
        new_db = FAISS.load_local("faiss_db", embeddings, allow_dangerous_deserialization=True)
        retriever = new_db.as_retriever(search_kwargs={"k": 3})
        
        # Check if PDF has relevant content
        pdf_docs = check_pdf_content(retriever, question)
        
        if pdf_docs:
            # Create context from PDF documents
            context = "\n\n".join([doc.page_content for doc in pdf_docs])
            return get_llm_response(question, context)
        else:
            # Seamlessly fall back to LLM without mentioning PDF limitation
            return get_llm_response(question)
            
    except Exception as e:
        # Handle case where PDF processing hasn't been done
        return get_llm_response(question)

def main():
    st.set_page_config("Chat PDF")
    st.header("Chat with PDF")
    
    with st.sidebar:
        st.title("Menu:")
        pdf_doc = st.file_uploader("Upload your PDF Files and Click on the Submit & Process Button", accept_multiple_files=True)
        
        if st.button("Submit & Process"):
            if not pdf_doc:
                st.error("Please upload at least one PDF file")
            else:
                with st.spinner("Processing PDFs..."):
                    raw_text = pdf_read(pdf_doc)
                    if raw_text:
                        text_chunks = get_chunks(raw_text)
                        vector_store(text_chunks)
                        st.success("PDFs processed successfully!")
                    else:
                        st.error("Could not extract text from the uploaded PDF files")
    
    # Main chat interface
    user_question = st.text_input("Ask a Question from the PDF Files")
    
    if user_question:
        with st.spinner("Searching for answer..."):
            answer = answer_question(user_question)
            st.write("Reply:", answer)

if __name__ == "__main__":
    main()