import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../constants/colors';

const Icon = ({
  type = 'MaterialCommunityIcons',
  name,
  // stroke = 'default',
  style,
  color = colors.lightGrey,
  size = wp(7),
}) => {
  // const [info, setInfo] = useState(null);

  // useEffect(() => {
  //   const bundle = IconUtils.getInfo(name);
  //   const type = stroke === 'default' ? 'MaterialCommunityIcons' : bundle.type;
  //   let Icon = null;
  //   switch (type) {
  //     case 'MaterialCommunityIcons':
  //       Icon = MaterialCommunityIcons;
  //       break;
  //     case 'MaterialIcons':
  //       Icon = MaterialIcons;
  //       break;
  //     case 'Ionicons':
  //       Icon = Ionicons;
  //       break;
  //     case 'Entypo':
  //       Icon = Entypo;
  //       break;
  //     case 'FontAwesome5':
  //       Icon = FontAwesome5;
  //       break;
  //     default:
  //       throw new Error(`Invalid type: ${type}`);
  //   }
  //   setInfo({ Icon, name: bundle.name[stroke], type });
  // }, [name, stroke]);

  let _Icon = null;
  switch (type) {
    case 'MaterialCommunityIcons':
      _Icon = MaterialCommunityIcons;
      break;
    case 'MaterialIcons':
      _Icon = MaterialIcons;
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
  // return info ? (
  //   <info.Icon name={info.name} style={style} color={color} size={size} />
  // ) : null;
};

export default Icon;
