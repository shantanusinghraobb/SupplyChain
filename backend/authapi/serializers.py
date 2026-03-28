from rest_framework import serializers
from .models import MaterialMaster, ProjectMaster, GRNHeader, GRNItem, Stock
import re


# ==========================================
# MATERIAL MASTER
# ==========================================
class MaterialMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialMaster
        fields = "__all__"


# ==========================================
# PROJECT MASTER
# ==========================================
class ProjectMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMaster
        fields = [
            "id",
            "company_name",
            "type",
            "client",
            "document",
            "site_name",
            "address",
            "contact_person",
            "state_name",
        ]


# ==========================================
# GRN ITEM
# ==========================================
class GRNItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GRNItem
        exclude = ["grn"]
        extra_kwargs = {
            "balance_qty": {"required": False}
        }


# ==========================================
# 🔥 FINAL UNIQUE ITEM ID FUNCTION (ONLY ONE)
# ==========================================
def generate_unique_item_id(item_code, grade=None):
    """
    Generate Unique Item ID like:
    P-10A-001, P-10A-002
    """

    if not item_code:
        return None

    try:
        parts = item_code.split("-")   # ['P', '10', '002']
        prefix = parts[0]
        thickness = parts[1]
    except Exception:
        return None

    # 🔹 Grade mapping
    grade_map = {
        "E250B0": "A",
        "E250BR": "B",
        "E350B0": "C",
        "E350BR": "D",
    }

    grade_code = grade_map.get(grade, "")

    base_id = f"{prefix}-{thickness}{grade_code}"

    # 🔥 COUNT EXISTING (VERY IMPORTANT)
    count = GRNItem.objects.filter(
        unique_item_id__startswith=base_id
    ).count() + 1

    return f"{base_id}-{str(count).zfill(3)}"


# ==========================================
# GRN HEADER
# ==========================================
class GRNHeaderSerializer(serializers.ModelSerializer):
    items = GRNItemSerializer(many=True, read_only=True)

    class Meta:
        model = GRNHeader
        fields = "__all__"

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])

        # ✅ CREATE HEADER
        grn = GRNHeader.objects.create(**validated_data)

        # ==========================================
        # 🔁 LOOP ITEMS
        # ==========================================
        for item in items_data:

            material = None
            grade = None

            item_code = item.get("item_code")

            # 🔹 FETCH MATERIAL
            if item_code:
                material = MaterialMaster.objects.filter(item_code=item_code).first()
                if material:
                    grade = material.grade_group

            # 🔹 GENERATE UNIQUE ID
            unique_id = generate_unique_item_id(
                item_code=item_code,
                grade=grade
            )
            # 🔥 EXTRACT VALUES
            length = float(item.get("length", 0))
            width = float(item.get("width", 0))
            thickness = float(item.get("thickness", 0))

            # 🔥 CALCULATE WEIGHT (PER SHEET ONLY)
            weight = (length / 1000) * (width / 1000) * (thickness / 1000) * 7850

            # ==========================================
            # ✅ CREATE GRN ITEM
            # ==========================================
            grn_item = GRNItem.objects.create(
                grn=grn,
                material=material,
                item_code=item_code,
                description=item.get("description"),
                unit=item.get("unit"),
                length=item.get("length", 0),
                width=item.get("width", 0),
                thickness=item.get("thickness", 0),
                challan_qty=item.get("challan_qty", 0),
                total_qty=item.get("total_qty", 0),
                balance_qty=0,
                unique_item_id=unique_id,
                weight=weight   # ✅ ADD THIS

            )

            # ==========================================
            # ✅ CREATE STOCK (NO MERGE - 1:1 ENTRY)
            # ==========================================
            Stock.objects.create(
                grn=grn,
                grn_item=grn_item,
                item_code=grn_item.item_code,
                description=grn_item.description,
                unit=grn_item.unit,
                unique_item_id=grn_item.unique_item_id,
                length=grn_item.length,
                width=grn_item.width,
                thickness=grn_item.thickness,
                challan_qty=grn_item.challan_qty,
                total_qty=grn_item.total_qty,
                balance_qty=grn_item.total_qty,
                weight=weight   # ✅ ADD THIS LINE
            )

        return grn