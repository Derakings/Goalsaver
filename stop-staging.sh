#!/bin/bash

# Colors for output
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping Goalsaver Staging Environment...${NC}"
docker-compose -f docker-compose.staging.yml down

echo -e "${GREEN}Staging environment stopped successfully!${NC}"
