# My Health Chain Helm Chart

Helm chart for deploying My Health Chain to Kubernetes (Azure AKS, AWS EKS, etc.)

## Usage

```bash
# Create namespace and secrets (edit values first)
kubectl apply -f ../k8s/secrets.yml

# Install chart
helm install my-health-chain . --values values.yaml

# Upgrade
helm upgrade my-health-chain . --values values.yaml

# Uninstall
helm uninstall my-health-chain
```

## Directory Structure

```
helm/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── backend-deployment.yaml
    ├── postgres-statefulset.yaml
    ├── redis-deployment.yaml
    └── ingress.yaml
```

## Configuration

Edit `values.yaml` or create environment-specific files:
- `values-dev.yaml` — Development
- `values-prod.yaml` — Production (Azure, AWS)

Set secrets in `secrets.yml` before deployment.

## Azure AKS Deployment

```bash
# Create AKS cluster
az aks create --resource-group myResourceGroup --name myCluster --node-count 3

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name myCluster

# Deploy with Helm
helm install my-health-chain . -f values-prod.yaml --namespace mhc
```

## AWS EKS Deployment

```bash
# Create EKS cluster (use eksctl or AWS console)
eksctl create cluster --name my-health-chain --region us-east-1

# Deploy with Helm
helm install my-health-chain . -f values-prod.yaml --namespace mhc
```
