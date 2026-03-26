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
import { MenuItem } from "@mui/material";

export default function ProjectMaster() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

const [formData, setFormData] = useState({
  companyName: "BALABHARTI INFRASTRUCTURE PVT LTD",
  type: "",
  client: "",
  document: null,   // 🔥 file
  siteName: "",
  address: "",
  contactPerson: "",
  stateName: ""
});

  useEffect(() => {
  fetchProjects();
}, []);

const fetchProjects = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/projects/"
    );
    setProjects(response.data);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  try {
    const form = new FormData();

    form.append("company_name", formData.companyName);
    form.append("type", formData.type);
    form.append("client", formData.client);
    form.append("site_name", formData.siteName);
    form.append("address", formData.address);
    form.append("contact_person", formData.contactPerson);
    form.append("state_name", formData.stateName);

    // 🔥 MULTIPLE FILES
    if (formData.document && formData.document.length > 0) {
      formData.document.forEach((file) => {
        form.append("document", file);
      });
    }

    await axios.post("http://127.0.0.1:8000/api/projects/", form);

    // 🔥 Refresh from backend
    fetchProjects();

    setOpen(false);

    // 🔥 Reset form
    setFormData({
      companyName: "BALABHARTI INFRASTRUCTURE PVT LTD",
      type: "",
      client: "",
      document: [],
      siteName: "",
      address: "",
      contactPerson: "",
      stateName: ""
    });

  } catch (error) {
    console.error("SAVE ERROR:", error.response?.data);
  }
};

  const handleEdit = (index) => {
    setFormData(projects[index]);
    setEditIndex(index);
    setOpen(true);
  };
const handleDelete = async (id) => {

  // 🔥 CONFIRM POPUP (ADD HERE)
  if (!window.confirm("Are you sure you want to delete this project?")) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`);

    // 🔥 Refresh data
    fetchProjects();

  } catch (error) {
    console.error("DELETE ERROR:", error);
  }
};

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      Object.values(project).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [projects, search]);

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        Project Master
      </Typography>

      {/* Header Section */}
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
          Add Project
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Address / City</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>State Name</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProjects.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                  <TableCell>{row.company_name}</TableCell>
                  <TableCell>{row.site_name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.contact_person}</TableCell>
                  <TableCell>{row.state_name}</TableCell>
                  <TableCell>
                    {row.document ? (
                      (() => {
                        try {
                          const files = JSON.parse(row.document);

                          return files.map((file, i) => (
                            <div key={i}>
                              <a
                                href={`http://127.0.0.1:8000/media/${file.split("/").pop()}`} target="_blank" rel="noreferrer">
                                File {i + 1}
                              </a>
                            </div>
                          ));
                        } catch (e) {
                          return "-";
                        }})()) : ("-" )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: { backdropFilter: "blur(4px)" }
        }}
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="subtitle1">
            {editIndex !== null ? "Edit Project" : "Add Project"}
          </Typography>

          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                size="small"
                label="Type"
                name="type"
                value={formData.type || "default"}
                onChange={handleChange}
              >
                <MenuItem value="default" disabled>
                  Select Type
                </MenuItem>
                <MenuItem value="Supply">Supply</MenuItem>
                <MenuItem value="Supply and Launching">
                  Supply and Launching
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="Client" name="client" value={formData.client} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Project Name"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                inputProps={{ style: { minWidth: "200px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Address / City"
                name="address"
                value={formData.address}
                onChange={handleChange}
                inputProps={{ style: { minWidth: "200px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                inputProps={{ style: { minWidth: "200px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="State Name"
                name="stateName"
                value={formData.stateName}
                onChange={handleChange}
                inputProps={{ style: { minWidth: "200px" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label" size="small" >
                  Upload Document
                  <input type="file" multiple hidden onChange={(e) => {
                    const newFiles = Array.from(e.target.files);

                    setFormData((prev) => ({
                      ...prev,
                      document: [...(prev.document || []), ...newFiles]
                    }));
                  }} />
              </Button>

              {formData.document && formData.document.length > 0 && (
                <Box ml={2}>
                  {formData.document.map((file, i) => (
                    <Box
                      key={i}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ maxWidth: "300px" }}
                    >
                      <Typography variant="caption">
                        {file.name}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => {
                          const updatedFiles = formData.document.filter((_, index) => index !== i);
                          setFormData({ ...formData, document: updatedFiles });
                        }}
                      >
                        ❌
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>


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