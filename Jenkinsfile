pipeline {
    agent any

    environment {
        IMAGE_NAME = "soura1598/shopapi"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '========== Checking out code =========='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '========== Installing dependencies =========='
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                echo '========== Running tests =========='
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '========== Building Docker image =========='
                script {
                    dockerImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '========== Pushing to Docker Hub =========='
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        dockerImage.push("${env.BUILD_NUMBER}")
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '========== Deployment Summary =========='
                echo "Image: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                echo "Status: Successfully deployed!"
            }
        }
    }

    post {
        success {
            echo 'Pipeline SUCCESS!'
        }
        failure {
            echo 'Pipeline FAILED!'
        }
    }
}