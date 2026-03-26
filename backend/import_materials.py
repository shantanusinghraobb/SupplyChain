import os
import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch

file_path = r"D:\Required Softwares\material_master.xlsx"

try:
    df = pd.read_excel(file_path)

    print("✅ Excel Loaded Successfully")
    print("Original Columns:", df.columns.tolist())

    # 🔹 Clean column names (remove extra spaces)
    df.columns = df.columns.str.strip()

    # 🔹 Drop unwanted column
    if "Sr" in df.columns:
        df = df.drop(columns=["Sr"])

    print("After Cleaning Columns:", df.columns.tolist())

    # 🔹 Rename columns to match DB
    df = df.rename(columns={
        "ERP ID": "erp_id",
        "Item Name": "item_name",
        "Item Type": "item_type",
        "Item Group": "item_group",
        "Item Unit": "item_unit",
        "Parent Group": "parent_group"
    })

    df = df.dropna(how="all")

    print(f"Total Rows to Insert: {len(df)}")

    # 🔹 Connect to DB
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

    insert_query = """
        INSERT INTO material_master
        (erp_id, item_name, item_type, item_group, item_unit, parent_group, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
    """

    data = [
        (
            None if pd.isna(row["erp_id"]) else str(row["erp_id"]),
            None if pd.isna(row["item_name"]) else str(row["item_name"]),
            None if pd.isna(row["item_type"]) else str(row["item_type"]),
            None if pd.isna(row["item_group"]) else str(row["item_group"]),
            None if pd.isna(row["item_unit"]) else str(row["item_unit"]),
            None if pd.isna(row["parent_group"]) else str(row["parent_group"]),
        )
        for _, row in df.iterrows()
    ]

    execute_batch(cursor, insert_query, data)
    conn.commit()

    print(f"✅ Successfully Inserted {len(data)} Rows")

except Exception as e:
    print("❌ Error:", e)

finally:
    try:
        cursor.close()
        conn.close()
        print("🔒 Database Connection Closed")
    except:
        pass