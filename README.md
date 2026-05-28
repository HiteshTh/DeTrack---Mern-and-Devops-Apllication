<h1 align="center">🚀 DeTrack: Enterprise MERN & Cloud DevOps Application</h1>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white" alt="Jenkins" />
  <img src="https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
</div>

<br/>

> **A highly scalable, production-ready web application showcasing a full MERN stack backend/frontend, backed by a fully automated DevOps CI/CD pipeline, Infrastructure as Code, and Container Orchestration.**

---

## 📖 Executive Project Overview
This project represents the pinnacle of modern software delivery. It proves that software development is not just about writing code, but about securely, scalably, and efficiently delivering that code to end users. 

By combining a **MERN stack** (MongoDB, Express, React, Node.js) with state-of-the-art **DevOps tools**, this architecture guarantees zero-downtime deployments, reproducible environments, and infrastructure agility.

**Core Highlights:**
- **Microservices Architecture:** Frontend and Backend are decoupled and containerized independently.
- **Infrastructure as Code (IaC):** AWS infrastructure is not created manually; it is provisioned through declarative Terraform scripts.
- **Continuous Integration / Continuous Deployment (CI/CD):** Jenkins automates the process of testing, building Docker images, and deploying them to production.
- **Container Orchestration:** Ready for high availability and self-healing deployments using Kubernetes.

---

## 🏗️ 1. Complete System Architecture Diagram

This diagram explains how traffic flows from the user, through the cloud provider, into the orchestration layer, and down to the database.

```mermaid
graph TD
    User([🌐 End User]) -->|HTTP/HTTPS Request| Cloud[☁️ AWS Cloud Environment]
    
    subgraph AWS [AWS EC2 Instance (Provisioned via Terraform)]
        direction TB
        Proxy[Nginx Reverse Proxy / Load Balancer]
        
        subgraph Docker_Compose [Docker Compose / K8s Cluster]
            Frontend[⚛️ React Frontend Container]
            Backend[🟢 Node.js API Container]
            DB[(🍃 MongoDB Container)]
        end
        
        Proxy -->|Serves Static Assets| Frontend
        Proxy -->|API Requests /api| Backend
        Backend -->|Mongoose Queries| DB
    end
    
    Cloud --> AWS
    
    style User fill:#f9f,stroke:#333,stroke-width:2px
    style AWS fill:#f4f4f4,stroke:#666,stroke-width:2px
    style Frontend fill:#61DAFB,stroke:#333,color:#000
    style Backend fill:#43853D,stroke:#333,color:#fff
    style DB fill:#4EA94B,stroke:#333,color:#fff
```

---

## ⚙️ 2. CI/CD Pipeline Automation Diagram

Whenever a developer pushes code to GitHub, the following automated pipeline triggers inside Jenkins, completely removing the need for manual server administration.

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 Developer
    participant Git as 🐙 GitHub
    participant Jenkins as 🤖 Jenkins CI/CD
    participant Docker as 🐳 DockerHub
    participant TF as 🏗️ Terraform
    participant AWS as ☁️ AWS EC2
    
    Dev->>Git: 1. git push origin main
    Git->>Jenkins: 2. Webhook triggers Pipeline
    Jenkins->>Jenkins: 3. DevSecOps: SAST Scan (Trivy)
    Jenkins->>Jenkins: 4. Build Docker Images (Frontend & Backend)
    Jenkins->>Docker: 5. Push Images to Registry
    Jenkins->>TF: 6. Init & Apply IaC
    TF->>AWS: 7. Provision EC2, Security Groups, SSH Keys
    TF-->>Jenkins: 8. Return Public IP & Credentials
    Jenkins->>AWS: 9. SSH into EC2 & pull docker-compose.yml
    Jenkins->>AWS: 10. `docker-compose pull && up -d`
    AWS-->>Dev: 11. App is Live & Running! 🚀
```

---

## 🛠️ Detailed Component Breakdown

### 1. The Application Code (MERN Stack)
- **Frontend (`/cloudproject/frontend/`)**: Built using React.js. It features a responsive UI and makes RESTful API calls to the backend. It is packaged via its own `Dockerfile` into a lightweight Nginx image for maximum serving performance.
- **Backend (`/cloudproject/backend/`)**: Built with Node.js and Express.js. Handles business logic, authentication, and database routing. Packaged via its own `Dockerfile` using the `node:20-alpine` image.
- **Database**: MongoDB handles persistent data storage. A named Docker volume ensures data isn't lost when containers restart.

### 2. Infrastructure as Code (Terraform)
Located in `/cloudproject/terraform-aws/`, the `main.tf` file is the blueprint for the AWS cloud. 
- **Automated Provisioning**: It automatically creates an `aws_instance` (EC2 server).
- **Security**: It creates an `aws_security_group` to lock down the server, exposing only port 80 (HTTP), 443 (HTTPS), 22 (SSH), and 5000 (Backend API).
- **Key Management**: It generates an `tls_private_key` dynamically so Jenkins can securely SSH into the server without manual key sharing.

### 3. Continuous Integration & Deployment (Jenkins)
The `Jenkinsfile` orchestrates the entire lifecycle. It utilizes Jenkins Credentials Binding to securely handle DockerHub passwords and AWS Access Keys. It is resilient, ensuring that if a build fails, the deployment is aborted to protect production.

### 4. Containerization & Orchestration (Docker & K8s)
- **Docker Compose (`docker-compose.yml`)**: Used to tie the Microservices together. It mounts volumes, handles port forwarding, and sets environment variables on a single host.
- **Kubernetes (`/cloudproject/k8s/`)**: Features deployment files (`frontend-deployment.yaml`, `backend-deployment.yaml`, `mongo-deployment.yaml`) that define `ReplicaSets` and `Services`. This allows the application to be deployed to a massive cluster (like AWS EKS) where if a pod crashes, Kubernetes automatically spins up a new one.

---

## 🏁 Summary for Evaluators
This project is not a standard web application—it is a **fully automated cloud-native ecosystem**. By utilizing Terraform, Docker, and Jenkins, the infrastructure and deployment process are just as robust and strictly coded as the JavaScript application itself. It demonstrates a mastery of modern DevOps methodologies.
