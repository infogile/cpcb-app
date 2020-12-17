/**
 * Show Pollution Source list
 */

import React from 'react';
import {
  SafeAreaView,
  View,
  VirtualizedList,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import getDirections from 'react-native-google-maps-directions';
import { useSelector } from 'react-redux';
import {
  Text,
  Card,
  List,
  Divider,
  Caption,
  Title,
  IconButton,
  Colors,
  TouchableRipple,
  Searchbar,
} from 'react-native-paper';
import { createFilter } from 'react-native-search-filter';
import Geolocation from '@react-native-community/geolocation';
import NavigationService from 'app/navigation/NavigationService';

const getItem = (data: any, index: number) => {
  const itemData = data[index];
  return {
    _id: itemData._id,
    code: itemData.factory.unitcode,
    unit: itemData.factory.name,
    state: itemData.factory.state.name,
    district: itemData.factory.district.name,
    ro: itemData.factory.region,
    basin: itemData.factory.basin.name,
    coordinates: itemData.factory.location.coordinates,
  };
};

const getItemCount = (data: any) => {
  return data.length;
};

const Item = (data: any) => {
  // const onDirection = () => {
  //   const data = {
  //     destination: {
  //       latitude: 28.1601922,
  //       longitude: 75.5235159,
  //     },
  //     params: [
  //       {
  //         key: 'travelmode',
  //         value: 'driving', // may be "walking", "bicycling" or "transit" as well
  //       },
  //       {
  //         key: 'dir_action',
  //         value: 'navigate', // this instantly initializes navigation using the given travel mode
  //       },
  //     ],
  //   };

  //   getDirections(data);
  // };
  const onFactory = () =>
    NavigationService.navigate('Factory', {
      _id: data.name._id,
      unit: data.name.unit,
      code: data.name.code,
    });
  return (
    <Card
      style={{
        width: '100%',
        height: 80,
        borderRadius: 0,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <TouchableRipple
        onPress={onFactory}
        rippleColor="rgba(0, 0, 0, .32)"
        borderless={true}
        style={{ width: '100%', height: '100%', padding: 30 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            position: 'relative',
          }}>
          <Text style={{ fontWeight: '800' }}>
            {data.name.code} - {data.name.unit}
          </Text>
          <Caption>
            {data.name.ro} - {data.name.district} - {data.name.state}
          </Caption>
        </View>
      </TouchableRipple>
      {/* <IconButton
        icon="directions"
        color={Colors.blue500}
        size={40}
        onPress={onDirection}
        style={{ position: 'absolute', right: 0, zIndex: 10 }}
      /> */}
    </Card>
  );
};
const FlatListItemSeparator = () => {
  return <Divider />;
};

const KEYS_TO_FILTERS = ['factory.name', 'factory.unitcode', 'factory.region'];

const FactoryList = ({ route }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  let DATA = [];
  DATA = route.params.data;
  DATA = DATA.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <VirtualizedList
        data={DATA}
        initialNumToRender={10}
        renderItem={({ item }) => <Item name={item} />}
        keyExtractor={(item) => item._id}
        getItemCount={getItemCount}
        getItem={getItem}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
});

export default FactoryList;
