pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'cd client/'
                sh 'pws'
            }
        }
    }
}
