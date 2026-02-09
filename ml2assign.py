import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_curve, auc

# Set style for plots
sns.set(style="whitegrid")

def load_data(filepath):
    """Loads dataset and performs initial cleaning."""
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return None
    
    df = pd.read_csv(filepath)
    print("Dataset loaded successfully.")
    
    # 'TotalCharges' is object but should be numeric
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    
    # Drop rows with missing TotalCharges
    null_count = df['TotalCharges'].isnull().sum()
    if null_count > 0:
        print(f"Dropping {null_count} rows with missing 'TotalCharges'.")
        df.dropna(subset=['TotalCharges'], inplace=True)
        
    # Drop customerID
    if 'customerID' in df.columns:
        df.drop('customerID', axis=1, inplace=True)
        
    return df

def perform_eda(df):
    """Generates visualizations for EDA."""
    print("\n--------------------------------------------------")
    print("2. Data Visualization and Exploration")
    print("--------------------------------------------------")
    
    print("\n[Sanity Check] First 5 rows:")
    print(df.head())
    print(f"\n[Shape] Dataset has {df.shape[0]} rows and {df.shape[1]} columns.")
    print("\n[Description] Summary Statistics:")
    print(df.describe(include='all'))
    
    print("\nGenerating visualizations...")
    
    # 1. Target Variable (Churn) Distribution
    plt.figure(figsize=(6, 5))
    sns.countplot(x='Churn', data=df, palette='viridis')
    plt.title('Distribution of Churn')
    plt.show()

    # 2. Key Numerical Features Distributions
    numerical_features = ['tenure', 'MonthlyCharges', 'TotalCharges']
    plt.figure(figsize=(15, 5))
    for i, col in enumerate(numerical_features):
        plt.subplot(1, 3, i + 1)
        sns.histplot(df[col], kde=True, bins=30, color='skyblue')
        plt.title(f'Distribution of {col}')
    plt.tight_layout()
    plt.show()
    
    # 3. Categorical Feature vs Churn (e.g., Contract)
    plt.figure(figsize=(8, 5))
    sns.countplot(x='Contract', hue='Churn', data=df, palette='Set2')
    plt.title('Churn Rate by Contract Type')
    plt.show()
    
    # 4. Correlation Matrix
    df_encoded = df.copy()
    for column in df_encoded.columns:
        if df_encoded[column].dtype == 'object':
            df_encoded[column] = df_encoded[column].astype('category').cat.codes
            
    plt.figure(figsize=(20, 16))
    corr_matrix = df_encoded.corr()
    sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', linewidths=0.5)
    plt.title('Feature Correlation Matrix')
    plt.show()

def preprocess_data(df):
    """Preprocesses data for modeling."""
    print("\n--------------------------------------------------")
    print("3. Data Preprocessing")
    print("--------------------------------------------------")
    
    # Encode Target Variable 'Churn'
    if df['Churn'].dtype == 'object':
        df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})
        
    # Identification of Categorical and Numerical Features
    categorical_cols = [c for c in df.columns if df[c].dtype == 'object' and c != 'Churn']
    numerical_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']
    
    # One-Hot Encoding for Categorical Variables
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
    # Scaling Numerical Features
    scaler = StandardScaler()
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
    
    print("Data preprocessed successfully.")
    print(f"New shape: {df.shape}")
    
    return df

def train_and_evaluate(df):
    """Trains models and evaluates them."""
    print("\n--------------------------------------------------")
    print("4. Model Training and Evaluation")
    print("--------------------------------------------------")
    
    X = df.drop('Churn', axis=1)
    y = df['Churn']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
    }
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        print(f"--- {name} Results ---")
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Confusion Matrix
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(6, 5))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title(f'Confusion Matrix - {name}')
        plt.ylabel('Actual')
        plt.xlabel('Predicted')
        plt.show()

def main():
    dataset_path = 'Telco-Customer-Churn.csv'
    
    # 1. Load Data
    df = load_data(dataset_path)
    if df is None:
        return
        
    # 2. Exploratory Data Analysis
    perform_eda(df)
    
    # 3. Preprocessing
    df_processed = preprocess_data(df)
    
    # 4. Modeling
    train_and_evaluate(df_processed)
    
    print("\n--------------------------------------------------")
    print("Project Execution Completed Successfully")
    print("--------------------------------------------------")

if __name__ == "__main__":
    main()
