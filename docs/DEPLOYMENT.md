# Deployment Guide - My Health Chain

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional but recommended)

### Quick Setup

```powershell
# 1. Generate keys
node .\local\generate_keys.js
node .\backend\scripts\generate-aes-key.js

# 2. Start infrastructure
cd infra/docker
docker-compose up -d

# 3. Initialize database
cd ..\..\sql
psql -U postgres -d mhc -f schema.sql

# 4. Start backend
cd ..\backend
npm ci
npm run seed
npm run dev

# 5. Start frontend (in new terminal)
cd ..\frontend
npm ci
npm run dev

# 6. Start mobile (optional, in new terminal)
cd ..\mobile
npm ci
npm start
```

**Endpoints:**
- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- Mobile: Expo app (Android/iOS/Web)

---

## Azure AKS Deployment

### Prerequisites
- Azure CLI installed
- kubectl installed
- Helm 3+ installed

### Steps

```bash
# 1. Create AKS cluster
az aks create \
  --resource-group my-health-chain \
  --name mhc-cluster \
  --node-count 3 \
  --vm-set-type VirtualMachineScaleSets \
  --load-balancer-sku standard

# 2. Get credentials
az aks get-credentials \
  --resource-group my-health-chain \
  --name mhc-cluster

# 3. Create namespace
kubectl create namespace mhc

# 4. Create secrets (IMPORTANT: update with real values)
kubectl create secret generic mhc-secrets \
  --from-literal=database-url="postgresql://user:pass@mhc-postgres:5432/mhc" \
  --from-literal=jwt-secret="your-strong-jwt-secret" \
  --from-literal=aes-master-key="base64-encoded-32-byte-key" \
  --from-literal=postgres-password="your-postgres-password" \
  -n mhc

# 5. Deploy with Helm
cd infra/helm
helm install my-health-chain . \
  --values values.yaml \
  --values values-prod.yaml \
  --namespace mhc

# 6. Monitor deployment
kubectl get pods -n mhc -w
```

### Configure Ingress (Optional)

For public access via Azure Application Gateway or NGINX Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mhc-ingress
  namespace: mhc
spec:
  ingressClassName: azure-application-gateway
  rules:
  - host: myhealthchain.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: mhc-backend-svc
            port:
              number: 80
```

---

## AWS EKS Deployment

### Prerequisites
- AWS CLI configured
- eksctl or AWS CloudFormation
- kubectl and Helm

### Steps

```bash
# 1. Create EKS cluster (using eksctl)
eksctl create cluster \
  --name my-health-chain \
  --region us-east-1 \
  --nodegroup-name standard-nodes \
  --node-type t3.medium \
  --nodes 3

# 2. Get kubeconfig
aws eks update-kubeconfig \
  --region us-east-1 \
  --name my-health-chain

# 3. Create namespace
kubectl create namespace mhc

# 4. Create secrets (IMPORTANT: update with real values)
kubectl create secret generic mhc-secrets \
  --from-literal=database-url="postgresql://user:pass@mhc-postgres:5432/mhc" \
  --from-literal=jwt-secret="your-strong-jwt-secret" \
  --from-literal=aes-master-key="base64-encoded-32-byte-key" \
  --from-literal=postgres-password="your-postgres-password" \
  -n mhc

# 5. Deploy with Helm
cd infra/helm
helm install my-health-chain . \
  --values values.yaml \
  --values values-prod.yaml \
  --namespace mhc

# 6. Monitor
kubectl get pods -n mhc -w
```

### Configure ALB/NLB

Use AWS Load Balancer Controller for ingress:

```bash
# Install ALB controller
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system
```

---

## Safaricom Cloud Deployment

Safaricom Cloud provides managed Kubernetes (similar to AKS/EKS):

```bash
# 1. Configure Safaricom CLI credentials
safaricom-cli auth login

# 2. Create cluster
safaricom-cli k8s cluster create \
  --name my-health-chain \
  --nodes 3 \
  --region east-africa

# 3. Get kubeconfig
safaricom-cli k8s kubeconfig get --cluster-name my-health-chain

# 4-5. Follow Azure/AWS steps for namespace, secrets, and Helm deployment
```

---

## Production Checklist

Before going live, ensure:

- [ ] **Secrets Management**: Use cloud KMS (Azure Key Vault, AWS Secrets Manager, Safaricom KMS)
- [ ] **Database Backups**: Enable automated backups and point-in-time recovery
- [ ] **SSL/TLS**: Configure HTTPS with valid certificates
- [ ] **Monitoring**: Set up CloudWatch, Azure Monitor, or Prometheus + Grafana
- [ ] **Logging**: Centralize logs with ELK Stack or cloud-native solution
- [ ] **RBAC**: Configure Kubernetes RBAC policies
- [ ] **Network Policies**: Restrict pod-to-pod communication
- [ ] **Pod Security Policies**: Enforce container security standards
- [ ] **Autoscaling**: Configure HPA (Horizontal Pod Autoscaler)
- [ ] **Resource Quotas**: Set CPU/memory limits per namespace
- [ ] **Health Checks**: Verify liveness and readiness probes
- [ ] **Disaster Recovery**: Test backup and restore procedures
- [ ] **Compliance**: Ensure GDPR/HIPAA compliance for medical data

---

## Scaling & Performance

### Horizontal Scaling

```bash
# Scale backend replicas
kubectl scale deployment mhc-backend --replicas=5 -n mhc

# Enable Horizontal Pod Autoscaler
kubectl autoscale deployment mhc-backend \
  --min=3 \
  --max=10 \
  --cpu-percent=80 \
  -n mhc
```

### Database Optimization

- Use connection pooling (PgBouncer)
- Enable read replicas for analytics
- Archive old records to cold storage
- Implement database sharding if needed

---

## Troubleshooting

```bash
# Check pod logs
kubectl logs <pod-name> -n mhc

# Describe pod for events
kubectl describe pod <pod-name> -n mhc

# Port-forward for debugging
kubectl port-forward svc/mhc-backend-svc 4000:80 -n mhc

# Check resource usage
kubectl top nodes
kubectl top pods -n mhc
```

---

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:
1. Builds Docker images
2. Pushes to registry
3. Triggers Helm deployment

Configure secret environment variables in GitHub:
- `DOCKER_REGISTRY_URL`
- `DOCKER_USERNAME` / `DOCKER_PASSWORD`
- `KUBE_CONFIG` (base64 encoded)
- `HELM_REPO_URL`

---

## Support & Documentation

- **Architecture**: See `/docs/ARCHITECTURE.md`
- **API Docs**: Swagger available at `GET /api/docs`
- **Database**: ERD in `/docs/ERD.md`
- **Backend**: `/backend/README.md`
- **Frontend**: `/frontend/README.md`
- **Mobile**: `/mobile/README.md`
