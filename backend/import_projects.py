import os
import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch

# ==========================================
# 1️⃣ EXCEL FILE PATH
# ==========================================
file_path = r"D:\Required Softwares\project_master_clean.xlsx"

if not os.path.exists(file_path):
    print("❌ Excel file not found at:", file_path)
    exit()

try:
    # ==========================================
    # 2️⃣ LOAD EXCEL
    # ==========================================
    df = pd.read_excel(file_path)

    print("✅ Excel Loaded Successfully")
    print("Original Columns:", df.columns.tolist())

    # Clean column names
    df.columns = df.columns.str.strip()

    print("After Cleaning Columns:", df.columns.tolist())

    # Remove completely empty rows
    df = df.dropna(how="all")

    print(f"📊 Total Rows to Insert: {len(df)}")

    # ==========================================
    # 3️⃣ DATABASE CONNECTION (SAME AS WORKING SCRIPT)
    # ==========================================

    conn = psycopg2.connect(
    dbname="supplychain_db",
    user="postgres",
    password="Verizon@1993",
    host="localhost",
    port="5432"
)


    # conn = psycopg2.connect(
    #     dbname="supplychain_db_ojbk",
    #     user="supplychain_db_ojbk_user",
    #     password="5MtTR6A5zSCXYTADnBX6h2Uvbb2z9BbI",
    #     host="dpg-d6497gu3jp1c73bjm0v0-a.oregon-postgres.render.com",
    #     port="5432",
    #     sslmode="require"
    # )

    cursor = conn.cursor()

    # ==========================================
    # 4️⃣ INSERT QUERY
    # ==========================================
    insert_query = """
        INSERT INTO project_master
        (company_name, site_name, address, contact_person, state_name, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
    """

    data = [
        (
            None if pd.isna(row["company_name"]) else str(row["company_name"]).strip(),
            None if pd.isna(row["site_name"]) else str(row["site_name"]).strip(),
            None if pd.isna(row["address"]) else str(row["address"]).strip(),
            None if pd.isna(row["contact_person"]) else str(row["contact_person"]).strip(),
            None if pd.isna(row["state_name"]) else str(row["state_name"]).strip(),
        )
        for _, row in df.iterrows()
    ]

    execute_batch(cursor, insert_query, data)
    conn.commit()

    print(f"✅ Successfully Inserted {len(data)} Rows into project_master")

except Exception as e:
    print("❌ Error:", e)

finally:
    try:
        cursor.close()
        conn.close()
        print("🔒 Database Connection Closed")
    except:
        pass