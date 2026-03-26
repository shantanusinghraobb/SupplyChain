import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";

export default function MaterialMaster() {
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

const [formData, setFormData] = useState({
  erp_id: "",
  item_name: "",
  item_code: "",   // ✅ ADD THIS
  item_type: "",
  grade_group: "",
  item_group: "",
  item_unit: "",
  parent_group: ""
});

  // ✅ FETCH DATA FROM DJANGO
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/materials/"
      );
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ LOCAL SAVE (no backend yet)
const handleSave = async () => {
  try {
    if (editIndex !== null) {
      const id = materials[editIndex].id;

      await axios.put(
        `http://127.0.0.1:8000/api/materials/${id}/`,
        formData
      );
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/materials/",
        formData
      );
    }

    fetchMaterials();

setFormData({
  erp_id: "",
  item_name: "",
  item_code: "",
  grade_group: "",   // ✅ ADD THIS
  item_type: "",
  item_group: "",
  item_unit: "",
  parent_group: ""
});

    setOpen(false);
    setEditIndex(null);

  } catch (error) {
    console.error("Error saving material:", error);
  }
};

  const handleEdit = (index) => {
    setFormData(materials[index]);
    setEditIndex(index);
    setOpen(true);
  };

const handleDelete = async (index) => {
  try {
    const id = materials[index].id;

    await axios.delete(
      `http://127.0.0.1:8000/api/materials/${id}/`
    );

    fetchMaterials();

  } catch (error) {
    console.error("Error deleting material:", error);
  }
};

  // ✅ SAFE SEARCH FILTER
  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) =>
      Object.values(mat).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [materials, search]);

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Item Master
      </Typography>

      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setEditIndex(null);
            setOpen(true);
          }}
        >
          Add Item
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>ERP ID</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Type</TableCell>
              <TableCell>Item Group</TableCell>
              <TableCell>Item Unit</TableCell>
              <TableCell>Parent Group</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredMaterials.map((row, index) => (
              <TableRow key={row.id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.erp_id}</TableCell>
                <TableCell>{row.item_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>{row.item_type}</TableCell>
                <TableCell>{row.item_group}</TableCell>
                <TableCell>{row.item_unit}</TableCell>
                <TableCell>{row.parent_group}</TableCell>
                <TableCell>{row.grade_group}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {filteredMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editIndex !== null ? "Edit Material" : "Add Item"}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
                {[
                  { label: "ERP ID", name: "erp_id" },
                  { label: "Item Name", name: "item_name" },
                  { label: "Item Code", name: "item_code" },

                  { label: "Grade Group", name: "grade_group" }, // ✅ ADD THIS

                  { label: "Item Type", name: "item_type" },
                  { label: "Item Group", name: "item_group" },
                  { label: "Item Unit", name: "item_unit" },
                  { label: "Parent Group", name: "parent_group" }
                ].map((field) => (
              <Grid item xs={12} sm={4} key={field.name}>
                <TextField
                  fullWidth
                  size="small"
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={field.disabled || false}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} size="small">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} size="small">
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}