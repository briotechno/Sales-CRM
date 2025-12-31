# HRM Policies API Documentation

## 1. Table Creation (SQL)

```sql
-- Terms & Conditions Table
CREATE TABLE IF NOT EXISTS hr_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Company Policies Table
CREATE TABLE IF NOT EXISTS company_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    effective_date DATE NOT NULL,
    review_date DATE NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    description TEXT,
    author VARCHAR(255),
    status ENUM('Active', 'Under Review', 'Archived') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- HR Policies Table
CREATE TABLE IF NOT EXISTS hr_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    effective_date DATE NOT NULL,
    review_date DATE NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    department VARCHAR(255),
    applicable_to ENUM('all', 'specific') DEFAULT 'all',
    status ENUM('Active', 'Under Review', 'Archived') DEFAULT 'Active',
    document_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 2. Postman Collection (Complete CRUD)

Copy the JSON below and import it into Postman.

```json
{
	"info": {
		"_postman_id": "a1b2c3d4-e5f6-4a5b-6c7d-8e9f0a1b2c3d",
		"name": "HRM Management System - Policies",
		"description": "Full CRUD operations for Terms, Company Policies, and HR Policies",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "1. Terms & Conditions",
			"item": [
				{
					"name": "Add Term",
					"request": {
						"method": "POST",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"department\": \"HR\",\n    \"designation\": \"Manager\",\n    \"title\": \"Remote Work Policy\",\n    \"description\": \"Standard terms for remote working...\"\n}",
							"options": { "raw": { "language": "json" } }
						},
						"url": { "raw": "{{BASE_URL}}/api/terms", "host": ["{{BASE_URL}}"], "path": ["api", "terms"] }
					}
				},
				{
					"name": "Get All Terms",
					"request": {
						"method": "GET",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { 
							"raw": "{{BASE_URL}}/api/terms?department=HR&search=Remote", 
							"host": ["{{BASE_URL}}"], 
							"path": ["api", "terms"],
							"query": [
								{ "key": "department", "value": "HR" },
								{ "key": "search", "value": "Remote" }
							]
						}
					}
				},
				{
					"name": "Get Term By ID",
					"request": {
						"method": "GET",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/terms/1", "host": ["{{BASE_URL}}"], "path": ["api", "terms", "1"] }
					}
				},
				{
					"name": "Update Term",
					"request": {
						"method": "PUT",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"department\": \"HR\",\n    \"designation\": \"Manager\",\n    \"title\": \"Updated Policy Title\",\n    \"description\": \"Updated policy description...\"\n}",
							"options": { "raw": { "language": "json" } }
						},
						"url": { "raw": "{{BASE_URL}}/api/terms/1", "host": ["{{BASE_URL}}"], "path": ["api", "terms", "1"] }
					}
				},
				{
					"name": "Delete Term",
					"request": {
						"method": "DELETE",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/terms/1", "host": ["{{BASE_URL}}"], "path": ["api", "terms", "1"] }
					}
				}
			]
		},
		{
			"name": "2. Company Policies",
			"item": [
				{
					"name": "Add Policy",
					"request": {
						"method": "POST",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"title\": \"Code of Conduct\",\n    \"category\": \"General\",\n    \"effective_date\": \"2024-01-01\",\n    \"review_date\": \"2025-01-01\",\n    \"version\": \"1.0\",\n    \"description\": \"Be professional.\",\n    \"author\": \"HR Dept\",\n    \"status\": \"Active\"\n}",
							"options": { "raw": { "language": "json" } }
						},
						"url": { "raw": "{{BASE_URL}}/api/company-policies", "host": ["{{BASE_URL}}"], "path": ["api", "company-policies"] }
					}
				},
				{
					"name": "Get All Policies",
					"request": {
						"method": "GET",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/company-policies", "host": ["{{BASE_URL}}"], "path": ["api", "company-policies"] }
					}
				},
				{
					"name": "Get Policy By ID",
					"request": {
						"method": "GET",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/company-policies/1", "host": ["{{BASE_URL}}"], "path": ["api", "company-policies", "1"] }
					}
				},
				{
					"name": "Update Policy",
					"request": {
						"method": "PUT",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"title\": \"Updated Policy\",\n    \"category\": \"IT\",\n    \"effective_date\": \"2024-01-01\",\n    \"review_date\": \"2025-01-01\",\n    \"version\": \"2.0\",\n    \"description\": \"Updated text...\",\n    \"author\": \"IT Head\",\n    \"status\": \"Under Review\"\n}",
							"options": { "raw": { "language": "json" } }
						},
						"url": { "raw": "{{BASE_URL}}/api/company-policies/1", "host": ["{{BASE_URL}}"], "path": ["api", "company-policies", "1"] }
					}
				},
				{
					"name": "Delete Policy",
					"request": {
						"method": "DELETE",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/company-policies/1", "host": ["{{BASE_URL}}"], "path": ["api", "company-policies", "1"] }
					}
				}
			]
		},
		{
			"name": "3. HR Policies",
			"item": [
				{
					"name": "Add Policy (Form Data)",
					"request": {
						"method": "POST",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"body": {
							"mode": "formdata",
							"formdata": [
								{ "key": "title", "value": "Attendance Policy", "type": "text" },
								{ "key": "category", "value": "Attendance", "type": "text" },
								{ "key": "description", "value": "Must be on time.", "type": "text" },
								{ "key": "effective_date", "value": "2024-01-01", "type": "text" },
								{ "key": "review_date", "value": "2025-01-01", "type": "text" },
								{ "key": "status", "value": "Active", "type": "text" },
								{ "key": "document", "type": "file", "src": [], "description": "Choose a PDF/DOC file" }
							]
						},
						"url": { "raw": "{{BASE_URL}}/api/hr-policies", "host": ["{{BASE_URL}}"], "path": ["api", "hr-policies"] }
					}
				},
				{
					"name": "Get All Policies",
					"request": {
						"method": "GET",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/hr-policies", "host": ["{{BASE_URL}}"], "path": ["api", "hr-policies"] }
					}
				},
				{
					"name": "Get Policy By ID",
					"request": {
						"method": "GET",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/hr-policies/1", "host": ["{{BASE_URL}}"], "path": ["api", "hr-policies", "1"] }
					}
				},
				{
					"name": "Update Policy (Form Data)",
					"request": {
						"method": "PUT",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"body": {
							"mode": "formdata",
							"formdata": [
								{ "key": "title", "value": "Updated Attendance Policy", "type": "text" },
								{ "key": "category", "value": "Attendance", "type": "text" },
								{ "key": "description", "value": "Updated rule set.", "type": "text" },
								{ "key": "effective_date", "value": "2024-01-01", "type": "text" },
								{ "key": "review_date", "value": "2025-01-01", "type": "text" },
								{ "key": "document", "type": "file", "src": [] }
							]
						},
						"url": { "raw": "{{BASE_URL}}/api/hr-policies/1", "host": ["{{BASE_URL}}"], "path": ["api", "hr-policies", "1"] }
					}
				},
				{
					"name": "Delete Policy",
					"request": {
						"method": "DELETE",
						"header": [
							{ "key": "Authorization", "value": "Bearer {{TOKEN}}", "type": "text" }
						],
						"url": { "raw": "{{BASE_URL}}/api/hr-policies/1", "host": ["{{BASE_URL}}"], "path": ["api", "hr-policies", "1"] }
					}
				}
			]
		}
	],
	"variable": [
		{ "key": "BASE_URL", "value": "http://localhost:5000" },
		{ "key": "TOKEN", "value": "your_token_here" }
	]
}
```
