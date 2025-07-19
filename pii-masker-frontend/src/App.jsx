import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [maskedImage, setMaskedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setMaskedImage(null);
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/upload/", formData, {    
        responseType: "blob", 
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      setMaskedImage(url);
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white/40 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-xl w-full transition-all duration-300 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          🔒 PII Image Masker
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
          />

          {image && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">📤 Selected: {image.name}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 px-6 rounded-full w-full font-semibold disabled:opacity-60"
          >
            {loading ? "Masking..." : "Upload & Mask"}
          </button>
        </div>

        {maskedImage && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">🖼️ Masked Output:</h3>
            <img
              src={maskedImage}
              alt="Masked"
              className="rounded-xl border border-gray-300 shadow-md w-full max-h-[450px] object-contain"
            />
            <div className="text-center mt-3">
              <a
                href={maskedImage}
                download="masked_output.jpg"
                className="text-indigo-600 underline hover:text-indigo-800 text-sm"
              >
                ⬇️ Download Masked Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
