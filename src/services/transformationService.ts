import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a technology-specific deployment model object.
 * @param {string} technology - The selected technology.
 * @param {string} location - The location of the file(s) to transform.
 * @param {string} commands - The commands to execute.
 * @param {string[]} options - The selected options.
 * @returns {any} The technology-specific deployment model object.
*/
function createTSDM(technology: string, location: string, commands: string, options: string[]) {
  return {
    technology: technology.toLowerCase(),
    locationURL: encodeURI(location),
    commands: commands ? commands.split(",").map((cmd) => cmd.trim()) : [""],
    options: options,
  };
}

/**
 * Fetches the list of registered plugins from the server.
 * @returns {Promise<string[]>} A promise that resolves to an array of plugin names.
 */
export async function getRegisteredPlugins(): Promise<string[]> {
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

/**
 * Generates a random UUID to be used as a session ID.
 * @returns {string} A new UUID.
 */
export function generateSessionId(): string {
  return uuidv4();
}

/**
 * Checks if the total size of the uploaded files exceeds the maximum allowed size.
 * @param {File[]} files - The array of files to check.
 * @returns {boolean} True if the total size is within the limit, false otherwise.
 */
export function checkTotalSize(files: File[]): boolean {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const maxSize = 50 * 1024 * 1024; // 50 MB in bytes
  return totalSize <= maxSize;
}

/**
 * Saves a single uploaded file for transformation.
 * @param {File} uploadedFile - The file to upload.
 * @param {string} sessionId - The session ID.
 */
export async function saveUploadedFileForTransformation(uploadedFile: File, sessionId: string): Promise<void> {
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

/**
 * Saves multiple uploaded files for transformation.
 * @param {File[]} uploadedFiles - The array of files to upload.
 * @param {string} sessionId - The session ID.
 */
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

/**
 * Calls the analysis manager to start the transformation process.
 * @param {any} tsdm - The transformation service data model.
 * @returns {Promise<string>} A promise that resolves to the transformation process ID.
 */
export async function callAnalysisManagerTransformation(tsdm: any): Promise<string> {
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

/**
 * Polls the status endpoint of the analysis manager for the result of the transformation process.
 * It polls the endpoint in an interval given by delayInMilliSeconds until the returned message
 * indicates a finished process.
 * @param {string} transformationProcessId - The ID of the transformation process.
 * @param {number} delayInMilliSeconds - The delay between polling attempts.
 * @returns {Promise<string>} A promise that resolves to the result of the transformation process.
 */
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
      await new Promise(resolve => setTimeout(resolve, delayInMilliSeconds));
      return pollTransformationProcessStatusForResult(transformationProcessId, delayInMilliSeconds);
    }
  } catch (error) {
    console.error("Error polling transformation process status:", error);
    throw error;
  }
}

/**
 * Handles the transformation process for a single uploaded file.
 * @param {File} uploadedFile - The uploaded file.
 * @param {string} session - The session ID.
 * @param {string} selectedTechnology - The selected technology.
 * @param {string} commands - The commands to execute.
 * @param {string[]} options - The selected options.
 * @returns {Promise<{transformationProcessName: string, tsdm: any}>} A promise that resolves to the transformation process name and data model.
 */
export async function handleSingleFileTransformation(uploadedFile: File, session: string, selectedTechnology: string, commands: string, options: string[]) {
  await saveUploadedFileForTransformation(uploadedFile, session);
  const transformationProcessName = uploadedFile.name;
  const tsdm = createTSDM(selectedTechnology, `file:/usr/share/uploads/${session}/${transformationProcessName}`, commands, options);
  return { transformationProcessName, tsdm };
}

/**
 * Handles the transformation process for multiple uploaded files.
 * @param {File[]} uploadedFiles - The uploaded files.
 * @param {string} session - The session ID.
 * @param {string} selectedTechnology - The selected technology.
 * @param {string} commands - The commands to execute.
 * @param {string[]} options - The selected options.
 * @param {string} startFilePath - The path to the start file.
 * @returns {Promise<{transformationProcessName: string, tsdm: any}>} A promise that resolves to the transformation process name and data model.
 */
export async function handleMultipleFilesTransformation(uploadedFiles: File[], session: string, selectedTechnology: string, commands: string, options: string[], startFilePath: string) {
  const folderName = uploadedFiles[0].webkitRelativePath.split('/')[0];
  var transformationProcessName, tsdm;

  if (startFilePath == "" || startFilePath == "*") {
    transformationProcessName = folderName;
    tsdm = createTSDM(selectedTechnology, `file:/usr/share/uploads/${session}/${folderName}`, commands, options);
  }
  else {
    const startFile = uploadedFiles.find(file => file.webkitRelativePath === `${folderName}/${startFilePath}`);
    if (!startFile) {
      throw new Error("Start file not found in the uploaded folder.");
    }
    transformationProcessName = startFile.webkitRelativePath.split('/').at(-1);
    tsdm = createTSDM(selectedTechnology, `file:/usr/share/uploads/${session}/${startFile.webkitRelativePath}`, commands, options);
  }
  await saveUploadedFilesForTransformation(uploadedFiles, session);
  return { transformationProcessName, tsdm };
}

/**
 * Starts the transformation process and polls for the result.
 * @param {any} tsdm - The transformation service data model.
 * @returns {Promise<{transformationProcessId: string, statusMessage: string}>} A promise that resolves to the transformation process ID and status message.
 */
export async function startTransformationProcess(tsdm: any) {
  const transformationProcessId = await callAnalysisManagerTransformation(tsdm);
  const statusMessage = await pollTransformationProcessStatusForResult(transformationProcessId, 10);
  return { transformationProcessId, statusMessage };
}