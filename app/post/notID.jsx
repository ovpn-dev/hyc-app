import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

const PostScreen = () => {
  const router = useRouter(); // Use router to access route parameters
  const { id } = router.query; // Extract the ID parameter
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (id) {
      // Ensure ID exists before fetching
      fetch(
        `https://dev-prime-estates.pantheonsite.io/wp-json/wp/v2/posts/${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.postTitle}>{post.title.rendered}</Text>
      <RenderHTML
        contentWidth={width}
        source={{ html: post.content.rendered }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  postTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  errorText: { fontSize: 18, color: "red" },
});

export default PostScreen;
