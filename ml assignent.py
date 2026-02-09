import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

sns.set(style="whitegrid")

def load_data(filepath):
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return None
    
    df = pd.read_csv(filepath)
    print("Dataset loaded successfully.")
    
    # Convert TotalCharges to numeric
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(subset=['TotalCharges'], inplace=True)
    
    return df

def perform_eda(df):
    print("\n---------------- DATA EXPLORATION ----------------")
    
    # a. Sanity check
    print("\nFirst 5 rows:")
    print(df.head())
    
    # b. Shape and description
    print(f"\nDataset Shape: {df.shape}")
    print("\nDataset Description:")
    print(df.describe(include='all'))
    
    # c. Visualizations
    plt.figure(figsize=(6, 5))
    sns.countplot(x='Churn', data=df)
    plt.title("Churn Distribution")
    plt.show()
    
    plt.figure(figsize=(8, 5))
    sns.countplot(x='Contract', hue='Churn', data=df)
    plt.title("Churn by Contract Type")
    plt.show()
    
    plt.figure(figsize=(12, 4))
    for i, col in enumerate(['tenure', 'MonthlyCharges', 'TotalCharges']):
        plt.subplot(1, 3, i + 1)
        sns.histplot(df[col], kde=True)
        plt.title(col)
    plt.tight_layout()
    plt.show()
    
    # d. Correlation analysis
    df_corr = df.copy()
    df_corr.drop('customerID', axis=1, inplace=True)
    
    for col in df_corr.columns:
        if df_corr[col].dtype == 'object':
            df_corr[col] = df_corr[col].astype('category').cat.codes
    
    plt.figure(figsize=(18, 14))
    corr_matrix = df_corr.corr()
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title("Correlation Matrix")
    plt.show()

def main():
    df = load_data("Telco-Customer-Churn.csv")
    if df is not None:
        perform_eda(df)

if __name__ == "__main__":
    main()
