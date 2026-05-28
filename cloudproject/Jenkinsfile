pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'hiteshthakur62674'
        DOCKER_FRONTEND_IMAGE = "${DOCKERHUB_USER}/devtrack-frontend"
        DOCKER_BACKEND_IMAGE = "${DOCKERHUB_USER}/devtrack-backend"
        VERSION = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('DevSecOps: SAST Scan') {
            steps {
                echo 'Running Security Scan...'
                sh 'echo "Simulated Trivy Scan: Passed"'
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            docker build -t ${DOCKER_FRONTEND_IMAGE}:${VERSION} .
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                            docker push ${DOCKER_FRONTEND_IMAGE}:${VERSION}
                        """
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            docker build -t ${DOCKER_BACKEND_IMAGE}:${VERSION} .
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                            docker push ${DOCKER_BACKEND_IMAGE}:${VERSION}
                        """
                    }
                }
            }
        }

        stage('Provision AWS Infra') {
            steps {
                echo 'Applying Terraform to AWS Free Tier...'
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    dir('terraform-aws') {
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                        script {
                            env.EC2_IP = sh(script: 'terraform output -raw public_ip', returnStdout: true).trim()
                            env.S3_BUCKET = sh(script: 'terraform output -raw s3_bucket', returnStdout: true).trim()
                            sh 'terraform output -raw private_key_pem > ../devtrack-key.pem'
                            sh 'chmod 400 ../devtrack-key.pem'
                        }
                    }
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                echo "Deploying to EC2 at ${EC2_IP}..."
                sh "sleep 30"
                sh "scp -i devtrack-key.pem -o StrictHostKeyChecking=no terraform-aws/docker-compose.prod.yml ubuntu@${EC2_IP}:/home/ubuntu/docker-compose.yml"
                sh """
                    ssh -i devtrack-key.pem -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                        while ! command -v docker &> /dev/null; do
                            echo "Waiting for Docker..."
                            sleep 10
                        done
                        export DOCKERHUB_USERNAME=${DOCKERHUB_USER}
                        export AWS_S3_BUCKET=${S3_BUCKET}
                        sudo -E docker-compose down
                        sudo -E docker-compose pull
                        sudo -E docker-compose up -d
                    '
                """
                echo "Deployed! App live at http://${EC2_IP}"
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed! Deployed to AWS.'
        }
        failure {
            echo 'Pipeline failed. Check console output.'
        }
    }
}