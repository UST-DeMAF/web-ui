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


//BUG: Fails if the transformation is called a second time with out selecting a new file
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

export async function saveUploadedFilesForTransformation(uploadedFiles: File[]): Promise<void> {
  const formData = new FormData();
  console.log("Uploaded files length:", uploadedFiles.length);

  if (uploadedFiles.length === 1) {
    formData.append('file', uploadedFiles[0]);
  } else {
    uploadedFiles.forEach(file => {
      formData.append('files', file, file.webkitRelativePath);
    });
  }

  try {
    const endpoint = uploadedFiles.length === 1 ? 'http://localhost:3000/upload' : 'http://localhost:3000/upload-multiple';
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    console.log('Files uploaded successfully');
  } catch (error) {
    console.error('Error uploading files:', error);
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

// Polls the status endpoint of the analysis manager for the result of the transformation process.
// It polls the endpoint in an interval given by delayInMilliSeconds until the returned message
// indicates a finished process.
export async function pollTransformationProcessStatusForResult(transformationProcessId: string, delayInMilliSeconds: number): Promise<string> {
  try {
    const response = await fetch(`http://localhost:8080/demaf/status/${transformationProcessId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get status for transformation process ${transformationProcessId}`);
    }

    const message = await response.json();

    if (message.isFinished) {
      console.log("Transformation completed!", message.result);
      return message.result;
    } else {
      console.log("Polling...");
      await new Promise(resolve => setTimeout(resolve, delayInMilliSeconds ));
      return pollTransformationProcessStatusForResult(transformationProcessId, delayInMilliSeconds);
    }
  } catch (error) {
    console.error("Error polling transformation process status:", error);
    throw error;
  }
}