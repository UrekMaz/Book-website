import streamlit as st
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_nomic.embeddings import NomicEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.tools.retriever import create_retriever_tool
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent
import os
from PyPDF2 import PdfReader
from langchain.agents import tool
from langchain_community.embeddings.spacy_embeddings import SpacyEmbeddings
load_dotenv()
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

groq_api_key = os.getenv('GROQ_API_KEY')


embeddings = NomicEmbeddings(model="nomic-embed-text-v1.5")

# Define the tool function
def extract_text_function(query: str) -> str:
    # Your implementation of extracting relevant text from the PDF
    return "Extracted text based on query: " + query

# Define the tool specification in the expected format
tool_spec = {
    "id": "call_relevant_text",
    "type": "function",
    "function": extract_text_function
}

def pdf_read(pdf_doc):
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
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    return chunks

def vector_store(text_chunks):
    try:
        vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
        vector_store.save_local("faiss_db")
    except UnicodeEncodeError:
        clean_chunks = [chunk.encode('utf-8', 'ignore').decode('utf-8') for chunk in text_chunks]
        vector_store = FAISS.from_texts(clean_chunks, embedding=embeddings)
        vector_store.save_local("faiss_db")

def get_conversational_chain(tools, ques):
    llm = ChatGroq(groq_api_key=groq_api_key, model_name="llama3-8b-8192")
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are a helpful assistant. Answer the question as detailed as possible from the provided context, make sure to provide all the details. If the answer is not in
provided context just say, "answer is not available in the context", don't provide the wrong answer.""",
            ),
            ("placeholder", "{chat_history}"),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ]
    )
    
    agent = create_tool_calling_agent(llm, [tools], prompt)
    agent_executor = AgentExecutor(agent=agent, tools=[tools], verbose=True)
    
    try:
        response = agent_executor.invoke({"input": ques})
        output = response.get('output', 'No output available')
    except Exception:
        output = 'No output available'

    st.write("Reply: ", output)

def user_input(user_question):
    new_db = FAISS.load_local("faiss_db", embeddings, allow_dangerous_deserialization=True)
    retriever = new_db.as_retriever()
    retrieval_tool = create_retriever_tool(retriever, "pdf_extractor", "This tool is to give answers to queries from the PDF.")
    get_conversational_chain(retrieval_tool, user_question)
    
def main():
    st.set_page_config("Chat PDF")
    st.header("Chat with PDF")

    user_question = st.text_input("Ask a Question from the PDF Files")

    if user_question:
        user_input(user_question)

    with st.sidebar:
        st.title("Menu:")
        pdf_doc = st.file_uploader("Upload your PDF Files and Click on the Submit & Process Button", accept_multiple_files=True)
        if st.button("Submit & Process"):
            with st.spinner("Processing..."):
                raw_text = pdf_read(pdf_doc)
                text_chunks = get_chunks(raw_text)
                vector_store(text_chunks)
                st.success("Done")

if __name__ == "__main__":
     main()