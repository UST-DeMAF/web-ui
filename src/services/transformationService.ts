import { v4 as uuidv4 } from 'uuid';

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

// Function to generate a random UUID as a session ID
export function generateSessionId(): string {
  return uuidv4();
}

// Function to check total size of uploaded files
export function checkTotalSize(files: File[]): boolean {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const maxSize = 50 * 1024 * 1024; // 50 MB in bytes
  return totalSize <= maxSize;
}

//BUG: Fails if the transformation is called a second time with out selecting a new file
export async function saveUploadedFileForTransformation(uploadedFile: File, sessionId: string) {
  const formData = new FormData();
  formData.append("file", uploadedFile);

  try {
    const response = await fetch(`http://localhost:3000/upload?sessionId=${sessionId}`, {
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

export async function saveUploadedFilesForTransformation(uploadedFiles: File[], sessionId: string): Promise<void> {
  const formData = new FormData();
  console.log("Uploaded files length:", uploadedFiles.length);

  uploadedFiles.forEach(file => {
    formData.append('files', file, file.webkitRelativePath);
    formData.append('relativePaths', file.webkitRelativePath); // Add relative path to form data
  });

  try {
    const endpoint = uploadedFiles.length === 1 ? `http://localhost:3000/upload?sessionId=${sessionId}` : `http://localhost:3000/upload-multiple?sessionId=${sessionId}`;
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