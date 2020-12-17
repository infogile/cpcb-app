import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, RadioButton, TextInput } from 'react-native-paper';

const SOS: React.FC = () => {
  const [sos, setSos] = React.useState('denied-entry');
  return (
    <SafeAreaView>
      <View style={{ width: '100%', height: '100%' }}>
        <RadioButton.Group onValueChange={(value) => setSos(value)} value={sos}>
          <RadioButton.Item label={'Denied Entry'} value="denied-entry" />
          <RadioButton.Item label={'Bypass'} value="bypass" />
          <RadioButton.Item label="Other" value="other" />
        </RadioButton.Group>
        {sos === 'other' ? (
          <TextInput
            placeholder="Reason...."
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={2}
            // mode={'outlined'}
          />
        ) : null}
        <Button
          mode="contained"
          // onPress={submitFactory}
          style={{ margin: 20 }}>
          Submit
        </Button>
      </View>
    </SafeAreaView>
  );
};
export default SOS;
