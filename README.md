# VaultShare

## Secure File Sharing Platform

VaultShare is a secure file-sharing platform that allows verified users to exchange files with strict access control, time-bound availability, and full auditability. Files can only be shared between registered VaultShare users, ensuring controlled and authenticated access.

## Features

- Verified-user-only file sharing
- Time-limited file access with automatic expiry
- Presigned, temporary S3 download URLs
- Sender visibility into file views and downloads
- Secure authentication and authorization
- Audit logging and monitoring of access events

## Tech Stack

### Frontend
- Next.js

### Authentication
- AWS Cognito

### Backend & APIs
- AWS Lambda
- Amazon API Gateway

### Storage & Database
- Amazon S3
- Amazon DynamoDB

### Monitoring & Logging
- Amazon CloudWatch

## Architecture Overview

- Users authenticate via AWS Cognito.
- Authenticated requests are routed through API Gateway to Lambda functions.
- Files are stored privately in S3 with no public access.
- Presigned S3 URLs are generated on demand with strict expiration times.
- File metadata, access status, and expiry information are stored in DynamoDB.
- Sender activity (views/downloads) is tracked and logged.
- CloudWatch dashboards and alerts monitor authentication and API behavior.

## Security Design

- IAM roles follow a strict least-privilege model.
- Lambda functions have scoped permissions for S3 and DynamoDB.
- API requests are validated for user identity, access rights, and file expiry.
- Public access to storage resources is disabled.
- Temporary access is revoked automatically after expiration.

## Getting Started

### Prerequisites
- Node.js
- AWS account with Cognito, S3, DynamoDB, Lambda, and API Gateway configured

npm install
