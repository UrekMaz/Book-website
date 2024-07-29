import streamlit as st
import os
import time
from langchain.llms import ChatGroq
from langchain.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.vectorstores import ObjectBox
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve the Groq API key from the environment variable
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    st.error("Error: GROQ_API_KEY environment variable is not set.")
    st.stop()

# Set up the title for the Streamlit app
st.title("Object VectorStoreDB with Llama3")

# Initialize the language model
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

# Define the prompt template
prompt = ChatPromptTemplate.from_template(
    """
    Answer the questions based on provided context.
    <context>
    {context}
    <context>
    Questions: {input}
    """
)

# Define the function for vector embedding and ObjectBox VectorStoreDB
def vector_embedding(uploaded_files):
    if "vectors" not in st.session_state:
        st.session_state.embeddings = OllamaEmbeddings()
        st.session_state.docs = []
        for uploaded_file in uploaded_files:
            with open(uploaded_file, "rb") as f:
                loader = PyPDFLoader(f)
                st.session_state.docs.extend(loader.load())
        st.session_state.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        st.session_state.final_documents = st.session_state.text_splitter.split_documents(st.session_state.docs)
        st.session_state.vectors = ObjectBox.from_documents(
            st.session_state.final_documents,
            st.session_state.embeddings,
            embedding_dimensions=768
        )

# File uploader
uploaded_files = st.file_uploader("Choose PDF files", type="pdf", accept_multiple_files=True)

# Define input prompt
input_prompt = st.text_input("Please enter your question:")

# Define the action when the search button is clicked
if st.button("Search"):
    if uploaded_files:
        vector_embedding(uploaded_files)
        st.write("ObjectBox database is ready.")
    else:
        st.write("Please upload PDF files to create the ObjectBox database.")

# Perform the search if the input prompt is provided
if input_prompt and "vectors" in st.session_state:
    document_chain = create_stuff_documents_chain(llm, prompt)
    retriever = st.session_state.vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    start = time.process_time()
    response = retrieval_chain.invoke({'input': input_prompt})
    st.write(response['answer'])

    with st.expander("Document Similarity Search"):
        for i, doc in enumerate(response['context']):
            st.write(doc.page_content)
            st.write("----------------")
