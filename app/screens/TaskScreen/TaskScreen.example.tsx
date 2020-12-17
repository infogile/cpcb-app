import * as React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Title,
  Card,
  Divider,
  FAB,
  IconButton,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FileViewer from 'react-native-file-viewer';
import { StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import NavigationService from 'app/navigation/NavigationService';
const TaskScreen: React.Fc = ({ route }) => {
  // const [state, setState] = React.useState({
  //   Images: [],
  // });
  const [Images, setImages] = React.useState([]);
  const setImage = (data: any[]) => setImages(data);
  const uploadFiles = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      setImage([...Images, ...results]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  const openFile = async (file) => {
    try {
      await FileViewer.open(file);
    } catch (error) {
      ToastAndroid.show('File not found', ToastAndroid.SHORT);
    }
  };

  const openCamera = () =>
    NavigationService.navigate('Camera', { type: 'back' });

  return (
    <SafeAreaView>
      <View
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}>
        <ScrollView>
          <View style={{ width: '100%', height: '100%', position: 'relative' }}>
            <View
              style={{
                margin: 8,
              }}>
              {route.params.data.map((data: any, index: number) => {
                return (
                  <View key={data.title}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}>
                      <Title key={data.title}>
                        {index + 1}. {data.title}
                      </Title>
                    </View>
                    <Divider />
                  </View>
                );
              })}
              <ScrollView horizontal={true} ItemSeparatorComponent={Divider}>
                {Images.map((image, index) => (
                  <Card
                    key={index}
                    onPress={() => openFile(image.uri)}
                    style={{
                      margin: 8,
                      height: 100,
                      width: 100,
                    }}>
                    <Image
                      source={{ uri: `${image.uri}`, isStatus: true }}
                      style={{
                        resizeMode: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Card>
                ))}
              </ScrollView>
            </View>
            <View style={styles.searchSection}>
              <View
                style={{
                  // flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}>
                <IconButton icon="paperclip" size={25} onPress={uploadFiles} />
                <IconButton icon="camera" size={25} onPress={openCamera} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Comment"
                // onChangeText={(searchString) => {
                //   this.setState({ searchString });
                // }}
                underlineColorAndroid="transparent"
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={{ margin: 8 }}>
              <Button icon="upload" mode="contained">
                Submit
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default TaskScreen;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
});
