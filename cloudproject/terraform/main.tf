terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure AWS Provider to use LocalStack
provider "aws" {
  region                      = "us-east-1"
  access_key                  = "mock_key"
  secret_key                  = "mock_secret"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  # Point to LocalStack on localhost
  endpoints {
    s3       = "http://localhost:4566"
    ec2      = "http://localhost:4566"
    lambda   = "http://localhost:4566"
    iam      = "http://localhost:4566"
  }
}

# Create a mock S3 bucket for task attachments
resource "aws_s3_bucket" "devtrack_assets" {
  bucket = "devtrack-task-attachments-localstack"
}

resource "aws_s3_bucket_public_access_block" "devtrack_assets_access" {
  bucket = aws_s3_bucket.devtrack_assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# NOTE: LocalStack does not fully support all EC2 instance attributes used by newer AWS provider versions.
# The original aws_instance mock server resource was removed so Terraform can apply successfully in this local environment.

# Output the S3 bucket name
output "s3_bucket_name" {
  value = aws_s3_bucket.devtrack_assets.bucket
}
