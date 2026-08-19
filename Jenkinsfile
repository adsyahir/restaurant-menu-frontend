// Frontend CI/CD — runs ON the k3s server. No registry: build the Nuxt image,
// import into k3s' containerd, build the config from .env, then apply.
//
// Flow: typecheck -> build -> import -> configmap from .env -> apply -> roll.
//
// Jenkins prerequisites:
//   - agent has: docker, kubectl, envsubst, passwordless `sudo k3s`
//   - KUBECONFIG -> /etc/rancher/k3s/k3s.yaml (readable by jenkins)
//   - a "Secret file" credential 'rms-frontend-env' = the real frontend .env
pipeline {
  agent any

  triggers { githubPush() }

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    NS    = 'rms'
    IMAGE = 'restaurant-menu-frontend'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Typecheck') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app node:22-alpine \
            sh -c 'npm ci && npx nuxi typecheck'
        '''
      }
    }

    stage('Build + import') {
      steps {
        sh '''
          docker build -t $IMAGE:latest .
          docker save $IMAGE:latest | k3s ctr images import -
        '''
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([file(credentialsId: 'rms-frontend-env', variable: 'ENVFILE')]) {
          sh '''
            cp "$ENVFILE" k8s/.env.deploy

            # NUXT_PUBLIC_API_BASE etc. -> ConfigMap (from .env)
            kubectl -n $NS create configmap rms-frontend-config \
              --from-env-file=k8s/.env.deploy --dry-run=client -o yaml | kubectl apply -f -

            # deployment + service
            kubectl apply -k k8s/

            # ingress host from FRONTEND_HOST
            set -a; . k8s/.env.deploy; set +a
            envsubst '$FRONTEND_HOST' < k8s/ingress.yaml | kubectl apply -n $NS -f -

            kubectl -n $NS rollout restart deployment/rms-frontend
            kubectl -n $NS rollout status  deployment/rms-frontend --timeout=180s

            rm -f k8s/.env.deploy
          '''
        }
      }
    }
  }

  post {
    success { echo 'Frontend deployed.' }
    failure { echo 'Frontend pipeline failed — see stage logs.' }
  }
}
