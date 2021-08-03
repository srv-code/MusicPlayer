import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Icon = ({ type, name, style, color, size }) => {
  let _Icon = null;
  switch (type) {
    case 'MaterialCommunityIcons':
      _Icon = MaterialCommunityIcons;
      break;
    case 'Ionicons':
      _Icon = Ionicons;
      break;
    default:
      throw new Error(`Invalid type: ${type}`);
  }

  return <_Icon name={name} style={style} color={color} size={size} />;
};

export default Icon;
