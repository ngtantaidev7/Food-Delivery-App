import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, User, Star, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { submitDriverReview } from '@/services/api';

const FEEDBACK_TAGS = ['Service', 'Supportive', 'Friendly', 'Delivery', 'Contactless'];

export default function DriverRatingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [rating, setRating] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Service', 'Supportive', 'Friendly']);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await submitDriverReview({
        orderId: orderId || 'ord_123',
        customerId: 'current',
        driverId: 'john-cooper',
        ratingStars: rating,
        tags: selectedTags,
        comment,
      }).catch((err) => {
        console.warn('Review submit fallback:', err);
      });

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Submit review error:', err);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Top Header (Page 12 PDF) ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#1E2022" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rating</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Big Driver Avatar Circle (Page 12 PDF) ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <User color="#FFFFFF" size={48} strokeWidth={2} />
          </View>
          <Text style={styles.driverName}>Rate John Cooper</Text>

          {/* Interactive 5 Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Star
                  size={32}
                  color={star <= rating ? '#FFB800' : '#E2E8F0'}
                  fill={star <= rating ? '#FFB800' : 'none'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Leave your feedback here (Page 12 PDF) ── */}
        <Text style={styles.feedbackTitle}>Leave your feedback here</Text>

        {/* Tags Row */}
        <View style={styles.tagsContainer}>
          {FEEDBACK_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                activeOpacity={0.7}
                onPress={() => toggleTag(tag)}
              >
                <Check
                  size={14}
                  color={isSelected ? '#00BDD6' : '#9CA3AF'}
                  strokeWidth={2.5}
                />
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Care to share more? (Page 12 PDF) ── */}
        <Text style={styles.shareMoreTitle}>Care to share more?</Text>
        <View style={styles.commentBox}>
          <TextInput
            placeholder="Leave feedback about driver..."
            placeholderTextColor={Colors.textMuted}
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {/* ── Bottom Submit Button (Page 12 PDF) ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.9}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  driverName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagChipSelected: {
    backgroundColor: '#E0F8FB',
  },
  tagText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#00BDD6',
    fontWeight: '700',
  },
  shareMoreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  commentBox: {
    backgroundColor: '#F7F8F9',
    borderRadius: 12,
    padding: 14,
    minHeight: 110,
  },
  commentInput: {
    fontSize: 14,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  submitBtn: {
    backgroundColor: '#00BDD6',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
