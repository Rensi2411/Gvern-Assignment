import React, { useState } from 'react';
import '../css/FormComponent.css';

function FormComponent() {
    // Initial state for form fields
    const initialState = [
        { name: 'name', label: 'Name', value: '', type: 'text', error: '' },
        { name: 'email', label: 'Email', value: '', type: 'email', error: '' },
        { name: 'password', label: 'Password', value: '', type: 'password', error: '' },
    ];

    const [fields, setFields] = useState(initialState);
    const [showSmallForm, setShowSmallForm] = useState(false);
    const [smallFormData, setSmallFormData] = useState({ dataType: 'text', name: '', value: '', error: '' });

    // Handle changes in form fields
    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const updatedFields = [...fields];
        updatedFields[index].value = value;
        validateField(updatedFields[index]);
        setFields(updatedFields);
    };

    // Validate individual fields
    const validateField = (field) => {
        let error = '';
        if (!field.value) {
            error = 'This field is required.';
        } else if (field.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                error = 'Invalid email format.';
            }
        } else if (field.type === 'password' && field.value.length < 8) {
            error = 'Password must be at least 8 characters long.';
        } else if (field.type === 'text' && field.name === 'name') {
            const namePattern = /^[a-zA-Z\s]+$/;
            if (!namePattern.test(field.value)) {
                error = 'Name can only contain letters and spaces.';
            }
        }
        field.error = error;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        let valid = true;
        const updatedFields = fields.map((field) => {
            validateField(field);
            if (field.error) {
                valid = false;
            }
            return field;
        });

        if (!valid) {
            setFields(updatedFields);
            return;
        }

        const data = {};
        fields.forEach((field) => data[field.name] = field.value);

        try {
            const response = await fetch('http://localhost:3001/formData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            setFields(initialState);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    // Handle changes in the small form
    const handleSmallFormChange = (event) => {
        const { name, value } = event.target;
        setSmallFormData({
            ...smallFormData,
            [name]: value,
            error: '',
        });
    };

    // Add a new field to the form
    const addNewField = () => {
        if (!smallFormData.name || !smallFormData.value) {
            setSmallFormData({
                ...smallFormData,
                error: 'Name and value are required.',
            });
            return;
        }

        const newField = {
            name: smallFormData.name,
            label: smallFormData.name,
            value: smallFormData.value,
            type: smallFormData.dataType,
            error: '',
        };

        setFields([...fields, newField]);

        setSmallFormData({ dataType: 'text', name: '', value: '', error: '' });
        setShowSmallForm(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Render form fields */}
                {fields.map((field, index) => (
                    <div key={field.name}>
                        <label htmlFor={field.name}>{field.label}:</label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={field.value}
                            onChange={(e) => handleChange(index, e)}
                        />
                        {field.error && <span style={{ color: 'red' }}>{field.error}</span>}
                    </div>
                ))}
                <button type="button" onClick={() => setShowSmallForm(true)}>Add Field</button>
                <button type="submit">Submit</button>
            </form>

            {/* Conditional rendering of small form */}
            {showSmallForm && (
                <div className="small-form">
                    <h3>Add New Field</h3>
                    <label htmlFor="dataType">Data Type:</label>
                    <select id="dataType" name="dataType" value={smallFormData.dataType} onChange={handleSmallFormChange}>
                        <option value="text">Text</option>
                        <option value="tel">Telephone</option>
                        <option value="website">URL</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                        <option value="range">Range</option>
                    </select>

                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={smallFormData.name} onChange={handleSmallFormChange} />

                    {/* Value input */}
                    <label htmlFor="value">Value:</label>
                    <input
                        type={smallFormData.dataType === 'range' ? 'range' : smallFormData.dataType}
                        id="value"
                        name="value"
                        value={smallFormData.dataType === 'range' ? smallFormData.value : smallFormData.value}
                        onChange={(e) => handleSmallFormChange(e)}
                    />

                    {smallFormData.error && <span style={{ color: 'red' }}>{smallFormData.error}</span>}
                    <button type="button" onClick={addNewField}>Add</button>
                    <button type="button" onClick={() => setShowSmallForm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default FormComponent;
