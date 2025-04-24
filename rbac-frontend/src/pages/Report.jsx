import { useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Report = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const af_id = location.state?.af_id || searchParams.get("af_id");
  const date = location.state?.date || searchParams.get("date");

  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (af_id && date) {
      fetchReports();
    }
  }, [af_id, date]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/report/fetch_report.php?af_id=${af_id}&date=${date}`
      );

      if (response.data.success) {
        setReports(response.data.reports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("af_id", af_id);
    formData.append("date", date);
    formData.append("photo", selectedFile);

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/report/process_upload_report.php`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        alert("Report uploaded successfully!");
        setSelectedFile(null);
        setPreview(null);
        fetchReports();
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId, imgPath) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/report/delete_report.php?af_id=${reportId}&file_path=${imgPath}`
      );

      if (response.data.success) {
        alert("Report deleted successfully!");
        fetchReports();
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <div className="mb-6 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload New Report</h2>
            <div className="flex items-center space-x-4">
              <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Report"}
              </button>
            </div>
            {preview && <img src={preview} alt="Preview" className="mt-4 w-40 h-40 object-cover border rounded" />}
          </div>

          <h2 className="text-2xl font-semibold mb-4">Uploaded Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <div key={index} className="p-4 bg-white shadow-lg rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{report.title || "Report"}</h3>

                  {report.image_data ? (
                    <div className="relative">
                      <img
                        src={report.image_data}
                        alt="Report"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="mt-3 flex justify-between">
                        <a
                          href={`${process.env.REACT_APP_API_URL}/${report.img}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(report.af_id, report.img)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No image available</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reports found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
