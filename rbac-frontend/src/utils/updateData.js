const updateData = async ({ API_URL, data }) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/${API_URL}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), 
        });

        const result = await response.json();

        if (response.success) {
            return true; 
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (err) {
        return {
            message: err.message,
            status: 'error',
        };
    }
};

export default updateData;
