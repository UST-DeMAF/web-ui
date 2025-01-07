export async function getRegisteredPlugins() {
  try {
    const response = await fetch("http://localhost:8080/demaf/plugins", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get registered plugins");
    }

    const data = await response.json();
    return data.pluginNames;
  } catch (error) {
    console.error("Error getting registered plugins:", error);
    throw error;
  }
}

export async function saveUploadedFileForTransformation(uploadedFile: File) {
  const formData = new FormData();
  formData.append("file", uploadedFile);

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function callAnalysisManagerTransformation(tsdm: any) {
  try {
    const response = await fetch("http://localhost:8080/demaf/transform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tsdm),
    });

    if (!response.ok) {
      throw new Error("Failed to start transformation process");
    }

    const data = await response.json();
    console.log("Transformation process started with ID:", data);
    return data;
  } catch (error) {
    console.error("Error starting transformation process:", error);
    throw error;
  }
}