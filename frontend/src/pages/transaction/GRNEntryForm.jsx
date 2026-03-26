import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  MenuItem,
  Autocomplete
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GRNEntryForm() {
  const [open, setOpen] = useState(false);
  const [grnList, setGrnList] = useState([]);
  const [materials, setMaterials] = useState([]);

const [headerData, setHeaderData] = useState({
  companyName: "BALABHARTI INFRASTRUCTURE PVT LTD",
  vendorName: "",
  transport: "",
  vehicleNo: "",
  invoiceNo: "",
  invoiceDate: "",
  receiveLocation: "",
  receivedBy: "",

  // 🔥 SYSTEM GENERATED
  grnNo: "",
  grnPlateDate: new Date().toISOString().split("T")[0],

  // 🔹 USER INPUT (ERP)
  erpGrnNo: "",
  grnDate: "",
  gatePassNo: ""
});

const [items, setItems] = useState([
  {
    item_code: "",
    description: "",
    unit: "",
    length: 0,
    width: 0,
    thickness: 0,
    challan_qty: 0,
    total_qty: 0
  }
]);
  const [errors, setErrors] = useState({});

  // 🔹 Fetch material master for dropdown
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/materials/")
      .then((res) => {
        setMaterials(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleHeaderChange = (e) => {
    setHeaderData({ ...headerData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
  const updated = [...items];
  updated[index][field] = value;
  setItems(updated);
};

  const addItemRow = () => {
    setItems([
      ...items,
      {
        item_code: "",
        description: "",
        unit: "",
        length: 0,
        width: 0,
        thickness: 0,
        challan_qty: 0,
        total_qty: 0
      }
    ]);
  };

  const deleteItemRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  useEffect(() => {
  fetchGRN();
}, []);

useEffect(() => {
  if (open) {
    axios
      .get("http://127.0.0.1:8000/api/grn/next-number/")
      .then((res) => {
        setHeaderData((prev) => ({
          ...prev,
          grnNo: res.data.grn_no,
        }));
      })
      .catch((err) => console.log(err));
  }
}, [open]);

const fetchGRN = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/grn/");
    setGrnList(res.data);
  } catch (err) {
    console.log(err);
  }
};


const validateForm = () => {
  let newErrors = {};

  // HEADER
  if (!headerData.vendorName) newErrors.vendorName = true;
  if (!headerData.transport) newErrors.transport = true;
  if (!headerData.vehicleNo) newErrors.vehicleNo = true;
  if (!headerData.invoiceNo) newErrors.invoiceNo = true;
  if (!headerData.invoiceDate) newErrors.invoiceDate = true;
  if (!headerData.receiveLocation) newErrors.receiveLocation = true;
  if (!headerData.receivedBy) newErrors.receivedBy = true;
  if (!headerData.erpGrnNo) newErrors.erpGrnNo = true;
  if (!headerData.grnDate) newErrors.grnDate = true;
  if (!headerData.gatePassNo) newErrors.gatePassNo = true;

  // ITEMS
  items.forEach((item, index) => {
    if (!item.item_code) newErrors[`item_code_${index}`] = true;
    if (!item.description) newErrors[`description_${index}`] = true;
    if (!item.unit) newErrors[`unit_${index}`] = true;
    if (!item.length) newErrors[`length_${index}`] = true;
    if (!item.width) newErrors[`width_${index}`] = true;
    if (!item.thickness) newErrors[`thickness_${index}`] = true;
    if (!item.challan_qty) newErrors[`challan_qty${index}`] = true;
    if (!item.total_qty) newErrors[`total_qty_${index}`] = true;
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSave = async () => {

  // 🔴 HEADER VALIDATION
  if (
    !headerData.vendorName ||
    !headerData.transport ||
    !headerData.vehicleNo ||
    !headerData.invoiceNo ||
    !headerData.invoiceDate ||
    !headerData.receiveLocation ||
    !headerData.receivedBy ||
    !headerData.erpGrnNo ||
    !headerData.grnDate ||
    !headerData.gatePassNo
  ) {
    toast.error("Please fill all header fields");
    return;
  }

  // 🔴 ITEM VALIDATION
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (
      !item.item_code ||
      !item.description ||
      !item.unit ||
      !item.length ||
      !item.width ||
      !item.thickness ||
      !item.challan_qty ||
      !item.total_qty
    ) {
      toast.error(`Please fill all fields in Item Row ${i + 1}`);
      return;
    }
  }

  try {
    const payload = {
      company_name: headerData.companyName,
      vendor_name: headerData.vendorName,
      transport: headerData.transport,
      vehicle_number: headerData.vehicleNo,
      invoice_no: headerData.invoiceNo,
      invoice_date: headerData.invoiceDate,
      receive_location: headerData.receiveLocation,
      received_by: headerData.receivedBy,

      erp_grn_no: headerData.erpGrnNo,
      grn_date: headerData.grnDate,
      gate_pass_no: headerData.gatePassNo,

      items: items.map((item) => ({
        item_code: item.item_code,
        description: item.description,
        unit: item.unit,
        length: parseFloat(item.length),
        width: parseFloat(item.width),
        thickness: parseFloat(item.thickness),
        challan_qty: parseFloat(item.challan_qty),
        total_qty: parseFloat(item.total_qty),
      })),
    };

    await axios.post("http://127.0.0.1:8000/api/grn/", payload);

    toast.success("GRN Saved Successfully");

    fetchGRN();
    setHeaderData({
  companyName: "BALABHARTI INFRASTRUCTURE PVT LTD",
  vendorName: "",
  transport: "",
  vehicleNo: "",
  invoiceNo: "",
  invoiceDate: "",
  receiveLocation: "",
  receivedBy: "",
  grnNo: "",
  grnPlateDate: new Date().toISOString().split("T")[0],
  erpGrnNo: "",
  grnDate: "",
  gatePassNo: ""
});

setItems([
  {
    item_code: "",
    description: "",
    unit: "",
    length: 0,
    width: 0,
    thickness: 0,
    challan_qty: 0,
    total_qty: 0
  }
]);
    setOpen(false);

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data);
    toast.error("Error saving GRN");
  }
};
  return (
    <Box p={3}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography variant="h6" mb={2}>
        GRN Entry
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" size="small" onClick={() => setOpen(true)}>
          Create New GRN
        </Button>
      </Box>

      {/* Main GRN Table */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Sr</TableCell>
        <TableCell>Company Name</TableCell>
        <TableCell>Vendor Name</TableCell>
        <TableCell>Transport</TableCell>
        <TableCell>Vehicle No</TableCell>
        <TableCell>Invoice No</TableCell>
        <TableCell>Invoice Date</TableCell>
        <TableCell>Received Location</TableCell>
        <TableCell>ERP-GRN Number</TableCell>
        <TableCell>ERP-GRN Date</TableCell>
        <TableCell>Gate Pass No</TableCell>
        <TableCell>Item Code</TableCell>
        <TableCell>Unique Item ID</TableCell>   {/* ✅ ADD ONLY */}
        <TableCell>Description</TableCell>
        <TableCell>Unit</TableCell>
        <TableCell>Length</TableCell>
        <TableCell>Width</TableCell>
        <TableCell>Thickness</TableCell>
        <TableCell>Challan Qty</TableCell>
        <TableCell>Total Qty</TableCell>
        {/* <TableCell>Balance Qty</TableCell> */}
      </TableRow>
    </TableHead>

    <TableBody>
      {grnList.flatMap((grn, grnIndex) =>
        grn.items.map((item, itemIndex) => (
          <TableRow key={`${grnIndex}-${itemIndex}`}>
            <TableCell>{grnIndex + 1}.{itemIndex + 1}</TableCell>
            <TableCell>{grn.company_name}</TableCell>
<TableCell>{grn.vendor_name}</TableCell>
<TableCell>{grn.transport}</TableCell>
<TableCell>{grn.vehicle_no}</TableCell>
<TableCell>{grn.invoice_no}</TableCell>
<TableCell>{grn.invoice_date}</TableCell>
<TableCell>{grn.receive_location}</TableCell>
<TableCell>{grn.grn_no}</TableCell>
<TableCell>{grn.grn_date}</TableCell>
<TableCell>{grn.gate_pass_no}</TableCell>
<TableCell>{item.item_code}</TableCell>
<TableCell>{item.unique_item_id ? item.unique_item_id : "-"}</TableCell>
<TableCell>{item.description}</TableCell>
<TableCell>{item.unit}</TableCell>
<TableCell>{item.length}</TableCell>
<TableCell>{item.width}</TableCell>
<TableCell>{item.thickness}</TableCell>
<TableCell>{item.challan_qty}</TableCell>
<TableCell>{item.total_qty}</TableCell>
  
{/* <TableCell>{item.balance_qty}</TableCell> */}
          </TableRow>
        ))
      )}

      {grnList.length === 0 && (
        <TableRow>
          <TableCell colSpan={17} align="center">
            No GRN Records Found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      {/* Popup */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xl"
        BackdropProps={{ sx: { backdropFilter: "blur(4px)" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Create New GRN</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>

          <Box mb={2} p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle2">GRN Plate No</Typography>
      <Typography fontWeight="bold">{headerData.grnNo}</Typography>
    </Grid>

    <Grid item xs={12} md={4}>
      <Typography variant="subtitle2">GRN Plate Date</Typography>
      <Typography fontWeight="bold">
        {headerData.grnPlateDate}
      </Typography>
    </Grid>
  </Grid>
</Box>

          {/* HEADER SECTION */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Company Name" value={headerData.companyName} disabled />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Vendor Name" name="vendorName" onChange={handleHeaderChange} error={errors.vendorName}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Transport" name="transport" onChange={handleHeaderChange} error={errors.transport} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Vehicle Number" name="vehicleNo" onChange={handleHeaderChange} error={errors.vehicleNo} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Invoice No" name="invoiceNo" onChange={handleHeaderChange} error={errors.invoiceNo} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" type="date" label="Invoice Date" InputLabelProps={{ shrink: true }} name="invoiceDate" onChange={handleHeaderChange} error={errors.invoiceDate} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Received Location" name="receiveLocation" onChange={handleHeaderChange} error={errors.receiveLocation} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Received By" name="receivedBy" onChange={handleHeaderChange} error={errors.receivedBy} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="ERP GRN Number" name="erpGrnNo" onChange={handleHeaderChange} error={errors.erpGrnNo} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} label="ERP-GRN Date" name="grnDate" onChange={handleHeaderChange} error={errors.grnDate} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="Gate Pass No" name="gatePassNo" onChange={handleHeaderChange} error={errors.gatePassNo}  />
            </Grid>
          </Grid>

          {/* ITEM TABLE */}
          <Typography variant="subtitle2" mb={1}>
            Item Details
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sr</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Unit</TableCell>

                {/* 🔥 NEW DIMENSIONS */}
                <TableCell>Length</TableCell>
                <TableCell>Width</TableCell>
                <TableCell>Thickness</TableCell>

                <TableCell>Challan Qty</TableCell>
                <TableCell>Total Qty</TableCell>

                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Autocomplete
                      options={materials.filter(m => m.item_code && m.item_code !== "")}
                      getOptionLabel={(option) => option.item_code || ""}
                      value={
                        materials.find((m) => m.item_code === item.item_code) || null
                      }
                      onChange={(e, newValue) => {
                        const updated = [...items];

                        updated[index] = {
                          ...updated[index],
                          item_code: newValue?.item_code || "",
                          description: newValue?.item_name || "",   // ✅ AUTO FILL
                          unit: newValue?.item_unit || "",          // ✅ AUTO FILL
                        };

                        setItems(updated);
                      }}
                      sx={{
                        minWidth: 160,
                        "& .MuiInputBase-root": {
                          height: 36,
                          fontSize: "13px",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search Code..."
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                  <Autocomplete
                    options={materials}
                    getOptionLabel={(option) => option.item_name || ""}
                    value={materials.find((m) => m.item_name === item.description) || null}
                    onChange={(e, newValue) => {
                      const updated = [...items];

                      updated[index] = {
                        ...updated[index],
                        item_code: newValue?.item_code || "",    // 🔥 AUTO FILL
                        description: newValue?.item_name || "",
                        unit: newValue?.item_unit || "",         // 🔥 AUTO FILL
                      };

                      setItems(updated);
                    }}
                    sx={{
                      width: 250,
                      "& .MuiInputBase-root": {
                        height: 40,
                        fontSize: "14px",
                      },
                    }}
                    ListboxProps={{
                      style: { maxHeight: 300 }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search Item Name..."
                        variant="outlined"
                      />
                    )}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField size="small" value={item.unit || ""} error={errors[`unit_${index}`]} />
                  </TableCell>

                  {/* 🔥 DIMENSIONS */}
                  <TableCell>
                    <TextField size="small" value={item.length} onChange={(e) => handleItemChange(index, "length", Number(e.target.value))}/>
                  </TableCell>

                  <TableCell>
                    <TextField size="small" value={item.width} onChange={(e) => handleItemChange(index, "width", Number(e.target.value))}/>
                  </TableCell>

                  <TableCell>
                    <TextField size="small" value={item.thickness} onChange={(e) => handleItemChange(index, "thickness", Number(e.target.value))}/>
                  </TableCell>

                  <TableCell>
                    <TextField size="small" value={item.challan_qty} onChange={(e) => handleItemChange(index, "challan_qty", Number(e.target.value))}/>
                  </TableCell>
                  <TableCell>
                    <TextField size="small" value={item.total_qty} onChange={(e) => handleItemChange(index, "total_qty", Number(e.target.value))}/>
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => deleteItemRow(index)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={2}>
            <Button size="small" onClick={addItemRow}>
              + Add Item
            </Button>
          </Box>

        </DialogContent>

        <DialogActions>
          <Button size="small" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleSave} disabled={!headerData.vendorName || items.length === 0}>
            Save GRN
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}