import React from 'react';
import FormComponent from './components/FormComponent';
import DisplayDataComponent from './components/DisplayDataComponent';

function App() {
    const addFormData = async (data) => {
        try {
            const response = await fetch('http://localhost:3001/formData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to add data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Dynamic Form</h1>
            <FormComponent addFormData={addFormData} />
            <DisplayDataComponent />
        </div>
    );
}

export default App;
