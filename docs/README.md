## Introduction

The Deployment Model Abstraction Framework (DeMAF) is a tool that enables transforming technology-specific deployment models (TSDMs) into technology-agnostic deployment models (TADMs) that are modeled based on the Essential Deployment Metamodel (EDMM). Additionally, it has a built-in visualization tool for the created TADM.

## Getting Started

### Summery

To transform a technology-specific deployment model (TSDM), its corresponding files must be uploaded, and its deployment technology must be selected.  
Options relating to the visualizations can then be selected and additional commands can be transferred in the text field.  
The transformation is started by clicking on the transformation button.
The current transformation is now represented in the center of the screen by a spinning gear icon.  
The transformation may take some time.  
After a successful transformation, a new tab is opened within the page and the visualization tool is loaded.  

### Step 1: Uploading

The DeMAF web interface provides two options for uploading the technology-specific deployment model (TSDM) files. You have the choice to either upload a single file as your TSDM file or a folder that includes all TSDM files.

#### Uploading a file

Click on "Select File" and your system file explorer pops up that lets you choose your file. Select your file and click on "Open". Now your file is uploaded!

#### Uploading a folder

Click on "Select Folder" and your system file explorer pops up that lets you choose your folder. Click on the folder and press on "Upload". Now your folder is uploaded!  
A new input field will appear where you need to specify the relative path from the folder to the start file.

### Step 2: Selecting the Technology

Next click on "Technology" to choose the technology in which your TSDM is created.

### (Optional) Selecting Options

Optionally, you can select one the visualization options "Flat" and "Partial" which flattens some levels of the visualization. "Flat" means a maximal amount of flattening and "partial" means some levels are flattened.  
Here is an example:

### (Optional) Additional commands

Optionally, you can specify how the deployment model is executed (e.g., for Terraform, you can pass parameters for the execution plan) in the "Commands" input field.

## Visualization / TADM Usage
