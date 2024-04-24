# Airport Eagle Eye

## Overview
"Airport Eagle Eye" is a cutting-edge project developed for the YVR 2024 hackathon. This project leverages advanced computer vision technology using Yolo8 models to enhance airport safety, cleanliness, and maintenance. The application is designed to identify various incidents such as first aid requirements, water spills, lost items, and structural damages like tile or wall cracks.

## Key Features
- ### Yolo8 models
This application utilizes YOLO models for various monitoring and analysis purposes. It includes three main functionalities within the models folder:
- **Real-Time Incident Monitoring(detect_with_camera)**: Connects to on-site cameras to monitor and report anomalies instantly.
- **Desktop Supervision(detect_with_display)**: Monitors current screen/desktop for any unusual activities or requirements.
- **Video Analysis(detect_with_files)**: Analyzes pre-recorded videos to identify and report past incidents.

- ### Mobile App
- **Mobile Application Integration**: Includes features for incident notifications, task assignment, task review and archival, and user management.
- **Customizable Notifications**: Sends notifications based on user roles and emergency levels, ensuring that the right personnel are alerted.
- **Data Recyclability**: Manually filtered false alerts are used to retrain the Yolo models, enhancing the accuracy and efficiency of the system.

## Project Setup

### Requirements
To run the "Airport Eagle Eye" application, you need:
- A Google Firebase account with your own keys and authentication setup.
- Python environment with necessary libraries installed.

### How to run
- Run the mobile app on terminal
- Run the Yolo8 models on terminal

## Project Demo
- Please see the slides for project details
- Check demo on page 10-14
- https://docs.google.com/presentation/d/1OwX_GwnXP__qZI1o32-riwU4-yVbGjS1F3pA6QsRMuo/edit?usp=sharing](https://www.canva.com/design/DAGDXXiglps/6LtAnEoD3xhWic7M1fg6Zg/view
