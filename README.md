<h1 align="center">🚀 DeVTrack: MERN & DevOps Application</h1>

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

> **An enterprise-grade Web Application featuring a complete MERN stack combined with a fully automated, modern DevOps CI/CD pipeline.**

## 📖 Project Overview for Evaluators
This project demonstrates the complete lifecycle of modern software engineering. It not only includes a functional Full-Stack Web Application (MERN) but also incorporates advanced **DevOps practices**: Containerization, Infrastructure as Code (IaC), Continuous Integration/Continuous Deployment (CI/CD), and Cloud Provisioning.

**Without looking at individual files, here is exactly what powers this project:**
1. **Frontend**: React application for a dynamic user interface.
2. **Backend**: Node.js & Express.js RESTful API.
3. **Database**: MongoDB for NoSQL data storage.
4. **Containerization**: Docker & Docker Compose to ensure the app runs identically across all environments.
5. **CI/CD Automation**: A fully scripted Jenkins Pipeline to build, test, and deploy code automatically.
6. **Infrastructure as Code**: Terraform scripts that automatically provision AWS EC2 servers and S3 buckets.
7. **Orchestration**: Kubernetes deployment files for scalable container management.

---

## 🏗️ Architecture & CI/CD Flow Diagram

```mermaid
flowchart TD
    subgraph Developer [Developer Workflow]
        A[Developer] -->|git push| B(GitHub Repository)
    end

    subgraph CI_CD [Jenkins CI/CD Pipeline]
        B -->|Triggers| C{Jenkins}
        C -->|Stage 1| D[Checkout Source Code]
        D -->|Stage 2| E[DevSecOps: SAST Scan]
        E -->|Stage 3| F[Build Docker Images]
        F -->|Stage 4| G[Push to DockerHub]
        G -->|Stage 5| H[Terraform: Provision AWS EC2]
        H -->|Stage 6| I[Deploy via Docker-Compose/K8s to EC2]
    end

    subgraph Cloud [AWS Cloud Environment]
        I --> J[AWS EC2 Instance]
        J --> K[Frontend Container :80]
        J --> L[Backend Container :5000]
        J --> M[(MongoDB Container)]
    end
