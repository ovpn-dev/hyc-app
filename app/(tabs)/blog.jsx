import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import he from "he";

const BlogScreen = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://helpyouthcope.org/wp-json/wp/v2/posts?_embed"
        );
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostPress = (post) => {
    setSelectedPost(post);
  };

  const decodeHtmlEntities = (text) => {
    return he.decode(text);
  };

  const renderPostItem = ({ item }) => {
    // Extract featured image
    const featuredImage = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    return (
      <TouchableOpacity
        className="p-4 border-b border-gray-200 bg-white"
        onPress={() => handlePostPress(item)}
      >
        {featuredImage && (
          <Image
            source={{ uri: featuredImage }}
            className="w-full h-48 mb-4 rounded-lg"
            resizeMode="cover"
          />
        )}
        <Text className="text-lg font-bold mb-2">
          {decodeHtmlEntities(item.title.rendered)}
        </Text>
        <Text className="text-gray-600">
          {decodeHtmlEntities(
            item.excerpt.rendered.replace(/(<([^>]+)>)/gi, "")
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  // If a post is selected, show its details
  if (selectedPost) {
    // Extract featured image
    const featuredImage =
      selectedPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    return (
      <SafeAreaView className="flex-1">
        <View className="bg-white flex-1">
          <TouchableOpacity
            className="p-4 border-b border-gray-200"
            onPress={() => setSelectedPost(null)}
          >
            <Text className="text-blue-600">← Back to Blog List</Text>
          </TouchableOpacity>
          <FlatList
            data={[selectedPost]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="p-4">
                  {featuredImage && (
                    <Image
                      source={{ uri: featuredImage }}
                      className="w-full h-64 mb-4 rounded-lg"
                      resizeMode="cover"
                    />
                  )}
                  <Text className="text-2xl font-bold mb-4">
                    {decodeHtmlEntities(item.title.rendered)}
                  </Text>
                  {item.content.rendered ? (
                    <RenderHtml
                      baseStyle={{ maxWidth: width }}
                      contentWidth={width}
                      source={{
                        html: decodeHtmlEntities(item.content.rendered),
                      }}
                      tagsStyles={{
                        p: {
                          marginBottom: 10,
                          maxWidth: width - 32,
                        },
                        img: {
                          marginBottom: 10,
                          maxWidth: width - 32,
                          height: undefined,
                          aspectRatio: 1,
                        },
                      }}
                    />
                  ) : (
                    <Text>No content available</Text>
                  )}
                </View>
              </ScrollView>
            )}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Blog list view
  return (
    <SafeAreaView className="flex-1">
      <View className="mb-2 p-2 bg-[#161622]">
        <Text className="text-lg text-center text-white font-bold">
          Help Youth Cope Blog Posts
        </Text>
      </View>
      <View className="flex-1">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default BlogScreen;
