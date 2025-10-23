#!/bin/bash

echo "🚀 Creator Rewards Platform - Development Setup"
echo "================================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo ""
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo "   Please start PostgreSQL and ensure it's accessible."
    echo ""
    exit 1
fi

# Check if database exists
DB_NAME=${DB_NAME:-creator_rewards}
if ! psql -h localhost -p 5432 -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "🗄  Creating database '$DB_NAME'..."
    createdb -h localhost -p 5432 -U postgres $DB_NAME
    echo "✅ Database '$DB_NAME' created successfully."
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed successfully."
    echo ""
fi

echo "🎯 Starting development server..."
echo "   API will be available at: http://localhost:3000"
echo "   API Documentation at: http://localhost:3000/api/docs"
echo ""

npm run start:dev