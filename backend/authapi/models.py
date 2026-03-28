from django.db import models


# ==========================================
# MATERIAL MASTER
# ==========================================
class MaterialMaster(models.Model):
    erp_id = models.CharField(max_length=100, blank=True, null=True)

    # Core Fields
    item_name = models.CharField(max_length=255)
    item_code = models.CharField(max_length=50, blank=True, null=True)
    grade_group = models.CharField(max_length=50, blank=True, null=True)

    # Classification
    item_type = models.CharField(max_length=100, blank=True, null=True)
    item_group = models.CharField(max_length=100, blank=True, null=True)
    item_unit = models.CharField(max_length=50, blank=True, null=True)
    parent_group = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "material_master"
        ordering = ["item_name", "item_code"]
        # Prevent duplicate ERP rows
        unique_together = ("item_name", "grade_group")

    def __str__(self):
        return f"{self.item_name} ({self.item_code})"


# ==========================================
# PROJECT MASTER
# ==========================================
class ProjectMaster(models.Model):
    company_name = models.CharField(max_length=255)

    type = models.CharField(max_length=50, blank=True, null=True)
    client = models.CharField(max_length=255, blank=True, null=True)
    document = models.FileField(upload_to="project_documents/", null=True, blank=True)

    site_name = models.TextField()
    address = models.TextField()
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    state_name = models.CharField(max_length=100)

    class Meta:
        db_table = "project_master"
        managed = False  # external table


# ==========================================
# GRN HEADER
# ==========================================
class GRNHeader(models.Model):
    grn_no = models.CharField(max_length=50, unique=True)

    company_name = models.CharField(max_length=255, blank=True, null=True)
    vendor_name = models.CharField(max_length=255, blank=True, null=True)
    transport = models.CharField(max_length=255, blank=True, null=True)

    vehicle_number = models.CharField(max_length=100, blank=True, null=True)

    invoice_no = models.CharField(max_length=100, blank=True, null=True)
    invoice_date = models.DateField(blank=True, null=True)

    receive_location = models.TextField(blank=True, null=True, db_column="receive_location")
    received_by = models.CharField(max_length=255, blank=True, null=True)

    grn_date = models.DateField(blank=True, null=True)
    gate_pass_no = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "grn_header"
        ordering = ["-created_at"]

    def __str__(self):
        return self.grn_no


# ==========================================
# GRN ITEM
# ==========================================

class GRNItem(models.Model):
    grn = models.ForeignKey(
        GRNHeader,
        on_delete=models.CASCADE,
        related_name="items"
    )

    material = models.ForeignKey(
        MaterialMaster,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    item_code = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)

    # ✅ NEW FIELD (IMPORTANT)
    unique_item_id = models.CharField(max_length=20, blank=True, null=True)

    # Dimensions
    length = models.FloatField(default=0)
    width = models.FloatField(default=0)
    thickness = models.FloatField(default=0)

    challan_qty = models.DecimalField(max_digits=10, decimal_places=2)
    total_qty = models.DecimalField(max_digits=10, decimal_places=2)
    balance_qty = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    weight = models.FloatField(default=0)   # ✅ ADD THIS LINE

    class Meta:
        db_table = "grn_item"

    def __str__(self):
        return f"{self.item_code} - {self.description}"
    
# ==========================================
# STOCK TABLE
# ==========================================
class Stock(models.Model):
    grn = models.ForeignKey(
        GRNHeader,
        on_delete=models.CASCADE,
        related_name="stock_entries"
    )

    grn_item = models.ForeignKey(
        GRNItem,
        on_delete=models.CASCADE
    )

    item_code = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)

    # ✅ NEW FIELDS ADDED
    unique_item_id = models.CharField(max_length=100, blank=True, null=True)

    length = models.FloatField(default=0)
    width = models.FloatField(default=0)
    thickness = models.FloatField(default=0)

    challan_qty = models.DecimalField(max_digits=10, decimal_places=2)
    total_qty = models.DecimalField(max_digits=10, decimal_places=2)
    balance_qty = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    weight = models.FloatField(default=0)   # ✅ ADD THIS LINE

    class Meta:
        db_table = "stock"

    def __str__(self):
        return f"{self.item_code} - {self.total_qty}"