# DeMAF WebUI Usage

## Introduction to DeMAF

The *Deployment Model Abstraction Framework* (DeMAF) is a tool that enables the transformation of a *technology-specific deployment model* (TSDM) into a *technology-agnostic deployment model* (TADM) which is modeled based on the *Essential Deployment Metamodel* (EDMM).
Additionally, it has a built-in visualization tool for the created TADM.
DeMAF is still in development, some features may not work as intended and the behavior might change

## Getting Started

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/initial_ui.png" alt="The initial web UI" width=80% />
</p>

### Summary

To transform a TSDM, its corresponding file(s) must be *uploaded*, and its deployment *technology* must be specified.
A *flattening option* can be set as well.
Optionally, additional options relating the visualizations and the command which is used to start the deployment (i.e. a bash script) can be provided too.
The transformation is started by clicking on the "Transform" button and a spinning gear icon indicates that the transformation is in progress.
This may take some time on the first start, as the plugins have to prepare for the initial transformation.
After a successful transformation, a new tab is opened with the loading visualization tool.
This may take some time as well, depending on the amount of prior transformations.

The web UI supports multiple tooltips which can help you get started as well.

### Step 1: Uploading

The DeMAF web interface provides two options for uploading TSDM files.
You can either choose to upload a single file or a folder that includes all multiple files (for the same TSDM).

#### Uploading a single file

1. Click on "Select File" and your system's file explorer pops up.
2. Select your file and click on "Open".
3. Now your file is uploaded! 
   A new text field will appear that shows your uploaded file name.

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/file_select.png" alt="File was uploaded" width=80% />
</p>

#### Uploading a folder with multiple files

1. Click on "Select Folder" and your system's file explorer pops up.
2. Click on the folder and press on "Upload".
3. Now your folder is uploaded!  
   A new input field will appear where you need to specify the relative path from the uploaded folder to the main entry file of your TSDM.
   E.g., for *Terraform* this is usually a file called `main.tf`.

### Step 2: Selecting the Technology

Next click on "Technology" to choose the technology of your TSDP.
All registered plugins will be listed.
As of writing this documentation, the following technologies are available:
- Ansible
- Bash
- Helm
- Kubernetes
- Terraform

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/technology.png" alt="Technology selection" width=80% />
</p>

### Step 3: Additional Commands (Optional)

You may specify how the deployment model is executed (e.g., for Terraform, you can pass parameters for the execution plan) in the "Deployment Command(s)" input field, separated with a comma.
For example: `start.sh,provision.sh`

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/deploy_commands.png" alt="Deployment command(s)" width=80% />
</p>

### Step 4: Selecting Options (Optional)

You may provide a list of visualization flags, separated by comma.
Currently, the following flags can be provided in the "Options" input field:

- `width=pixel` (default: `1920`)
- `height=pixel` (default: `1080`)
- `dpi=dots` per inch of your monitor (default: `96`; use `144` for high-dpi monitors)
- Example: `width=1920,height=1080,dpi=96`  

The options are optional and not mandatory for the transformation process.
**Don't** use spaces between multiple options flags.

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/options.png" alt="Options" width=80% />
</p>

### Step 5: Select a flatten Option (Optional)

You may select the visualization flattening options `false`, `true` and `partial` which flattens some levels of the visualization. 
`false` means no flattening, `true` means maximal flattening and `partial` means some levels are flattened.
The default is `false`.

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/flatten.png" alt="Flatten options" width=80% />
</p>

### Step 6: Start Transformation

After you provided the input file(s) and the technology you can start the transformation by pressing the "Transform" button.
A spinning gear icon shows that the transformation is in progress, additionally the transform button is disabled.

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/progress.png" alt="Transformation in progress" width=80% />
</p>

If you want to save your settings click the "Store settings" check box before the transformation.

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/store_settings.png" alt="Store Settings option" width=80% />
</p>

When the transformation has finished a new tab will open up, containing the visualization.
The loading of the visualization may takes some time.

If, at any point, an error should occur, the following error will be shown:

<p style="display: flex; justify-content: space-around; align-items: center; width: 100%;">
    <img src="figures/error.png" alt="Error during transformation" width=80% />
</p>

## Visualization / TADM Usage

### Navigation in the Visualization

Left-click once, within an empty space of the visualization.
Now, you have the following options for the navigation:

- Arrow-buttons
- Scroll-wheel (up/down and left/right if your mouse supports it)
- Scroll-bars (not supported by all Browsers)
- Press the scroll-wheel (Windows only)
- Trackpad or touch input

### Options in the Visualization

In the upper row of the visualization you can click on the following buttons:

- **Types**: Shows the types of each component
- **Properties**: Shows the properties of each component
- **Artifacts**: Shows the artifacts of each component

Additionally, you can drag components by holding left-click on them.
