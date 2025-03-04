import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock, Filter, ChevronDown } from 'lucide-react-native';
import ProfileHeader from '../../components/ProfileHeader';

const detectionData = [
  {
    id: '1',
    type: 'Rat',
    location: 'Kitchen',
    time: 'Today, 8:45 PM',
    duration: '3 min 24 sec',
    image: 'https://images.unsplash.com/photo-1589874186480-ecd778e0b1a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '2',
    type: 'Rat',
    location: 'Basement',
    time: 'Today, 8:12 AM',
    duration: '2 min 58 sec',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '3',
    type: 'Mouse',
    location: 'Living Room',
    time: 'Yesterday, 11:30 PM',
    duration: '1 min 45 sec',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '4',
    type: 'Cockroach',
    location: 'Bathroom',
    time: 'Yesterday, 7:15 PM',
    duration: '4 min 12 sec',
    image: 'https://images.unsplash.com/photo-1589874186480-ecd778e0b1a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '5',
    type: 'Rat',
    location: 'Attic',
    time: '2 days ago, 3:20 PM',
    duration: '5 min 37 sec',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export default function DetectionsScreen() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader />
      
      <View style={styles.header}>
        <Text style={styles.title}>Detections</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={18} color="#4b5563" />
          <Text style={styles.filterText}>Filter</Text>
          <ChevronDown size={16} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {filterOpen && (
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Date Range:</Text>
            <TouchableOpacity style={styles.dateRangeButton}>
              <Calendar size={16} color="#4b5563" />
              <Text style={styles.dateRangeText}>Last 7 days</Text>
              <ChevronDown size={14} color="#4b5563" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Pest Type:</Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity style={[styles.chip, styles.chipActive]}>
                <Text style={styles.chipTextActive}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip}>
                <Text style={styles.chipText}>Rats</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip}>
                <Text style={styles.chipText}>Mice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip}>
                <Text style={styles.chipText}>Insects</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Location:</Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity style={[styles.chip, styles.chipActive]}>
                <Text style={styles.chipTextActive}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip}>
                <Text style={styles.chipText}>Kitchen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip}>
                <Text style={styles.chipText}>Basement</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Detections</Text>
        
        {detectionData.map((detection) => (
          <TouchableOpacity key={detection.id} style={styles.detectionCard}>
            <Image source={{ uri: detection.image }} style={styles.detectionImage} />
            <View style={styles.detectionContent}>
              <View style={styles.detectionHeader}>
                <Text style={styles.detectionType}>{detection.type}</Text>
                <View style={styles.detectionBadge}>
                  <Text style={styles.detectionBadgeText}>Verified</Text>
                </View>
              </View>
              
              <View style={styles.detectionDetail}>
                <MapPin size={14} color="#6b7280" />
                <Text style={styles.detectionDetailText}>{detection.location}</Text>
              </View>
              
              <View style={styles.detectionDetail}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.detectionDetailText}>{detection.time}</Text>
              </View>
              
              <View style={styles.detectionFooter}>
                <Text style={styles.detectionDuration}>Duration: {detection.duration}</Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginHorizontal: 6,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dateRangeText: {
    fontSize: 14,
    color: '#4b5563',
    marginHorizontal: 6,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#4ade80',
  },
  chipText: {
    fontSize: 14,
    color: '#4b5563',
  },
  chipTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  applyButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detectionImage: {
    width: '100%',
    height: 160,
  },
  detectionContent: {
    padding: 16,
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detectionType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  detectionBadge: {
    backgroundColor: '#4ade8020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  detectionBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4ade80',
  },
  detectionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectionDetailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  detectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  detectionDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  viewButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
});