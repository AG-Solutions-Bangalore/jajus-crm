import React, { useEffect, useState } from "react";
import styles from "./ledger.module.css";
import Layout from "../../../layout/Layout";
import {
  Autocomplete,
  Button,
  Grid2,
  MenuItem,
  TextField,
} from "@mui/material";
import { baseURL } from "../../../base/BaseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Ledger = () => {
  let navigate = useNavigate();

  var today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [trialBalance, setTrialBalanceDownload] = useState({
    account_name: null,
    from_date: "2024-04-01",
    to_date: todayback,
  });

  const onInputChange = (e) => {
    setTrialBalanceDownload({
      ...trialBalance,
      [e.target.name]: e.target.value,
    });
  };

  // useEffect(() => {
  //     var isLoggedIn = localStorage.getItem("user_type_id");
  //     if(!isLoggedIn){

  //     window.location = "/login";

  //     }else{

  //     }

  // });

  const [accountName, setAccountName] = useState([]);

  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(baseURL + "/web-fetch-ledger-accountname", requestOptions)
      .then((response) => response.json())
      .then((data) => setAccountName(data.mix));
  }, []);

  const onReportView = (e) => {
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      localStorage.setItem("account_name", trialBalance.account_name);
      localStorage.setItem("from_date", trialBalance.from_date);
      localStorage.setItem("to_date", trialBalance.to_date);
      navigate("/ledgerReport");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      let data = {
        account_name: trialBalance.account_name,
        from_date: trialBalance.from_date,
        to_date: trialBalance.to_date,
      };

      axios({
        url: baseURL + "/web-download-ledger-report-new",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "ledger.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Ledger Report is Downloaded Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Ledger Report is Not Downloaded");
        });
    }
  };

  return (
    <Layout>
      <div className={styles["main-container"]}>
        <h1>Ledger Form</h1>
        <div className={styles["sub-container"]}>
          <form id="addIndiv" autoComplete="off">
            <div>
              <Grid2 container spacing={3}>
                <Grid2 item>
                  <Autocomplete
                    disablePortal
                    options={accountName}
                    getOptionLabel={(option) => option?.account_name || ""}
                    sx={{ width: 350 }}
                    value={
                      accountName.find(
                        (option) =>
                          option.account_name === trialBalance.account_name
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      onInputChange({
                        target: {
                          name: "account_name",
                          value: newValue ? newValue.account_name : "",
                        },
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Account Name"
                        variant="standard"
                        required
                        InputLabelProps={{ shrink: true }}
                        autoComplete="off"
                        name="account_name"
                      />
                    )}
                  />
                </Grid2>
                <Grid2 item>
                  <TextField
                    fullWidth
                    sx={{ width: 350 }}
                    variant="standard"
                    required
                    label="From Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="from_date"
                    value={trialBalance.from_date}
                    onChange={(e) => onInputChange(e)}
                  />
                </Grid2>
                <Grid2 item>
                  <TextField
                    fullWidth
                    sx={{ width: 350 }}
                    variant="standard"
                    required
                    label="To Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="to_date"
                    value={trialBalance.to_date}
                    onChange={(e) => onInputChange(e)}
                  />
                </Grid2>
              </Grid2>
            </div>
            <div className={styles["btn-main-container"]}>
              <div className={styles["btn-container"]}>
                <Button
                  type="submit"
                  color="primary"
                  onClick={(e) => onReportView(e)}
                >
                  View
                </Button>
                <Button onClick={(e) => onSubmit(e)}>Download</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Ledger;