const fetchData = async ({ API_URL, Page_Number, Limit, Search_Term }) => {
    try {
        const params = new URLSearchParams();
        
        // Append query parameters if they exist
        if (Page_Number) params.append('page', Page_Number);
        if (Limit) params.append('limit', Limit);
        if (Search_Term) params.append('search', Search_Term);
        
        // Construct the URL dynamically
        const baseURL = process.env.REACT_APP_API_URL;
        const queryString = params.toString();
        const url = queryString 
            ? `${baseURL}/${API_URL}?${queryString}` 
            : `${baseURL}/${API_URL}`;

        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
            return result;
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (err) {
        console.error("Fetch error:", err); // Debugging log
        return {
            message: err.message,
            status: 'error',
        };
    }
};

export default fetchData;
