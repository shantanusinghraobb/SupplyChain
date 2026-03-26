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
# 🔥 UTILITY FUNCTION
# ==========================================
def generate_unique_item_id(description, thickness, grade=None):
    """
    Generate Unique Item ID only for PLATE items.
    Example: P-20A
    """

    desc = (description or "").upper()

    # ❌ ONLY FOR PLATE
    if "PLATE" not in desc:
        return None

    # ✅ PREFIX
    prefix = "P"

    # ✅ THICKNESS (safe conversion)
    try:
        thickness_value = int(float(thickness)) if thickness else 0
    except Exception:
        thickness_value = 0

    # ✅ GRADE MAP
    grade_map = {
        "E250B0": "A",
        "E250BR": "B",
        "E350B0": "C",
        "E350BR": "D",
    }

    grade_code = grade_map.get(grade, "X")

    return f"{prefix}-{thickness_value}{grade_code}"


# ==========================================
# GRN HEADER
# ==========================================
class GRNHeaderSerializer(serializers.ModelSerializer):
    items = GRNItemSerializer(many=True)

    class Meta:
        model = GRNHeader
        fields = "__all__"

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])

        # ✅ CREATE HEADER
        grn = GRNHeader.objects.create(**validated_data)

        # ✅ LOOP ITEMS
        for item in items_data:

            description = item.get("description", "")
            thickness = item.get("thickness", 0)
            item_code = item.get("item_code")

            # ==========================================
            # 🔹 MATERIAL LINKING
            # ==========================================
            material = None
            grade = None

            if item_code:
                material = MaterialMaster.objects.filter(item_code=item_code).first()
                if material:
                    grade = material.grade_group

            # ==========================================
            # 🔥 GENERATE UNIQUE ITEM ID
            # ==========================================
            unique_id = generate_unique_item_id(
                description=description,
                thickness=thickness,
                grade=grade
            )

            # ==========================================
            # ✅ CREATE GRN ITEM
            # ==========================================
            grn_item = GRNItem.objects.create(
                grn=grn,
                material=material,

                item_code=item.get("item_code", ""),
                description=description,
                unit=item.get("unit", ""),

                length=item.get("length", 0),
                width=item.get("width", 0),
                thickness=thickness,

                challan_qty=item.get("challan_qty", 0),
                total_qty=item.get("total_qty", 0),
                balance_qty=0,

                unique_item_id=unique_id
            )

            # ==========================================
            # 🔥 AUTO INSERT INTO STOCK
            # ==========================================
            Stock.objects.create(
                grn=grn,
                grn_item=grn_item,

                item_code=grn_item.item_code,
                description=grn_item.description,
                unit=grn_item.unit,

                unique_item_id=grn_item.unique_item_id,
                total_qty=grn_item.total_qty
            )

        return grn