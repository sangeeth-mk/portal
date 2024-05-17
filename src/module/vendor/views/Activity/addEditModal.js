import React, { useEffect, useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/system/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Textfield from 'ui-component/common/TextField';
import { Button, Tab, Tabs } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import commonStyles from 'assets/style/Style';
import 'assets/style/style.css';

import { addCustomer, updateCustomer, getCustomerById, getCustomer } from 'module/vendor/container/customerContainer/slice';
import { getCountry } from 'module/admin/container/countryContainer/slice';
import { getEnqSource } from 'module/admin/container/enqSourceContainer/slice';
import { getState } from 'module/admin/container/stateContainer/slice';
import { getEnqMode } from 'module/admin/container/enqModeContainer/slice';
import { getDistrict } from 'module/admin/container/districtContainer/slice';
import styled from '@emotion/styled';

const AddEditModal = ({ formtype, data, handleClose }) => {
  const theme = useTheme();
  const style = commonStyles(theme);
  const dispatch = useDispatch();

  const customerByIdData = useSelector((state) => state.data.customers.customerByIdData);
  const CountryDetails = useSelector((state) => state.adminReducer.country.countryData);
  // const enqSourceDetails = useSelector((state) => state.adminReducer.enqsource.enqsourceData);
  const stateDetails = useSelector((state) => state.adminReducer.state.stateData);
  // const enqModDetails = useSelector((state) => state.adminReducer.enqmode.enqModeData);
  const district = useSelector((state) => state.adminReducer.district.districtData);

  console.log("===customerByIdData=====", customerByIdData);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getEnqSource());
    dispatch(getState());
    dispatch(getEnqMode());
    dispatch(getDistrict());
  }, [dispatch]);

  const Input = styled('input')({
    display: 'none',
  });

  useEffect(() => {
    if (data && data.id && formtype === 'editform') {
      dispatch(getCustomerById(data.id));
    }
  }, [dispatch, data, formtype]);

  const indiaCountryId = CountryDetails?.rows?.find((country) => country.name === 'INDIA')?.id || '';
  const keralaStateId = stateDetails?.rows?.find((state) => state.name === 'Kerala')?.id || '';
  const kozhikodeDistrictId = district?.rows?.find((district) => district.name === 'kozhikode')?.id || '';

  const [initialValues, setInitialValues] = useState({
    custType: 'individual',
    // TaskType: '',
    TaskCategory: '',
    TaskPriority: '',
    AssignedTo: '',
    StartDate: '',
    EndDate: '',
    Title: '',
    desc: '',

    // address: {
    //   country: indiaCountryId,
    //   state: keralaStateId,
    //   district: kozhikodeDistrictId,
    //   city: '',
    //   addr1: '',
    //   addr2: '',
    //   postalCode: ''
    // },
    // enqMode: '',
    // enqSource: '',
    // gstin: '',
    // licenceNo: '',
    // remarks: '',
    // extRefNo: ''
  });

  useEffect(() => {
    if (data && data.id && formtype === 'editform') {
      setInitialValues({
        custType: customerByIdData?.custType?.values || 'individual',
        fName: customerByIdData?.fName || '',
        lName: customerByIdData?.lName || '',
        email: customerByIdData?.email || '',
        contactMobile1: customerByIdData?.contactMobile1 || '',
        contactMobile2: customerByIdData?.contactMobile2 || '',
        address: {
          country: customerByIdData?.address?.country.id?.name || indiaCountryId,
          state: customerByIdData?.address?.state?.id?.name || keralaStateId,
          district: customerByIdData?.address?.district?.id?.name || kozhikodeDistrictId,
          city: customerByIdData?.address?.city || '',
          addr1: customerByIdData?.address?.addr1 || '',
          addr2: customerByIdData?.address?.addr2 || '',
          postalCode: customerByIdData?.address?.postalCode || ''
        },

        enqMode: customerByIdData?.enqMode?.id || '',
        enqSource: customerByIdData?.enqSource?.id || '',
        licenceNo: customerByIdData?.licenceNo || '',
        gstin: customerByIdData?.gstin || '',
        remarks: customerByIdData?.remarks || '',
        extRefNo: customerByIdData?.extRefNo || ''
      });
    }
  }, [data, customerByIdData, formtype, indiaCountryId, keralaStateId, kozhikodeDistrictId]);

  const validationSchema = Yup.object({
    custType: Yup.string().required('  Customer Type is required'),
    fName: Yup.string().required('First Name is required'),
    contactMobile1: Yup.string()
      .required('Mobile is required')
      .matches(/^\d{10}$/, 'Must be a 10-digit mobile number'),
    contactMobile2: Yup.string().matches(/^\d{10}$/, 'Must be a 10-digit mobile number')
  });

  const onSubmit = async (values, { resetForm }) => {

    try {
      if (formtype && formtype === 'addform') {
        await dispatch(addCustomer(values));
        await dispatch(getCustomer());
      } else {
        values.id = data.id;
        await dispatch(updateCustomer(values));
        await dispatch(getCustomer());
      }
      handleClose(formtype);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Box onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
              <Tab label="Activity Details" />
              <Tab label="Client Details" />
            </Tabs>
            <TabPanel value={currentTab} index={0}>
              {/* Basic Details Tab */}
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <FormLabel>
                    Type
                  </FormLabel>
                  <Select
                    name="custType"
                    id="custType"
                    value={values.custType}
                    onChange={(e) => {
                      setFieldValue('custType', e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    style={{
                      height: '56px',
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid black'
                    }}
                    displayEmpty
                  >
                    <MenuItem value="individual" disabled>
                      Select  Type
                    </MenuItem>
                    <MenuItem value="organization">Organization</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                  </Select>
                  <ErrorMessage name="custType" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={3}>
                  <FormLabel>
                    Category
                    {/* <span style={{ color: 'red' }}>*</span> */}
                  </FormLabel>
                  <Select
                    name="ActivityCategory"
                    id="ActivityCategory"
                    value={values.custType}
                    onChange={(e) => {
                      setFieldValue('TaskType', e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    style={{
                      height: '56px',
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid black'
                    }}
                    displayEmpty
                  >
                    <MenuItem value="individual" disabled>
                      Select Category
                    </MenuItem>
                    <MenuItem value="organization">Organization</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                  </Select>
                  <ErrorMessage name="custType" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={3}>
                  <FormLabel>
                    Priority
                  </FormLabel>
                  <Select
                    name="ActivityPriority"
                    id="ActivityPriority"
                    value={values.custType}
                    onChange={(e) => {
                      setFieldValue('TaskCategory', e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    style={{
                      height: '56px',
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid black'
                    }}
                    displayEmpty
                  >
                    <MenuItem value="individual" disabled>
                      Select  Priority
                    </MenuItem>
                    <MenuItem value="organization">Organization</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                  </Select>
                  <ErrorMessage name="custType" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={3}>
                  <FormLabel>
                    Assigned To
                  </FormLabel>
                  <Select
                    name="AssignedTo"
                    id="AssignedTo"
                    value={values.custType}
                    onChange={(e) => {
                      setFieldValue('AssignedTo', e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    style={{
                      marginTop: 2,
                      height: '56px',
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid black'
                    }}
                    displayEmpty
                  >
                    <MenuItem value="individual" disabled>
                      Assigned To
                    </MenuItem>
                    <MenuItem value="organization">Organization</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                  </Select>
                  <ErrorMessage name="custType" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={4} >
                  <FormLabel>Start Date</FormLabel>
                  <Textfield name="StartDate" id="StartDate" type='date' component={Textfield} onChange={(e) => {
                    setFieldValue('StartDate', e.target.value);
                  }} />
                  <ErrorMessage name="StartDate" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={4} >
                  <FormLabel>Follow Up Date</FormLabel>
                  <Textfield name="StartDate" id="StartDate" type='date' component={Textfield} onChange={(e) => {
                    setFieldValue('StartDate', e.target.value);
                  }} />
                  <ErrorMessage name="StartDate" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={4} >
                  <FormLabel>End Date</FormLabel>
                  <Textfield name="StartDate" id="StartDate" type='date' component={Textfield} onChange={(e) => {
                    setFieldValue('StartDate', e.target.value);
                  }} />
                  <ErrorMessage name="StartDate" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>

                <Grid item md={5}>
                  <FormLabel>Name</FormLabel>
                  <Textfield name="Name" id="Title" placeholder="Name" component={Textfield} />
                  <ErrorMessage name="Name" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />


                  <FormLabel>Add Attachments</FormLabel>
                  <label htmlFor="upload-button">
                    <Input
                      accept="*"
                      id="upload-button"
                      type="file"
                      name="taskRef"
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      // value={values.taskRef}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <svg
                          style={{ marginRight: 8 }}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 17h14v2H5v-2zm7-12l5 5h-4v6h-2v-6H7l5-5z"
                            fill="currentColor"
                          />
                        </svg>
                        Add Attachments
                      </span>
                    </Button>
                  </label>

                </Grid>

                <Grid item xs={12} md={7}>
                  <FormLabel>Description</FormLabel>
                  <Textfield
                    multiline
                    minRows={5.5}
                    maxRows={5}

                    aria-label="maximum height"
                    name="desc"
                    id="desc"
                    placeholder="Description"
                    component={Textfield}
                  />
                  <ErrorMessage name="desc" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>


                <Grid item xs={12} sm={6}></Grid>
                <Grid container spacing={2}>

                  <Grid item xs={12} sm={6}>

                  </Grid>

                </Grid>

              </Grid>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Grid >
                    <FormLabel>Name</FormLabel>
                    <Textfield name="email" id="email" placeholder='Client Name' component={Textfield} />
                    <ErrorMessage name="email" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                  </Grid>

                  <Grid >
                    <FormLabel>Reported Location</FormLabel>
                    <Textfield name="email" id="email" placeholder='Client Location' component={Textfield} />
                    <ErrorMessage name="email" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                  </Grid>

                  <Grid >
                    <FormLabel>Reported Person</FormLabel>
                    <Textfield name="email" id="email" placeholder='Reported Person' component={Textfield} />
                    <ErrorMessage name="email" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                  </Grid>
                </Grid>

                <Grid item md={6}>
                  <FormLabel>Spoc Designation</FormLabel>
                  <Textfield name="email" id="email" placeholder='Spoc Designation' component={Textfield} />
                  <ErrorMessage name="email" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />

                  <FormLabel>Description</FormLabel>
                  <Textfield
                    multiline
                    minRows={5.5}
                    maxRows={5}

                    aria-label="maximum height"
                    name="desc"
                    id="desc"
                    placeholder="Description"
                    component={Textfield}
                  />
                  <ErrorMessage name="desc" component="div" style={{ color: '#f54d4f', fontSize: 12 }} />
                </Grid>
              </Grid>
            </TabPanel>
            <Button type="submit" sx={style.changeBtn}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index } = props;

  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

export default AddEditModal;
