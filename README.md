# MyPath
MyPath
Identifying Surface Characteristics for Generating Personalized Accessible Routes for Wheelchair Users through Participatory Sensing

For more information, visit: https://mypathar.github.io/home/index.html

<p align="center">
    <img src="https://github.com/MU-Smart/MyPathApp/blob/main/ss/welcome_screen.PNG" alt="MyPath welcome screen" width="40%"/>
</p>


Welcome to the MyPath project. The purpose of this project is to build an accessible routing and navigation system for wheelchair users to get to their destination from any source location. We determine accessible routes by classifying surfaces from vibration data. In existing mapping systems, the developers rarely consider the experience of the persons with disabilities in most cases. For example, wheelchair users may encounter steep slopes or other barriers in the built environment which they cannot overcome, or uneven road surfaces and broken sidewalks that are not suitable for wheeled navigation. In order to solve this problem and improve the user experience, we proposed the MyPath solution. We analyze and classify the data collected by sensors and then using the ML model to predict any new surface data available during the testing phase of the system. The road surface information is then updated in a research-oriented open-source mapping system known as the OpenStreetMap (OSM). Finally, we combine the user’s personalized requirements and the accessibility of each road to generate an accessible route for wheelchair users through the use of Graphhopper API which is a dedicated routing engine for the OSM.

# Project Setup Documentation

This README outlines the necessary steps to set up and run the mobile application project. It includes instructions for cloning the project, installing dependencies, and running the application on an Android device. This guide also describes the architecture of the app, including its components and services.

## Prerequisites
Ensure the following tools are installed on your system before proceeding:
- Node.js and npm
- Yarn (optional, for iOS)
- Cocoapods (for iOS)
- Android Studio or Xcode (for running simulators)

## Setting Up the Project

### Cloning the Repository
1. Clone the project from the repository to your local machine.

### Navigating to the Project Directory
2. Open a command prompt or terminal and navigate to the project directory:
   ```bash
   cd MyPathApp