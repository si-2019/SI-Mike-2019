pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
		dir("backend-kb"){ 
                    sh 'npm install'
		}
            }
        }
	stage('Run') {
	    steps {
		dir("backend-kb"){ 
                    sh './JenkinsSkripta.sh'
		}
	    }
	}
    }
}
