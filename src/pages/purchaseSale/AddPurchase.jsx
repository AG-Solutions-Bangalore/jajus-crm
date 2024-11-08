import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
// import Select from "react-select";
import { toast } from "react-toastify";
import BASE_URL, { baseURL } from "../../base/BaseUrl";
import { IconButton, MenuItem, TextField , Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Layout from "../../layout/Layout";
import { FaPlus } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
// import "./dailyBook.css";

const AddPurchase = (props) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [currentYear, setCurrentYear] = useState(null);

  const [purchase, setPurchaseGranite] = useState({
    purchase_date: todayback,
    purchase_year: currentYear,
    purchase_type: "Granites",
    purchase_item_type: "",
    purchase_supplier: "",
    purchase_bill_no: "",
    purchase_amount: "",
    purchase_other: "",
    purchase_estimate_ref: "",
    purchase_no_of_count: "",
    purchase_sub_data: "",
  });

  const useTemplate = {
    purchase_sub_item: "",
    purchase_sub_qnty: "",
    purchase_sub_qnty_sqr: "",
    purchase_sub_rate: "",
    purchase_sub_amount: "",
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [users, setUsers] = useState([useTemplate]);

  const [purchase__count, setCount] = useState(1);


  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/web-fetch-year", requestOptions)
      .then((response) => response.json())
      .then((data) => setCurrentYear(data.year?.current_year));
  }, []);

  const addItem = () => {
    setUsers([...users, useTemplate]);
    setCount(purchase__count + 1);
  };

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setUsers(updatedUsers);
  };

  const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
    setCount(purchase__count - 1);
  };

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const [productTypeGroup, setProductTypeGroup] = useState([]);
  useEffect(() => {
    axios({
      url: BASE_URL + "/api/web-fetch-product-type-group",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setProductTypeGroup(res.data.product_type_group);
    });
  }, []);

  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios({
      url:
        BASE_URL +
        "/api/web-fetch-product-types/" +
        purchase.purchase_item_type,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setProduct(res.data.product_type);
    });
  }, [purchase.purchase_item_type]);

  const onInputChange = (e) => {
    if (e.target.name == "purchase_amount") {
      if (validateOnlyNumber(e.target.value)) {
        setPurchaseGranite({
          ...purchase,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "purchase_other") {
      if (validateOnlyNumber(e.target.value)) {
        setPurchaseGranite({
          ...purchase,
          [e.target.name]: e.target.value,
        });
      }

      const total =
        parseInt(e.target.value || 0) + parseInt(purchase.purchase_amount || 0);
      setPurchaseGranite((purchase) => ({
        ...purchase,
        purchase_amount: total,
      }));
    } else {
      setPurchaseGranite({
        ...purchase,
        [e.target.name]: e.target.value,
      });
    }
  };

  const QntyCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].purchase_sub_amount =
      tempUsers[selectedValue].purchase_sub_qnty_sqr *
      tempUsers[selectedValue].purchase_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
      result.push(users[i].purchase_sub_qnty_sqr * users[i].purchase_sub_rate);
    }

    const total =
      result.reduce((acc, curr) => acc + curr, 0) +
      parseInt(purchase.purchase_other || 0);

    setPurchaseGranite((purchase) => ({
      ...purchase,
      purchase_amount: total,
    }));
  };

  const RateCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].purchase_sub_amount =
      tempUsers[selectedValue].purchase_sub_qnty_sqr *
      tempUsers[selectedValue].purchase_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
      result.push(users[i].purchase_sub_qnty_sqr * users[i].purchase_sub_rate);
    }

    const total =
      result.reduce((acc, curr) => acc + curr, 0) +
      parseInt(purchase.purchase_other || 0);

    setPurchaseGranite((purchase) => ({
      ...purchase,
      purchase_amount: total,
    }));
  };

  const onSubmit = (e) => {
    let data = {
      purchase_date: purchase.purchase_date,
      purchase_year: currentYear,
      purchase_type: purchase.purchase_type,
      purchase_item_type: purchase.purchase_item_type,
      purchase_supplier: purchase.purchase_supplier,
      purchase_bill_no: purchase.purchase_bill_no,
      purchase_other: purchase.purchase_other,
      purchase_amount: purchase.purchase_amount,
      purchase_no_of_count: purchase__count,
      purchase_estimate_ref: purchase.purchase_estimate_ref,
      purchase_sub_data: users,
    };
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: BASE_URL + "/api/web-create-purchase",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Purchase Created Sucessfully");
          setIsButtonDisabled(false);
          navigate("/purchase-granite-list");
        } else {
          toast.error("Purchase Created for a day");
          setIsButtonDisabled(false);
        }
      });
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <h1 className="flex text-2xl text-[#464D69] font-semibold ml-2 content-center">
          <Link to="/purchase-granite-list">
                <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
              </Link> &nbsp;
            Add Purchase Granite
          </h1>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
         
            <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
                <form id="addIndiv" autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Date"
                        size="small"
                        autoComplete="Name"
                        name="purchase_date"
                        value={purchase.purchase_date}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Supplier"
                        autoComplete="Name"
                        name="purchase_supplier"
                        value={purchase.purchase_supplier}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Ref Bill No"
                        autoComplete="Name"
                        name="purchase_bill_no"
                        value={purchase.purchase_bill_no}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        label="Item Type"
                        required
                        size="small"
                        SelectProps={{
                          MenuProps: {},
                        }}
                        select
                        autoComplete="Name"
                        name="purchase_item_type"
                        value={purchase.purchase_item_type}
                        onChange={(e) => onInputChange(e)}
                      >
                        {productTypeGroup.map((fabric, key) => (
                          <MenuItem key={key} value={fabric.product_type_group}>
                            {fabric.product_type_group}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Other Amount"
                        autoComplete="Name"
                        name="purchase_other"
                        value={purchase.purchase_other}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Total Amount"
                        disabled
                        autoComplete="Name"
                        name="purchase_amount"
                        value={purchase.purchase_amount}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-4 mt-3">
                    <div className="col-sm-12 col-md-4 col-xl-6">
                      {users.map((user, index) => (
                        <div className="row " key={index}>
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Item"
                                autoComplete="Name"
                                size="small"
                                required
                                SelectProps={{
                                  MenuProps: {},
                                }}
                                select
                                name="purchase_sub_item"
                                value={user.purchase_sub_item}
                                onChange={(e) => onChange(e, index)}
                              >
                                {product.map((fabric, key) => (
                                  <MenuItem
                                    key={key}
                                    value={fabric.product_type}
                                  >
                                    {fabric.product_type}
                                  </MenuItem>
                                ))}
                              </TextField>

                             
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Qnty in Piece"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                size="small"
                                name="purchase_sub_qnty"
                                value={user.purchase_sub_qnty}
                                onChange={e => {onChange(e, index);}}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Qnty in Sqr ft"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                size="small"
                                name="purchase_sub_qnty_sqr"
                                value={user.purchase_sub_qnty_sqr}
                                onChange={e => {onChange(e, index); QntyCal(index)}}
                              />
                            </div>{" "}
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Rate"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                size="small"
                                name="purchase_sub_rate"
                                value={user.purchase_sub_rate}
                                onChange={e => {onChange(e, index); RateCal(index) }}
                              />
                            </div>{" "}
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Amount"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                size="small"
                                name="purchase_sub_amount"
                                value={user.purchase_sub_amount}
                                onChange={e => onChange(e, index)}
                              />
                            </div>
                            <div className="col-sm-12 col-md-12 col-xl-1">
                            <IconButton onClick={() => removeUser(index)}>
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="row mt-4">
                        <div >
                          <Button
                            onClick={(e) => addItem(e)}
                          >
                          <FaPlus /> &nbsp;  Add More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                        color="primary"
                        onClick={(e) => onSubmit(e)}
                        disabled={isButtonDisabled}
                      >
                        
                        {isButtonDisabled ? "Submiting..." : "Submit"}
                      </button>
                    <Link to="/purchase-granite-list">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                        Cancel
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
          
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPurchase;
