import React from 'react';
import { View, SafeAreaView, Text, Image, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

const SplashScreen: React.FC = () => {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#ffff',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          flex: 1,
          position: 'relative',
        }}>
        <View
          style={{
            width: (Dimensions.get('window').width * 50) / 100,
            height: (Dimensions.get('window').width * 50) / 100,
          }}>
          {/* <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            
            source={require('app/assets/logo.png')}
          /> */}
          <FastImage
            style={{
              width: '100%',
              height: '100%',
            }}
            source={require('app/assets/logo.png')}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ marginBottom: 50 }}>
            Powered by
            <Text style={{ color: '#127D79', fontWeight: 'bold' }}>
              {' '}
              Infogile
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;
