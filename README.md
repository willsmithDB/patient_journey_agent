# Databricks HLS Patient Journey Agent

A comprehensive healthcare AI assistant built on Databricks using HealthVerity's real-world healthcare dataset. This project demonstrates how to create, deploy, evaluate, and monitor clinical AI agents that can help healthcare professionals analyze patient healthcare journeys including medical claims, pharmacy data, diagnoses, and procedures.

## DISCLAIMER - this code is for reference and not an official Databricks asset. There are no assurances nor guarantees on this for working in any environment. Use for educational purposes only. See LICENSE for more details. 

## Databricks Runtime - **16.4 Machine Learning LTS (includes Apache Spark 3.5.2, Scala 2.13)**

Additional compatibility are currently being tested. 

If you see any errors please rollback to this runtime. 

## 🏥 Overview

The Patient Journey Assistant is designed to follow the workflow of a healthcare provider analyzing patient data to make informed clinical decisions. It enables healthcare professionals to quickly understand a patient's healthcare journey across medical claims, pharmacy data, diagnoses, and procedures using HealthVerity's real-world healthcare dataset.

### Key Capabilities

- **Patient Enrollment Analysis**: Retrieve patient demographics, enrollment periods, and benefit information
- **Medical Claims Analysis**: Access detailed medical claims data including procedures and healthcare services
- **Pharmacy Claims Tracking**: Analyze prescription history, NDC codes, and medication dispensing patterns
- **Diagnosis Code Analysis**: Extract and analyze patient diagnosis codes and medical conditions
- **Procedure Analysis**: Review healthcare procedures, codes, and associated costs
- **Conversational Interface**: Natural language interaction powered by large language models
- **Comprehensive Monitoring**: Built-in evaluation and monitoring framework for safety and accuracy

## 🏗️ Architecture

### Components

1. **HealthVerity Patient Journey Tools** (`01_create_patient_journey_tools.py`)
   - SQL functions for accessing HealthVerity's real-world healthcare dataset
   - Unity Catalog function registration for patient enrollment, medical claims, pharmacy claims, diagnoses, and procedures
   - Data retrieval and analysis tools for comprehensive healthcare data
   - Configuration-driven parameter management

2. **Agent Implementation** (`notebooks/`)
   - **Primary Agent** (`agent.py`): Claude 3.7 Sonnet-powered conversational agent
   - **Base Agent** (`base_agent.py`): Alternative configuration with enhanced prompt engineering
   - **Configuration Management** (`config.yaml`): Centralized parameter control
   - LangChain/LangGraph-based architecture with MLflow integration
   - Tool orchestration and response generation

3. **Chat Application** (`application/`)
   - **Web Interface**: Modern, responsive chat UI built with React and Express
   - **Real-time Communication**: Direct integration with Databricks serving endpoints
   - **Sample Queries**: Pre-built healthcare query templates
   - **Databricks Apps**: Ready for deployment as a Databricks lakehouse application
   - See [application/README.md](application/README.md) for setup and deployment instructions

4. **Evaluation Framework** (`03_agent_evaluations.ipynb`)
   - Automated evaluation data generation
   - Performance metrics and benchmarking
   - Quality assessment workflows

5. **Monitoring System** (`04_online_monitoring.ipynb`)
   - Real-time response monitoring
   - Safety and groundedness assessments
   - Custom guidelines enforcement

## 🚀 Quick Start

### Prerequisites

- Databricks workspace with Unity Catalog enabled
- Access to HealthVerity dataset (`HealthVerity_Claims_Sample_Patient_Dataset.hv_claims_sample` catalog)
   - You can create a read-only catalog from the Databricks Marketplace under Claims Sample Patient Dataset
- MLflow and AI Agent Framework permissions

### Installation

1. **Install Dependencies**
   ```bash
   pip install -r notebooks/requirements.txt
   ```

2. **Configure the Environment**
   - **IMPORTANT**: Update `notebooks/config.yaml` with your workspace settings before using the system:
     - Catalog and schema names (target locations for UC functions)
     - Model names and endpoints
     - Sample patient IDs and parameters for testing (use de-identified test data)
     - Experiment ID for MLflow tracking
     - User email addresses for monitoring

3. **Set Up Patient Journey Tools**
   - Run `notebooks/01_create_patient_journey_tools.py` to create SQL functions
   - This registers functions in Unity Catalog for data access

4. **Deploy the Agent**
   - Run `notebooks/02_patient_journey_driver.py` to:
     - Log the agent to MLflow with automatic tracing
     - Register the model in Unity Catalog with "Champion" alias
     - Deploy to serving endpoints (optional)
     - Set up monitoring with custom judges
   
5. **Set Up Evaluation and Monitoring**
   - Run `notebooks/03_agent_evaluations.ipynb` to create evaluation datasets
   - Run `notebooks/04_online_monitoring.ipynb` to configure real-time monitoring

## 🔧 HealthVerity Clinical Tools

The system includes five main SQL functions registered in Unity Catalog for comprehensive healthcare data analysis:

### `get_patient_enrollment(patient_id)`
Returns patient demographics and enrollment information including:
- Patient gender, year of birth, ZIP3, and state
- Enrollment start and end dates
- Benefit type and payment type information

### `get_medical_claims(patient_id, service_date)`
Retrieves medical claims for a patient on a specific service date:
- Claim ID, patient ID, service dates
- Location of care and payment type
- Healthcare service details

### `get_patient_diagnoses(patient_id)`
Returns comprehensive diagnosis information for a patient:
- Diagnosis codes and qualifiers
- Service dates and admission diagnosis indicators
- Medical condition tracking over time

### `get_pharmacy_claims(patient_id)`
Provides pharmacy claims and medication history:
- NDC codes for medication identification
- Fill numbers, days supply, and dispensed quantities
- Payment details including copays and gross amounts

### `get_patient_procedures(patient_id)`
Extracts procedure information and healthcare services:
- Procedure codes and qualifiers
- Service dates and procedure units
- Revenue codes and associated charges

## ⚙️ Technical Specifications

### Model Endpoints
- **Primary LLM**: `databricks-claude-3-7-sonnet`
- **Alternative LLM**: `databricks-meta-llama-3-3-70b-instruct`
- **Deployment**: Model serving endpoints with Unity Catalog registration

### Configuration Parameters
The system uses `config.yaml` for centralized configuration. **Note: All variables must be updated with your actual workspace values before use:**
```yaml
# Source data (HealthVerity dataset)
source_catalog_name: "HealthVerity_Claims_Sample_Patient_Dataset"
source_schema_name: "hv_claims_sample"

# Target UC functions
target_catalog_name: "<YOUR_CATALOG>"
target_schema_name: "<YOUR_SCHEMA>"

# Sample data parameters (use de-identified test data from your dataset)
service_date: "YYYY-MM-DD"
claim_id: "<SAMPLE_CLAIM_ID>"
patient_id: "<SAMPLE_PATIENT_ID>"
diagnosis_code: "<SAMPLE_DIAGNOSIS_CODE>"
ndc_code: "<SAMPLE_NDC_CODE>"

# Model configuration
model_uc_name: "<YOUR_CATALOG>.<YOUR_SCHEMA>.healthverity_patient_journey_agent"
alias: "Champion"
endpoint_name: "healthverity_patient_journey"

# MLflow tracking
experiment_id: "<YOUR_EXPERIMENT_ID>"
label_users: ["<YOUR_EMAIL>"]
```

### Agent Variants
- **Standard Agent**: Basic healthcare data analysis functionality
- **Enhanced Agent**: Advanced real-world claims analysis with comprehensive healthcare journey tracking

## 🤖 Agent Usage

### Chat Application (Recommended)

The easiest way to interact with the Patient Journey Agent is through the web-based chat interface:

1. **Quick Start**:
   ```bash
   cd application
   npm install
   npm start
   ```

2. **Configure Environment Variables**:
   Set the following environment variables for your Databricks workspace:
   - `DATABRICKS_HOST`: Your Databricks workspace URL
   - `DATABRICKS_CLIENT_ID`: Service principal client ID
   - `DATABRICKS_CLIENT_SECRET`: Service principal secret
   - `SERVING_ENDPOINT`: Your deployed agent endpoint name

3. **Access the Interface**: Open `http://localhost:8000/admin` in your browser

4. **Features**:
   - Modern, responsive React-based chat UI
   - Pre-built sample queries
   - Real-time conversation
   - Connection status monitoring
   - Mobile-friendly design

5. **Deployment**: See [application/README.md](application/README.md) for deploying to Databricks Apps

### Basic Queries

```python
# Example questions the agent can answer:
"What is the healthcare journey for patient <PATIENT_ID>?"
"What medications has patient <PATIENT_ID> been prescribed?"
"What are the diagnosis codes for patient <PATIENT_ID>?"
"Show me the medical claims for patient <PATIENT_ID> on <SERVICE_DATE>"
"What procedures has patient <PATIENT_ID> had performed?"
"What is the enrollment information for patient <PATIENT_ID>?"
```

### Integration Points

- **Chat Application**: Web-based React UI for end users (see `application/` directory)
- **AI Playground**: Interactive testing and development in Databricks
- **MLflow**: Experiment tracking and model management
- **Unity Catalog**: Centralized function and data governance
- **Model Serving**: Production deployment with endpoint management
- **Databricks Apps**: Deploy the chat interface as a lakehouse application

## 📊 Evaluation & Monitoring

### Evaluation Framework
- **Automated Test Generation**: Creates realistic clinical scenarios
- **Performance Metrics**: Accuracy, relevance, safety assessments
- **Benchmark Datasets**: Standardized evaluation sets

### Monitoring Capabilities
- **Real-time Assessment**: Continuous monitoring of agent responses
- **Safety Checks**: Built-in safety and bias detection
- **Quality Metrics**: Groundedness, relevance, clarity measurements
- **Custom Guidelines**: Configurable assessment criteria

### Assessment Criteria
- **Safety**: Ensures medical information is safe and appropriate
- **Groundedness**: Verifies responses are based on available data
- **Relevance to Query**: Confirms answers address the user's question
- **Chunk Relevance**: Validates information retrieval accuracy
- **Guideline Adherence**: Custom rules including:
  - English language responses
  - Clear, coherent, and concise communication
  - Relevant responses (including appropriate refusals)
  - No speculation when documentation is unavailable

## 🔒 Security & Compliance

- **Data Privacy**: All patient data is de-identified (HealthVerity sample dataset)
- **Credential Management**: Environment variables for secure API credential storage
- **Access Control**: Unity Catalog-based permissions and secure data access
- **API Security**: Backend proxy pattern keeps credentials server-side only
- **Audit Trail**: Complete MLflow tracking of all interactions
- **Safety Monitoring**: Continuous safety and bias assessment
- **Real-World Data Governance**: Secure handling of healthcare claims and pharmacy data

### Best Practices
- Never commit credentials or API keys to version control
- Use environment variables or Databricks secrets for sensitive data
- Ensure all patient identifiers are de-identified before use
- Follow HIPAA and healthcare data privacy regulations
- Use Unity Catalog for fine-grained access control

## 📁 Project Structure

```
patient_journey_agent/
├── application/                              # Chat application (Databricks Apps)
│   ├── app.js                                # Express server and API proxy
│   ├── app.yml                               # Databricks Apps configuration
│   ├── package.json                          # Node.js dependencies
│   ├── README.md                             # Application documentation
│   └── frontend/                             # React frontend
│       ├── src/
│       │   ├── App.js                        # Main application component
│       │   ├── components/                   # React components
│       │   │   ├── ChatInput.jsx             # Chat input interface
│       │   │   ├── ChatMessage.jsx           # Message display
│       │   │   ├── SampleQueries.jsx         # Query templates
│       │   │   ├── StatusBadge.jsx           # Connection status
│       │   │   └── TypingIndicator.jsx       # Loading indicator
│       │   ├── utils/
│       │   │   └── api.js                    # API utilities
│       │   └── views/
│       │       └── ChatView.jsx              # Main chat view
│       └── public/                           # Static assets
├── notebooks/                                # Agent implementation
│   ├── 01_create_patient_journey_tools.py   # SQL function creation and setup
│   ├── 02_patient_journey_driver.py         # Main agent deployment workflow
│   ├── 03_agent_evaluations.ipynb           # Evaluation framework and testing
│   ├── 04_online_monitoring.ipynb           # Real-time monitoring setup
│   ├── agent.py                              # Primary agent implementation
│   ├── base_agent.py                         # Alternative agent configuration
│   ├── config.yaml                           # Configuration parameters
│   └── requirements.txt                      # Python dependencies
├── README.md                                 # This documentation
└── LICENSE.txt                               # License information
```

## 🎯 Use Cases

### Clinical Decision Support
- Quickly review patient healthcare journey and enrollment history
- Analyze prescription patterns and medication adherence
- Understand diagnosis trends and medical conditions over time

### Healthcare Analytics
- Analyze patient populations across medical and pharmacy claims
- Study healthcare utilization patterns and costs
- Generate insights from real-world evidence data

### Healthcare Operations
- Streamline patient data review for care coordination
- Improve understanding of patient healthcare journeys
- Support value-based care initiatives with comprehensive claims analysis

## 🔗 Resources

- **[Databricks Agent Framework](https://docs.databricks.com/generative-ai/agent-framework/build-genai-apps.html)**: Documentation
- **[HealthVerity](https://www.healthverity.com/)**: Real-world healthcare data platform

## 🤝 Contributing

This repository is for demonstration purposes. For questions or contributions, please contact the development team.

## ⚠️ Disclaimer

This HealthVerity patient journey assistant is for demonstration and research purposes only. It should not be used for actual clinical decision-making without proper validation and approval from healthcare professionals and regulatory bodies. The system processes de-identified real-world healthcare data and should be used in compliance with all applicable healthcare data privacy regulations.
