import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  ToastAndroid,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import {
  FAB,
  RadioButton,
  TextInput,
  Title,
  IconButton,
  Colors,
  Portal,
  Dialog,
  Button,
  HelperText,
  Provider,
  List,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { Value } from 'react-native-reanimated';
import { RNCamera } from 'react-native-camera';
import * as fieldReportActions from 'app/store/actions/fieldReportAction';
import DocumentPicker from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';
import { ProgressBar } from '@react-native-community/progress-bar-android';
const Factory: React.FC = ({ route }) => {
  let mounted = true;
  const dispatch = useDispatch();
  const takePicture = async () => {
    if (cameraRef) {
      const options = {
        quality: 0.5,
        base64: true,
        fixOrientation: true,
        forceUpOrientation: true,
      };
      const data = await cameraRef.current.takePictureAsync(options);
      // console.log(data.uri);
      //   setUri(data.uri);
      setState({ ...state, uri: data.uri });
    }
  };

  let cameraRef = React.useRef(null);

  const closeCamera = () => {
    setState({ ...state, openCamera: false });
    // setFabAction('');
  };
  const removeUri = () => setState({ ...state, uri: '' });
  const showModalFunction = (visible, imageURL) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    // setImageuri(imageURL);
    // setModalVisibleStatus(visible);
    setState({ ...state, imageuri: imageURL, modalVisibleStatus: visible });
  };
  const uploadFiles = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      // setPictures(pictures.concat(results));
      // console.log(results);
      let addPictures = [];
      results.forEach((result) => addPictures.push(result.uri));
      // console.log(addPictures);
      //   setPictures(pictures.concat(addPictures));
      setState({ ...state, pictures: state.pictures.concat(addPictures) });
      // results.forEach((result) => setPictures(pictures.concat(result.uri)));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        ToastAndroid.show('Unable to pick image', ToastAndroid.SHORT);
      }
    }
  };
  const removeImage = (uri) => {
    const newPicters = state.pictures.filter((e) => e !== uri);
    // setPictures(newPicters);
    setState({
      ...state,
      pictures: newPicters,
      imageuri: '',
      modalVisibleStatus: false,
    });
  };

  const saveImage = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    await PermissionsAndroid.request(permission);
    CameraRoll.save(state.uri, {
      type: 'auto',
      album: 'camera',
    }).then((data) => {
      if (state.type === 'front' && state.selfie.length === 0) {
        setState({
          ...state,
          selfie: state.selfie.concat(data),
          uri: '',
          openCamera: false,
          entryCrd: ['loading', 'loading'],
        });
        getGeolocation();
      }
      if (state.type === 'back') {
        setState({
          ...state,
          uri: '',
          openCamera: false,
          pictures: state.pictures.concat(data),
        });
      }
    });
  };

  const changeSos = () => setState({ ...state, showSos: !state.showSos });

  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };

  const getGeolocation = () => {
    Geolocation.getCurrentPosition(success, error, options);
  };

  const [fabAction, setFabAction] = useState('');

  const onStateChange = () => {
    setState({ ...state, open: !state.open });
  };

  const [state, setState] = useState({
    id: route.params._id,
    modalVisibleStatus: false,
    imageuri: '',
    showSos: false,
    entryCrd: [0, 0],
    locationError: false,
    selfie: [],
    uri: '',
    openCamera: false,
    open: false,
    pictures: [],
    type: 'back',
    pocName: '',
    pocPhone: '',
    pocEmail: '',
    unitStatus: 'operational',
    uosdetail: '',
    nUos: 'temp-closed',
    nuosDetail: '',
    etpos: 'operational',
    etposDetail: '',
    cpc: '',
    ipc: '',
    ppopd: '',
    fwwpdbofm: '',
    ocs: 'yes',
    sonfc: 'valid',
    mrr: 'drain',
    mrrname: '',
    csac: 'valid',
    wc: 'valid',
    hc: 'valid',
    cc: 'valid',
    sfwc: 'borewell',
    sfwcdetail: '',
    fib: 'installed-working',
    fibDetail: '',
    fietpinlet: 'installed-working',
    fietpinletdetail: '',
    fietpoutlent: 'installed-working',
    fietpoutlentdetail: '',
    fmetpoutletcdf: '',
    fmetpoutletpdf: '',
    os: 'installed-working',
    osDetail: '',
    semfetp: 'yes',
    semfer: '',
    specificobservations: '',
    sos: 'denied-entry',
    sosDetail: '',
    sendToserver: false,
  });

  useEffect(() => {
    switch (fabAction) {
      case 'upload-files':
        uploadFiles();
        setFabAction('');
        break;
      case 'take-photo':
        setState({ ...state, type: 'back', openCamera: true });
        setFabAction('');
        break;
      case 'sos':
        changeSos();
        setFabAction('');
        break;
    }
  }, [fabAction]);

  const sosRequest = () => {
    let data = {
      id: route.params._id,
      attendance: {
        entrylocation: { type: 'Point', coordinates: state.entryCrd },
      },
      sos: state.sos,
      sosdetails: state.sosDetail,
      fieldReport: {
        images: [...state.selfie, ...state.pictures],
      },
    };
    changeSos();
    // check errors
    if (data.sos === 'other' && data.sosdetails === '') {
      setErrors(['Add sos details']);
    } else {
      // send to server
      setLoading(true);
      setState({ ...state, sendToserver: true });
      dispatch(fieldReportActions.saveServerData(data, changeProgress));
    }
  };

  const unitUnoperationalRequest = () => {
    const data = {
      id: route.params._id,
      attendance: {
        entrylocation: { type: 'Point', coordinates: state.entryCrd },
      },
      fieldReport: {
        images: [...state.selfie, ...state.pictures],
        poc: [
          {
            name: state.pocName,
            number: state.pocEmail,
            email: state.pocPhone,
          },
        ],
        uos: state.unitStatus, // 0,1,2
        uosdetail: state.uosdetail,
        nous: state.nUos, // 0,1,2
        nousdetail: state.nuosDetail,
      },
    };
    let errors = [];
    if (data.fieldReport.poc[0].name === '') {
      errors.push('Add contacted person name');
    }
    if (data.fieldReport.poc[0].email === '') {
      errors.push('Add contacted person email');
    }
    if (data.fieldReport.poc[0].number === '') {
      errors.push('Add contacted person Phone Number');
    }
    if (data.fieldReport.nous === 'other' && data.nousdetail === '') {
      errors.push('Add non operational unit status');
    }
    if (errors.length > 0) {
      setErrors(errors);
    } else {
      setLoading(true);
      setState({ ...state, sendToserver: true });
      dispatch(fieldReportActions.saveServerData(data, changeProgress));
    }
  };

  const unitOperationalRequest = () => {
    const data = {
      id: route.params._id,
      attendance: {
        entrylocation: { type: 'Point', coordinates: state.entryCrd },
      },
      fieldReport: {
        images: [...state.selfie, ...state.pictures],
        poc: [
          {
            name: state.pocName,
            number: state.pocEmail,
            email: state.pocPhone,
          },
        ],
        uos: state.unitStatus, // 0,1,2
        uosdetail: state.uosdetail,
        etpos: state.etpos,
        etposdetail: state.etposDetail,
        cpc: state.cpc,
        ipc: state.ipc,
        ppopd: state.ppopd,
        fwwpdbofm: state.fwwpdbofm,
        ocs: state.ocs,
        sonfc: state.sonfc,
        mrr: state.mrr,
        mrrname: state.mrrname,
        csac: state.csac,
        wc: state.wc,
        hc: state.hc,
        cc: state.cc,
        sfwc: state.sfwc,
        sfwcdetail: state.sfwcdetail,
        fib: state.fib,
        fibdetail: state.fibDetail,
        fietpinlet: state.fietpinlet,
        fietpinletdetail: state.fietpinletdetail,
        fietpoutlent: state.fietpoutlent,
        fietpoutlentdetail: state.fietpoutlentdetail,
        fmetpoutletcdf: state.fmetpoutletcdf,
        fmetpoutletpdf: state.fmetpoutletpdf,
        os: state.os,
        osdetail: state.osDetail,
        semfetp: state.semfetp,
        semfer: state.semfer,
        specificobservations: state.specificobservations,
      },
    };
    let errors = [];
    if (data.fieldReport.poc[0].name === '') {
      errors.push('Add contacted person name');
    }
    if (data.fieldReport.poc[0].email === '') {
      errors.push('Add contacted person email');
    }
    if (data.fieldReport.poc[0].number === '') {
      errors.push('Add contacted person Phone Number');
    }
    if (data.fieldReport.uos === 'other' && data.fieldReport.uosdetail === '') {
      errors.push('Add unit operational status');
    }
    if (
      data.fieldReport.etpos === 'other' &&
      data.fieldReport.etposdetail === ''
    ) {
      errors.push('Add ETP status');
    }
    if (data.fieldReport.cpc === '') {
      errors.push('Add consented production capacity');
    }
    if (data.fieldReport.ipc === '') {
      errors.push('Add installed production capacity');
    }
    if (data.fieldReport.ppopd === '') {
      errors.push('Add present production of previous day');
    }
    if (data.fieldReport.fwwpdbofm === '') {
      errors.push(
        'Add fresh water withdrawal previous day based on flow meter',
      );
    }
    if (data.fieldReport.mrr !== 'ganga' && data.fieldReport.mrrname === '') {
      errors.push(`Add ${data.fieldReport.mrr}`);
    }
    if (
      data.fieldReport.sfwc === 'other' &&
      data.fieldReport.sfwcdetail === ''
    ) {
      errors.push('Add source of fresh water consumption');
    }
    if (data.fieldReport.fib === 'other' && data.fieldReport.fibdetail === '') {
      errors.push('Add Flowmeter detail at borewell');
    }
    if (
      data.fieldReport.fietpinlet === 'other' &&
      data.fieldReport.fietpinletdetail === ''
    ) {
      errors.push('Add Flowmeter detail at ETP inlet');
    }
    if (
      data.fieldReport.fietpoutlent === 'other' &&
      data.fieldReport.fietpoutlentdetail === ''
    ) {
      errors.push('Add Flowmeter detail at ETP outlet');
    }
    if (data.fieldReport.fmetpoutletcdf === '') {
      errors.push('Flow meter at ETP outlent current day flow rate');
    }
    if (data.fieldReport.fmetpoutletpdf === '') {
      errors.push('Flow meter at ETP outlent previous day flow rate');
    }
    if (data.fieldReport.os === 'other' && data.fieldReport.osdetail === '') {
      errors.push('Add ocems status');
    }
    if (data.fieldReport.semfetp === 'yes' && data.fieldReport.semfer === '') {
      errors.push('Add Energy meter for etp reading');
    }
    if (errors.length > 0) {
      setErrors(errors);
    } else {
      // Send it to server
      setLoading(true);
      setState({ ...state, sendToserver: true });
      dispatch(fieldReportActions.saveServerData(data, changeProgress));
    }
  };

  const success = (pos) => {
    if (mounted) {
      var crd = pos.coords;
      var lat = crd.latitude;
      var log = crd.longitude;
      // console.log(lat, log);
      //   setEntryCrd([lat, log]);
      setEntryLat([lat, log]);
      //   setState({ ...state, entryCrd: [lat, log] });
    }
  };

  const [entryLat, setEntryLat] = useState([0, 0]);
  useEffect(() => {
    setState({ ...state, entryCrd: entryLat });
  }, entryLat);
  const error = (err) => {
    if (mounted) {
      ToastAndroid.show('Unable to get your location', ToastAndroid.SHORT);
    }
  };

  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(true);

  const fieldReportReducer = useSelector(
    (state: any) => state.fieldReportReducer,
  );
  const fieldId = route.params._id;
  const stateRef = useRef();
  useEffect(() => {
    // findReport
    // console.log(fieldReports.fieldReports)
    const fieldReports = fieldReportReducer.fieldReports;
    const myReport = fieldReports.find((e) => e.id === fieldId);
    if (myReport) {
      if (myReport.sendToserver) {
        setLoading(true);
      } else {
        setState(myReport);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => {
      // Save State
      // Check data ready for save to state
      saveState();
      mounted = false;
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const saveState = () =>
    dispatch(fieldReportActions.saveLocalFunction(stateRef.current));

  // const [progress, setProgress] = useState(0);
  let progress = 0;

  function changeProgress(precentUploaded) {
    setProgressBarPrecent(precentUploaded);
  }

  const [progressBarPrecent, setProgressBarPrecent] = useState(0);

  // useEffect(() => {
  //   setProgressBarPrecent(progress);
  //   console.log('progress', progressBarPrecent);
  // }, [progress]);
  return (
    <SafeAreaView>
      {loading ? (
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {progress === 0 ? (
              <ActivityIndicator animating={true} />
            ) : (
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                progress={progressBarPrecent / 100}
                color="#2196F3"
                animating={true}
                style={{ width: '80%' }}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          {state.uri === '' && state.openCamera === false ? (
            <View style={{ width: '100%', height: '100%' }}>
              {state.selfie.length === 1 ? (
                <View>
                  <ScrollView>
                    <View style={styles.inputContainerStyle}>
                      <Title>Lat - {state.entryCrd[0]}</Title>
                      <Title>Long - {state.entryCrd[1]}</Title>
                      {state.locationError ? (
                        <Title>Unable to get your location</Title>
                      ) : null}
                    </View>
                    <View style={styles.inputContainerStyle}>
                      <Title>Contacted Person</Title>
                      <TextInput
                        mode="outlined"
                        style={styles.inputContainerStyle}
                        label="Name"
                        placeholder="Contacted person name"
                        value={state.pocName}
                        onChangeText={(pocName) =>
                          setState({ ...state, pocName: pocName })
                        }
                      />
                      <TextInput
                        mode="outlined"
                        style={styles.inputContainerStyle}
                        label="Phone Number"
                        placeholder="Contacted person phone Number"
                        value={state.pocPhone}
                        onChangeText={(pocPhone) =>
                          setState({ ...state, pocPhone: pocPhone })
                        }
                      />
                      <TextInput
                        mode="outlined"
                        style={styles.inputContainerStyle}
                        label="Email"
                        placeholder="Contacted person email"
                        value={state.pocEmail}
                        onChangeText={(pocEmail) =>
                          setState({ ...state, pocEmail: pocEmail })
                        }
                      />
                    </View>

                    <View style={styles.inputContainerStyle}>
                      <Title>Unit operation status</Title>
                      <RadioButton.Group
                        onValueChange={(value) =>
                          setState({ ...state, unitStatus: value })
                        }
                        value={state.unitStatus}>
                        <RadioButton.Item
                          label={'operational'}
                          value={'operational'}
                        />
                        <RadioButton.Item
                          label={'non operational'}
                          value={'non-operational'}
                        />
                        <RadioButton.Item label={'other'} value={'other'} />
                      </RadioButton.Group>
                    </View>

                    {state.unitStatus === 'other' ? (
                      <View style={styles.inputContainerStyle}>
                        <TextInput
                          mode="outlined"
                          style={styles.inputContainerStyle}
                          label="unit status"
                          placeholder="explanation"
                          value={state.uosdetail}
                          onChangeText={(value) =>
                            setState({ ...state, uosdetail: value })
                          }
                        />
                      </View>
                    ) : null}

                    {state.unitStatus === 'non-operational' ? (
                      <View style={styles.inputContainerStyle}>
                        <Title>Unit non operation status</Title>
                        <RadioButton.Group
                          onValueChange={(value) =>
                            setState({ ...state, nUos: value })
                          }
                          value={state.nUos}>
                          <RadioButton.Item
                            label={'temporary closed'}
                            value={'temp-closed'}
                          />
                          <RadioButton.Item
                            label={'self closed'}
                            value={'self-closed'}
                          />
                          <RadioButton.Item label={'other'} value={'other'} />
                        </RadioButton.Group>
                      </View>
                    ) : (
                      <View>
                        <View style={styles.inputContainerStyle}>
                          <Title>ETP status</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, etpos: value })
                            }
                            value={state.etpos}>
                            <RadioButton.Item
                              label="operational"
                              value="operational"
                            />
                            <RadioButton.Item
                              label="non operational"
                              value="non-operational"
                            />
                            <RadioButton.Item label="other" value="other" />
                          </RadioButton.Group>
                          {state.etpos === 'other' ? (
                            <TextInput
                              mode="outlined"
                              style={styles.inputContainerStyle}
                              placeholder="ETP status explanation"
                              value={state.etposDetail}
                              onChangeText={(value) =>
                                setState({ ...state, etposDetail: value })
                              }
                            />
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Consented Production capacity</Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder={'XXX TCD'}
                            label={'consented production in (TCD/TPD/KLD)'}
                            mode={'outlined'}
                            value={state.cpc}
                            onChangeText={(value) =>
                              setState({ ...state, cpc: value })
                            }
                          />
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Installed Production Capacity</Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder={'XXX TCD'}
                            label={'Installed production in (TCD/TPD/KLD)'}
                            mode={'outlined'}
                            value={state.ipc}
                            onChangeText={(value) =>
                              setState({ ...state, ipc: value })
                            }
                          />
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Present production of previous day</Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder={'XXX TCD'}
                            label={'previous day production in (TCD/TPD/KLD)'}
                            mode={'outlined'}
                            value={state.ppopd}
                            onChangeText={(value) =>
                              setState({ ...state, ppopd: value })
                            }
                          />
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>
                            Fresh water withdrawal previous day based on flow
                            meter
                          </Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder={'XXX KLD'}
                            label={'flow meter reading'}
                            mode={'outlined'}
                            value={state.fwwpdbofm}
                            onChangeText={(value) =>
                              setState({ ...state, fwwpdbofm: value })
                            }
                          />
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Online connectivity status</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, ocs: value })
                            }
                            value={state.ocs}>
                            <RadioButton.Item label="connected" value="yes" />
                            <RadioButton.Item
                              label="not connected"
                              value="no"
                            />
                          </RadioButton.Group>
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Status of NOC from CGWA</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, sonfc: value })
                            }
                            value={state.sonfc}>
                            <RadioButton.Item label="valid" value="valid" />
                            <RadioButton.Item
                              label="not valid"
                              value="not-valid"
                            />
                          </RadioButton.Group>
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Mode to reach river</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, mrr: value })
                            }
                            value={state.mrr}>
                            <RadioButton.Item label="drain" value="drain" />
                            <RadioButton.Item
                              label="tributary"
                              value="tributary"
                            />
                            <RadioButton.Item
                              label="directly to river ganga"
                              value="ganga"
                            />
                          </RadioButton.Group>
                          {state.mrr !== 'ganga' ? (
                            <TextInput
                              style={styles.inputContainerStyle}
                              placeholder={`${state.mrr} name`}
                              label={state.mrr}
                              mode={'outlined'}
                              value={state.mrrname}
                              onChangeText={(value) =>
                                setState({ ...state, mrrname: value })
                              }
                            />
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Consent status air consent</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, csac: value })
                            }
                            value={state.csac}>
                            <RadioButton.Item label="valid" value="valid" />
                            <RadioButton.Item label="invalid" value="invalid" />
                            <RadioButton.Item label="applied" value="applied" />
                            <RadioButton.Item
                              label="not Provided"
                              value="not-provided"
                            />
                          </RadioButton.Group>
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Water consent</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, wc: value })
                            }
                            value={state.wc}>
                            <RadioButton.Item label="valid" value="valid" />
                            <RadioButton.Item label="invalid" value="invalid" />
                            <RadioButton.Item label="applied" value="applied" />
                            <RadioButton.Item
                              label="not Provided"
                              value="not-provided"
                            />
                          </RadioButton.Group>
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Hazardous consent</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, hc: value })
                            }
                            value={state.hc}>
                            <RadioButton.Item label="valid" value="valid" />
                            <RadioButton.Item label="invalid" value="invalid" />
                            <RadioButton.Item label="applied" value="applied" />
                            <RadioButton.Item
                              label="not Provided"
                              value="not-provided"
                            />
                          </RadioButton.Group>
                        </View>

                        <View style={styles.inputContainerStyle}>
                          <Title>CGWA consent</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, cc: value })
                            }
                            value={state.cc}>
                            <RadioButton.Item label="valid" value="valid" />
                            <RadioButton.Item label="invalid" value="invalid" />
                            <RadioButton.Item label="applied" value="applied" />
                            <RadioButton.Item
                              label="not Provided"
                              value="not-provided"
                            />
                          </RadioButton.Group>
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Source of fresh water consumption</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, sfwc: value })
                            }
                            value={state.sfwc}>
                            <RadioButton.Item
                              label="borewell"
                              value="borewell"
                            />
                            <RadioButton.Item
                              label="tubeWell"
                              value="tubewell"
                            />
                            <RadioButton.Item label="river" value="river" />
                            <RadioButton.Item label="other" value="other" />
                          </RadioButton.Group>
                          {state.sfwc === 'other' ? (
                            <TextInput
                              style={styles.inputContainerStyle}
                              placeholder="source of water consumption"
                              underlineColorAndroid="transparent"
                              mode={'outlined'}
                              value={state.sfwcdetail}
                              onChangeText={(value) =>
                                setState({ ...state, sfwcdetail: value })
                              }
                            />
                          ) : null}

                          {/* Flowmeter installed at borewell */}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Flowmeter installed at borewell</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, fib: value })
                            }
                            value={state.fib}>
                            <RadioButton.Item
                              label={'installed & working'}
                              value="installed-working"
                            />
                            <RadioButton.Item
                              label={'installed & not working'}
                              value="installed-not-working"
                            />
                            <RadioButton.Item
                              label={'not installed'}
                              value="not-installed"
                            />
                            <RadioButton.Item label="other" value="other" />
                          </RadioButton.Group>
                          {state.fib === 'other' ? (
                            <TextInput
                              style={styles.inputContainerStyle}
                              placeholder="borewell flowmeter details"
                              underlineColorAndroid="transparent"
                              mode={'outlined'}
                              value={state.fibDetail}
                              onChangeText={(value) =>
                                setState({ ...state, fibDetail: value })
                              }
                            />
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Flowmeter installed at ETP inlet</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, fietpinlet: value })
                            }
                            value={state.fietpinlet}>
                            <RadioButton.Item
                              label={'installed & working'}
                              value="installed-working"
                            />
                            <RadioButton.Item
                              label={'installed & not working'}
                              value="installed-not-working"
                            />
                            <RadioButton.Item
                              label={'not installed'}
                              value="not-installed"
                            />
                            <RadioButton.Item label="Other" value="other" />
                          </RadioButton.Group>
                          {state.fietpinlet === 'other' ? (
                            <TextInput
                              style={styles.inputContainerStyle}
                              placeholder="Reason...."
                              underlineColorAndroid="transparent"
                              mode={'outlined'}
                              value={state.fietpinletdetail}
                              onChangeText={(value) =>
                                setState({ ...state, fietpinletdetail: value })
                              }
                            />
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Flowmeter installed at ETP outlet</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, fietpoutlent: value })
                            }
                            value={state.fietpoutlent}>
                            <RadioButton.Item
                              label={'installed & working'}
                              value="installed-working"
                            />
                            <RadioButton.Item
                              label={'installed & not working'}
                              value="installed-not-working"
                            />
                            <RadioButton.Item
                              label={'not installed'}
                              value="not-installed"
                            />
                            <RadioButton.Item label="other" value="other" />
                          </RadioButton.Group>
                          {state.fietpoutlent === 'other' ? (
                            <TextInput
                              style={styles.inputContainerStyle}
                              placeholder="Reason...."
                              underlineColorAndroid="transparent"
                              mode={'outlined'}
                              value={state.fietpoutlentdetail}
                              onChangeText={(value) =>
                                setState({
                                  ...state,
                                  fietpoutlentdetail: value,
                                })
                              }
                            />
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>
                            Flow meter at ETP outlet current day flow rate
                            (m3/hr)
                          </Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder={'Flow meter at ETP outlet Current day'}
                            label={'Flow meter at ETP outlet Current day'}
                            mode={'outlined'}
                            value={state.fmetpoutletcdf}
                            onChangeText={(value) =>
                              setState({ ...state, fmetpoutletcdf: value })
                            }
                          />
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>
                            Flow meter at ETP outlet previous day flow (KLD)
                          </Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder={
                              'Flow meter at ETP outlet Previous day'
                            }
                            label={'Flow meter at ETP outlet Previous day'}
                            mode={'outlined'}
                            value={state.fmetpoutletpdf}
                            onChangeText={(value) =>
                              setState({ ...state, fmetpoutletpdf: value })
                            }
                          />
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>OCEMS status</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, os: value })
                            }
                            value={state.os}>
                            <RadioButton.Item
                              label={'Installed & Working'}
                              value="installed-working"
                            />
                            <RadioButton.Item
                              label={'Installed & not Working'}
                              value="installed-not-working"
                            />
                            <RadioButton.Item
                              label={'Not Installed'}
                              value="not-installed"
                            />
                            <RadioButton.Item label="other" value="other" />
                          </RadioButton.Group>
                          {state.os === 'other' ? (
                            <TextInput
                              style={styles.inputContainerStyle}
                              placeholder="Reason...."
                              underlineColorAndroid="transparent"
                              mode={'outlined'}
                              value={state.osDetail}
                              onChangeText={(text) =>
                                setState({ ...state, osDetail: text })
                              }
                            />
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Separate energy meter for ETP</Title>
                          <RadioButton.Group
                            onValueChange={(value) =>
                              setState({ ...state, semfetp: value })
                            }
                            value={state.semfetp}>
                            <RadioButton.Item label={'Yes'} value="yes" />
                            <RadioButton.Item label={'No'} value="no" />
                          </RadioButton.Group>
                          {state.semfetp === 'yes' ? (
                            <View>
                              <Title>
                                Separate Energy meter for ETP Reading
                              </Title>
                              <TextInput
                                style={styles.inputContainerStyle}
                                placeholder={
                                  'Separate Energy meter for ETP Reading'
                                }
                                label={'Separate Energy meter for ETP Reading'}
                                mode={'outlined'}
                                value={state.semfer}
                                onChangeText={(value) =>
                                  setState({ ...state, semfer: value })
                                }
                              />
                            </View>
                          ) : null}
                        </View>
                        <View style={styles.inputContainerStyle}>
                          <Title>Specific Observations</Title>
                          <TextInput
                            style={styles.inputContainerStyle}
                            placeholder="Reason...."
                            underlineColorAndroid="transparent"
                            multiline={true}
                            numberOfLines={2}
                            value={state.specificobservations}
                            onChangeText={(text) =>
                              setState({
                                ...state,
                                specificobservations: text,
                              })
                            }
                          />
                        </View>
                      </View>
                    )}
                    {state.unitStatus === 'non-operational' &&
                    state.nUos === 'other' ? (
                      <View style={styles.inputContainerStyle}>
                        <TextInput
                          mode="outlined"
                          style={styles.inputContainerStyle}
                          label="non operational unit status"
                          placeholder="explanation"
                          value={state.nuosDetail}
                          onChangeText={(value) =>
                            setState({ ...state, nuosDetail: value })
                          }
                          autoFocus
                        />
                      </View>
                    ) : null}
                    {state.modalVisibleStatus ? (
                      <Modal
                        transparent={false}
                        animationType={'fade'}
                        visible={state.modalVisibleStatus}
                        onRequestClose={() => {
                          showModalFunction(!state.modalVisibleStatus, '');
                        }}>
                        <View style={styles.modelStyle}>
                          <FastImage
                            style={styles.fullImageStyle}
                            source={{ uri: state.imageuri }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <IconButton
                            icon="close"
                            color={Colors.red500}
                            size={30}
                            onPress={() =>
                              showModalFunction(!state.modalVisibleStatus, '')
                            }
                            style={styles.closeButtonStyle}
                          />
                          <IconButton
                            icon="delete"
                            color={Colors.red500}
                            size={30}
                            onPress={() => removeImage(state.imageuri)}
                            style={styles.deleteButton}
                          />
                        </View>
                      </Modal>
                    ) : (
                      <View style={styles.container1}>
                        <FlatList
                          data={state.pictures}
                          renderItem={({ item }) => (
                            <View style={styles.imageContainerStyle}>
                              <TouchableOpacity
                                key={item}
                                style={{ flex: 1 }}
                                onPress={() => {
                                  showModalFunction(true, item);
                                }}>
                                <FastImage
                                  style={styles.imageStyle}
                                  source={{
                                    uri: item,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          //Setting the number of column
                          numColumns={2}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    )}
                    <Button
                      mode="contained"
                      onPress={() => {
                        if (state.unitStatus === 'non-operational') {
                          unitUnoperationalRequest();
                        } else {
                          unitOperationalRequest();
                        }
                      }}
                      style={{ margin: 20 }}>
                      Submit
                    </Button>
                  </ScrollView>
                  <FAB.Group
                    open={state.open}
                    icon={state.open ? 'close' : 'plus'}
                    actions={[
                      {
                        label: 'attach photos',
                        icon: 'image-multiple',
                        onPress: () => setFabAction('upload-files'),
                      },
                      {
                        label: 'take photos',
                        icon: 'paperclip',
                        onPress: () => setFabAction('take-photo'),
                      },
                      {
                        label: 'sos',
                        icon: 'car-brake-alert',
                        onPress: () => setFabAction('sos'),
                      },
                    ]}
                    onStateChange={onStateChange}
                  />
                  <Portal>
                    <Dialog
                      visible={errors.length > 0 ? true : false}
                      onDismiss={() => {
                        setErrors([]);
                      }}>
                      <Dialog.Content>
                        <Title>Resolve following errors</Title>

                        {errors.map((error) => (
                          <Text key={error}>{error}</Text>
                        ))}
                      </Dialog.Content>
                    </Dialog>
                  </Portal>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Title>Take selfie to start inspection</Title>
                  <Button
                    mode="contained"
                    icon="camera"
                    style={{ margin: 20 }}
                    onPress={() =>
                      setState({ ...state, type: 'front', openCamera: true })
                    }>
                    Take Selfie
                  </Button>
                </View>
              )}
            </View>
          ) : null}
          {state.uri === '' && state.openCamera === true ? (
            <RNCamera
              ref={cameraRef}
              style={styles.preview}
              type={state.type}
              // flashMode={RNCamera.Constants.FlashMode.on}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={closeCamera} style={styles.capture}>
                  <Title style={{ fontSize: 14 }}> Go Back </Title>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture} style={styles.capture}>
                  <Title style={{ fontSize: 14 }}> SNAP </Title>
                </TouchableOpacity>
              </View>
            </RNCamera>
          ) : null}
          {state.uri ? (
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: state.uri }}
                style={{ width: '100%', height: '100%' }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                }}>
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={removeUri} style={styles.capture}>
                    <Title style={{ fontSize: 14 }}> Cancel </Title>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveImage} style={styles.capture}>
                    <Title style={{ fontSize: 14 }}> Save </Title>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
          <Portal>
            <Dialog visible={state.showSos} onDismiss={changeSos}>
              <Dialog.Content>
                <RadioButton.Group
                  onValueChange={(value) => setState({ ...state, sos: value })}
                  value={state.sos}>
                  <RadioButton.Item
                    label={'Denied Entry'}
                    value="denied-entry"
                  />
                  <RadioButton.Item label={'Bypass'} value="bypass" />
                  <RadioButton.Item label="Other" value="other" />
                </RadioButton.Group>
                {state.sos === 'other' ? (
                  <View>
                    <TextInput
                      placeholder="describe...."
                      underlineColorAndroid="transparent"
                      multiline={true}
                      numberOfLines={2}
                      value={state.sosDetail}
                      onChangeText={(value) =>
                        setState({ ...state, sosDetail: value })
                      }
                      // mode={'outlined'}
                    />
                    <HelperText
                      type="error"
                      visible={
                        state.sos === 'other' && state.sosDetail === ''
                          ? true
                          : false
                      }>
                      Add sos complain details
                    </HelperText>
                  </View>
                ) : null}
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={sosRequest}
                  disabled={
                    state.sos === 'other' && state.sosDetail === ''
                      ? true
                      : false
                  }>
                  Submit
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Factory;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  container1: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formPacketTitle: {
    margin: 10,
  },
  inputContainerStyle: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
    maxWidth: '50%',
  },

  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    top: 40,
    right: 5,
    position: 'absolute',
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 0,
  },
});
