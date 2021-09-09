import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../constants/colors';

const Icon = ({
  type = 'MaterialCommunityIcons',
  name,
  style,
  color = colors.lightGrey,
  size = wp(7),
}) => {
  let _Icon = null;
  switch (type) {
    case 'MaterialCommunityIcons':
      _Icon = MaterialCommunityIcons;
      break;
    case 'Ionicons':
      _Icon = Ionicons;
      break;
    case 'Entypo':
      _Icon = Entypo;
      break;
    case 'FontAwesome5':
      _Icon = FontAwesome5;
      break;

    default:
      throw new Error(`Invalid type: ${type}`);
  }

  return <_Icon name={name} style={style} color={color} size={size} />;
};

export default Icon;
