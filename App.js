import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import env from './app/constants/env';
import { useCallback, useEffect, useRef, useState } from 'react';
import CenterContainer from './app/components/CenterContainer';

const API_URL = `https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20`;
const IMAGE_SIZE = 100;
const SPLACING = 10;

export default function App() {
  const { width, height } = useWindowDimensions();
  const [img, setImg] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0);
  const topRef = useRef();
  const downRef = useRef();


  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = async () => {
    try {
      const data = await fetch(API_URL, {
        headers: {
          'Authorization': env.API_KEY
        }
      })
      const result = await data.json();
      setImg(result.photos);
    } catch (err) {
      alert(err);
    }
  }

  const scrollToActiveIndex = (index) => {
    //setIndex(index);
    //scroll flatlists
    setActiveIndex(index)
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true
    })

    if (index * (IMAGE_SIZE + SPLACING) - IMAGE_SIZE / 2 > width / 2) {
      downRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPLACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true
      })
    } else {
      downRef?.current?.scrollToOffset({
        offset: 0,
        animated: true
      })
    }

  }

  const _renderItem = useCallback(({ item, index }) => {
    return <View style={{ width, height }}>
      <Image
        source={{ uri: item.src.portrait }}
        style={[StyleSheet.absoluteFillObject]} />
    </View>
  }, [img])

  const _keyExtractor = useCallback((item, i) => item.id.toString())
  if (!img) {
    return <CenterContainer><Text>Loading.....</Text></CenterContainer>;
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        ref={topRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={img}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        onMomentumScrollEnd={ev => {
          scrollToActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
      />
      <FlatList
        ref={downRef}
        horizontal
        data={img}
        showsHorizontalScrollIndicator={false}
        keyExtractor={_keyExtractor}
        contentContainerStyle={{ paddingHorizontal: SPLACING }}
        renderItem={({ item, index }) => {
          return <TouchableOpacity
            onPress={() => scrollToActiveIndex(index)}
            activeOpacity={0.8}>
            <Image
              source={{ uri: item.src.portrait }}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 12,
                marginRight: SPLACING,
                borderWidth: 2,
                borderColor: index == activeIndex ? '#fff' : 'transparent'
              }}
            />

          </TouchableOpacity>
        }}
        style={{
          position: 'absolute',
          bottom: IMAGE_SIZE * 0.5,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
