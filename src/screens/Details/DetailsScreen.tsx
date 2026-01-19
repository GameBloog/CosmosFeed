import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { DetailsScreenProps } from "./DetailsScreen.types"
import { useDetailsViewModel } from "./useDetailsViewModel"
import { styles } from "./DetailsScreen.styles"

export default function DetailsScreen({ route }: DetailsScreenProps) {
  const { id, title, summary, imageUrl, url, publishedAt } = route.params
  const { isSaved, handleSave, handleShare, handleReadMore, formatDate } =
    useDetailsViewModel({ id, title, summary, imageUrl, url, publishedAt })

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(publishedAt)}</Text>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.summary}>{summary}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.actionButtonText}>
              {isSaved ? "★ Saved" : "☆ Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>↗ Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleReadMore}
        >
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
