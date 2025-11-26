#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Starting Goalsaver Staging Environment${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Stop any existing containers
echo -e "\n${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.staging.yml down

# Build and start services
echo -e "\n${YELLOW}Building and starting services...${NC}"
docker-compose -f docker-compose.staging.yml up --build -d

# Wait for services to be healthy
echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"
sleep 5

# Check service status
echo -e "\n${GREEN}Service Status:${NC}"
docker-compose -f docker-compose.staging.yml ps

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}   Goalsaver Staging Environment Started!${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "\n${BLUE}Frontend:${NC}  http://localhost:3001"
echo -e "${BLUE}Backend:${NC}   http://localhost:3000"
echo -e "${BLUE}Database:${NC}  postgresql://goalsaver:goalsaver_staging_password@localhost:5432/goalsaver"
echo -e "\n${YELLOW}View logs:${NC}     docker-compose -f docker-compose.staging.yml logs -f"
echo -e "${YELLOW}Stop services:${NC} docker-compose -f docker-compose.staging.yml down"
echo -e "${YELLOW}Restart:${NC}       docker-compose -f docker-compose.staging.yml restart"
echo -e "\n"
