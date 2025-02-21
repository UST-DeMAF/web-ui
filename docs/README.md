## Introduction

The Deployment Model Abstraction Framework (DeMAF) is a tool that enables transforming technology-specific deployment models (TSDMs) into technology-agnostic deployment models (TADMs) that are modeled based on the Essential Deployment Metamodel (EDMM). Additionally, it has a built-in visualization tool for the created TADM. DeMAF is currently still in development, some features may not work as intended.

## Getting Started

### Summery

To transform a technology-specific deployment model (TSDM), its corresponding files must be uploaded, and its deployment technology must be selected.  
A flattening can be selected and additional options relating to the visualizations and commands how to start the transformation can be provided in their text fields.  
The transformation is started by clicking on the transformation button and a spinning gear icon shows that the transformation is in progress. After a successful transformation, a new tab is opened with the loading visualization tool. This may take some time to load.

### Step 1: Uploading

The DeMAF web interface provides two options for uploading the technology-specific deployment model (TSDM) files. You have the choice to either upload a single file as your TSDM file or a folder that includes all TSDM files.

#### Uploading a file

Click on "Select File" and your system file explorer pops up that lets you choose your file. Select your file and click on "Open". Now your file is uploaded! A new text field will appear that shows your uploaded file name.

#### Uploading a folder

Click on "Select Folder" and your system file explorer pops up that lets you choose your folder. Click on the folder and press on "Upload". Now your folder is uploaded!  
A new input field will appear where you need to specify the relative path from the folder to the start file.

### Step 2: Selecting the Technology

Next click on "Technology" to choose the technology in which your TSDM is created.

### (Optional) Additional commands

Optionally, you can specify how the deployment model is executed (e.g., for Terraform, you can pass parameters for the execution plan) in the "Commands" input field, separated with a comma.

### (Optional) Select Flatten

Optionally, you can select the visualization flatting options "false", "true" and "partial" which flattens some levels of the visualization. "false" means no flattening, "true" means a maximal amount of flattening and "partial" means some levels are flattened. This option standard value is "false".

### (Optional) Selecting Options

You can provide a list of visualization flags, separated with a comma. Flags which can be provided in the options field are:

- `height=pixel` (default: `1080` (pixels))
- `width=pixel` (default: `1920` (pixels))
- `dpi=dots` per inch of your monitor (default: `96` (dpi))
- Example: `dpi=96,width=1920,height=1080`  

The options are optional and not mandatory for the transformation process. Don't use spaces between multiple options flags.

### Final Step: Start Transformation

After you provided the input file(s) and the technology you can start the transformation by pressing the "transformation" button. A spinning gear icon shows that the transformation is in progress, additionally the transform button is disabled. If you want to save your uploaded file(s) and input click the "Store settings" check box before the transformation.

When the transformation has finished a new tab will pop up containing the visualization. The loading of the visualization may takes some time.

## Visualization / TADM Usage

### Navigation in the Visualization

Left-click once within an empty space of the visualization. Now you have the following options for the navigation:

- Arrow-buttons
- scroll mouse wheel (only up and down)
- Shown scroll-bars (not all Browser supported)
- press mouse wheel (windows only)
- touchpad (= magic mouse)

### Options in the Visualization

In the upper row of the visualization you can click on the following buttons:

- Types - Shows the types of each component
- Properties - Shows the properties of each component
- Artifacts - Shows the artifacts of each component

Additionally, you can drag components with holding left click on them.
