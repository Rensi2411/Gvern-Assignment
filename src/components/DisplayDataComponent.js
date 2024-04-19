import React, { useEffect, useState } from 'react';
import '../css/DisplayDataComponent.css';

function DisplayDataComponent() {
    const [data, setData] = useState([]);

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/formData');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data once on component mount and set up a periodic fetch every 3 seconds
    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, []);

    // Render submitted data
    return (
        <div>
            <h2>Submitted Data:</h2>
            {data.length > 0 ? (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            {Object.entries(item)
                                .filter(([key, _]) => key !== 'id') // Exclude 'id' from rendering
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key}:</strong> {value}
                                    </div>
                                ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data submitted yet.</p>
            )}
        </div>
    );
}

export default DisplayDataComponent;
