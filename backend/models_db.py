import psycopg2

# ==========================================
# DATABASE CONNECTION
# ==========================================
conn = psycopg2.connect(
    dbname="supplychain_db",
    user="postgres",
    password="Verizon@1993",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# ==========================================
# HELPERS
# ==========================================
def execute(query):
    try:
        cursor.execute(query)
        conn.commit()
        print("✅ Executed")
    except Exception as e:
        print("❌ Error:", e)
        conn.rollback()


def add_column(table, column, datatype):
    try:
        cursor.execute(f"""
            ALTER TABLE {table}
            ADD COLUMN IF NOT EXISTS {column} {datatype};
        """)
        conn.commit()
        print(f"✅ Column {column} ensured in {table}")
    except Exception as e:
        print(f"❌ Column Error {table}.{column}:", e)
        conn.rollback()


# ==========================================
# 1️⃣ MATERIAL MASTER
# ==========================================
execute("""
CREATE TABLE IF NOT EXISTS material_master (
    id SERIAL PRIMARY KEY,
    erp_id VARCHAR(100),
    item_name TEXT,
    item_type TEXT,
    item_group TEXT,
    item_unit VARCHAR(50),
    parent_group TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
""")

# Index for fast search
execute("""
CREATE INDEX IF NOT EXISTS idx_material_name
ON material_master(item_name);
""")


# ==========================================
# 2️⃣ PROJECT MASTER
# ==========================================
execute("""
CREATE TABLE IF NOT EXISTS project_master (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    site_name TEXT,
    address TEXT,
    contact_person VARCHAR(255),
    state_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
""")

execute("""
CREATE INDEX IF NOT EXISTS idx_project_site
ON project_master(site_name);
""")


# ==========================================
# 3️⃣ GRN HEADER
# ==========================================
execute("""
CREATE TABLE IF NOT EXISTS grn_header (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    vendor_name VARCHAR(255),
    transport VARCHAR(255),
    vehicle_number VARCHAR(100),
    invoice_no VARCHAR(100),
    invoice_date DATE,
    received_location TEXT,
    received_by VARCHAR(255),   -- ✅ NEW
    grn_no VARCHAR(100),
    grn_date DATE,
    gate_pass_no VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
""")


# ==========================================
# 4️⃣ GRN ITEM
# ==========================================
execute("""
CREATE TABLE IF NOT EXISTS grn_item (
    id SERIAL PRIMARY KEY,
    grn_id INTEGER,
    item_code VARCHAR(100),
    description TEXT,
    unit VARCHAR(50),

    length FLOAT DEFAULT 0,      -- ✅ NEW
    width FLOAT DEFAULT 0,       -- ✅ NEW
    thickness FLOAT DEFAULT 0,   -- ✅ NEW

    challan_qty FLOAT,
    total_qty FLOAT,
    balance_qty FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_grn
        FOREIGN KEY(grn_id)
        REFERENCES grn_header(id)
        ON DELETE CASCADE
);
""")


# ==========================================
# 5️⃣ AUTO SAFE COLUMN UPDATES (FUTURE PROOF)
# ==========================================

# Material
add_column("material_master", "created_at", "TIMESTAMP DEFAULT NOW()")

# Project
add_column("project_master", "created_at", "TIMESTAMP DEFAULT NOW()")

# GRN
add_column("grn_header", "created_at", "TIMESTAMP DEFAULT NOW()")
add_column("grn_item", "created_at", "TIMESTAMP DEFAULT NOW()")


add_column("grn_header", "received_by", "VARCHAR(255)")
add_column("grn_item", "length", "FLOAT DEFAULT 0")
add_column("grn_item", "width", "FLOAT DEFAULT 0")
add_column("grn_item", "thickness", "FLOAT DEFAULT 0")

add_column("grn_header", "vehicle_number", "VARCHAR(100)")
add_column("grn_header", "receive_location", "TEXT")


# 🔥 NEW PROJECT MASTER FIELDS
add_column("project_master", "type", "VARCHAR(50)")
add_column("project_master", "client", "VARCHAR(255)")
add_column("project_master", "document", "TEXT")

# ==========================================
# CLOSE CONNECTION
# ==========================================
cursor.close()
conn.close()

print("\n🎉 FULL DATABASE READY (SAFE + FUTURE PROOF)")