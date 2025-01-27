import React from 'react'

function ExportOptions() {
    const handleExport = (type) => {
        // Implement export logic for Copy, CSV, Excel, PDF, Print here
        console.log(`Exporting to ${type}`);
    };
    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Export Options</h3>
            <div className="flex space-x-4 mb-4">
                {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map((type) => (
                    <button
                        key={type}
                        onClick={() => handleExport(type)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Export {type}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ExportOptions
