terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

# Configure AWS Provider (Uses default credentials in ~/.aws/credentials)
provider "aws" {
  region = "us-east-1"
}

# 1. Free Tier S3 Bucket
resource "aws_s3_bucket" "devtrack_prod_assets" {
  bucket = "devtrack-prod-assets-${random_id.bucket_id.hex}"
}

resource "random_id" "bucket_id" {
  byte_length = 4
}

# Generate an SSH key pair
resource "tls_private_key" "devtrack_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "devtrack_key_pair" {
  key_name   = "devtrack-prod-key-${random_id.bucket_id.hex}"
  public_key = tls_private_key.devtrack_key.public_key_openssh
}

# 2. Security Group for EC2
resource "aws_security_group" "devtrack_sg" {
  name        = "devtrack_sg"
  description = "Allow HTTP and SSH traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Free Tier EC2 Instance (t2.micro)
resource "aws_instance" "devtrack_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS (us-east-1)
  instance_type = "t2.micro"
  key_name      = aws_key_pair.devtrack_key_pair.key_name
  
  vpc_security_group_ids = [aws_security_group.devtrack_sg.id]

  # User Data Script to install Docker on boot
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y apt-transport-https ca-certificates curl software-properties-common
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
              add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
              apt-get update -y
              apt-get install -y docker-ce docker-compose
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "DevTrack-Production"
  }
}

output "public_ip" {
  value = aws_instance.devtrack_server.public_ip
}
output "s3_bucket" {
  value = aws_s3_bucket.devtrack_prod_assets.bucket
}
output "private_key_pem" {
  value     = tls_private_key.devtrack_key.private_key_pem
  sensitive = true
}
