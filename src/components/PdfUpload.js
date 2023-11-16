import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PdfUpload() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await axios.post(
        "http://localhost:7000/api/upload",
        formData
      );
      console.log("upload response", data.response);
      setLoading(false);
      navigation("/chat", { state: data.response, replace: true });
    } catch (error) {
      setLoading(false);
      console.error(error);
      setErrorMessage(error.message);
    }
  };
  return (
    <>
      {!loading ? (
        <form style={{textAlign:'center'}} onSubmit={handleFormSubmit}>
          <input
             type="file"
            // id="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
            {/* <label for="file" className="btn-2">upload</label> */}

          <button type="submit">➤</button>
        </form>
      ) : (
        <h3 style={{textAlign:'center'}}>Thinking...</h3>
      )}
      {errorMessage}
    </>
  );
}

export default PdfUpload;
