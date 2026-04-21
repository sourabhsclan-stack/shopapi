pipeline {
    agent any

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
                echo '========== Build Docker Image =========='
                echo 'Docker build runs in GitHub Actions pipeline'
                echo "Image would be: soura1598/shopapi:${env.BUILD_NUMBER}"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '========== Push to Docker Hub =========='
                echo 'Push runs in GitHub Actions pipeline'
            }
        }

        stage('Deploy') {
            steps {
                echo '========== Deployment Summary =========='
                echo "Build: #${env.BUILD_NUMBER}"
                echo 'Pipeline completed successfully!'
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