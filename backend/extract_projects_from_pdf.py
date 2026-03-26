import os
import pdfplumber
import pandas as pd
import re

pdf_path = r"D:\Required Softwares\PROJECT DETAILS.pdf"
output_excel_path = r"D:\Required Softwares\project_master_clean.xlsx"

if not os.path.exists(pdf_path):
    print("❌ PDF file not found.")
    exit()

print("🔄 Extracting structured tables from PDF...")

all_rows = []

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        if tables:
            for table in tables:
                for row in table:
                    if row and any(cell for cell in row):
                        all_rows.append(row)

if not all_rows:
    print("❌ No table data found.")
    exit()

df = pd.DataFrame(all_rows)
df = df.dropna(how="all").reset_index(drop=True)

# Select required columns by index
selected_df = df.iloc[:, [1, 5, 6, 7, 9]].copy()

selected_df.columns = [
    "company_name",
    "site_name",
    "address",
    "contact_person",
    "state_name"
]

# 🔥 CLEAN ILLEGAL EXCEL CHARACTERS
def clean_excel_text(value):
    if isinstance(value, str):
        value = re.sub(r"[\x00-\x1F\x7F]", " ", value)  # remove control chars
        value = value.replace("\n", " ").replace("\r", " ")
        value = re.sub(r"\s+", " ", value).strip()
    return value

# Apply cleaning column-wise
for col in selected_df.columns:
    selected_df[col] = selected_df[col].apply(clean_excel_text)

# Remove header-like rows
selected_df = selected_df[
    ~selected_df["company_name"].str.contains("Company", na=False)
]

selected_df = selected_df[selected_df["company_name"].notna()]
selected_df = selected_df.reset_index(drop=True)

# Save to Excel
selected_df.to_excel(output_excel_path, index=False)

print("✅ Excel generated successfully!")
print("📁 Saved at:", output_excel_path)
print("📊 Total records extracted:", len(selected_df))