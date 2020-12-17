import * as React from 'react';
import { View, SafeAreaView, ScrollView, Image } from 'react-native';
import { Card, TouchableRipple, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import NavigationService from 'app/navigation/NavigationService';
import _ from 'lodash';
import Images from 'app/assets/icons';
import { useIsFocused } from '@react-navigation/native';
const Sector = () => {
  const isFocused = useIsFocused();

  data = useSelector((state: any) => state.inspectionReducer.inspections);
  let data;
  if (isFocused) {
    data = _.chain(data)
      .groupBy('factory.sector.name')
      .map(function (items, sector) {
        return {
          name: sector,
          count: items.length,
          factory: items,
          iconSrc: `${sector.replace(' & ', '').replace(' ', '')}`,
        };
      })
      .orderBy((group) => Number(group.count), ['desc'])
      .value();

    const goTo = (name, data) =>
      NavigationService.navigate('Factory List', { sector: name, data: data });
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            {data && Array.isArray(data) && data.length > 0 ? (
              <View style={styles.cardcontainer}>
                {data.map((sector) => (
                  <Card style={styles.card} key={sector.name}>
                    <TouchableRipple
                      onPress={() => goTo(sector.name, sector.factory)}
                      rippleColor="rgba(0, 0, 0, .32)"
                      borderless={true}
                      style={styles.ripple}>
                      <View style={styles.media}>
                        <Image
                          style={{
                            width: 60,
                            height: 60,
                          }}
                          source={Images[sector.iconSrc]}
                        />
                        <Text style={styles.title}>
                          {sector.name} - {sector.count}
                        </Text>
                      </View>
                    </TouchableRipple>
                  </Card>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return null;
  }
};

export default Sector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardcontainer: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 5,
    borderRadius: 5,
    width: '48%',
    height: 130,
  },
  media: {
    // width: '100%',
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  number: {
    fontSize: 50,
  },
  ripple: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
});
