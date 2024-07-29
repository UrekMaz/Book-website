import React from 'react';

export default function Chatbot() {
    return (
        <div style={{ height: '100vh' }}>
            <iframe 
                src="http://localhost:8501" 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="Chatbot"
            />
        </div>
    );
}
