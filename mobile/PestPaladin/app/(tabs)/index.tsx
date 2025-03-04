import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bug, Clock, Rat, ExternalLink, ChartBar as BarChart3, MapPin } from 'lucide-react-native';
import StatCard from '../../components/StatCard';
import TabButton from '../../components/TabButton';
import ProfileHeader from '../../components/ProfileHeader';
import BarChart from '../../components/BarChart';

const chartData = [
  { time: '8AM', count: 1 },
  { time: '12PM', count: 0 },
  { time: '4PM', count: 0 },
  { time: '8PM', count: 2 },
  { time: '12AM', count: 0 },
  { time: '4AM', count: 0 },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Peak Activity Times');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Pest Detection Dashboard</Text>
        
        <View style={styles.statsContainer}>
          <StatCard 
            icon={<Bug size={20} color="#4ade80" />}
            title="Total Detection"
            value="2"
          />
          <StatCard 
            icon={<Clock size={20} color="#f59e0b" />}
            title="Average Pest Duration"
            value="3 min 16 sec"
            color="#f59e0b"
          />
          <StatCard 
            icon={<Rat size={20} color="#8b5cf6" />}
            title="Most Frequent Species"
            value="Rats"
            color="#8b5cf6"
          />
          <StatCard 
            icon={<Clock size={20} color="#ec4899" />}
            title="Latest Detection"
            value={
              <View style={styles.latestDetection}>
                <Text style={styles.latestDetectionText}>7 min ago</Text>
                <ExternalLink size={16} color="#ec4899" />
              </View>
            }
            color="#ec4899"
          />
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <TabButton 
              title="Peak Activity Times" 
              active={activeTab === 'Peak Activity Times'} 
              onPress={() => setActiveTab('Peak Activity Times')} 
            />
            <TabButton 
              title="Pest Type" 
              active={activeTab === 'Pest Type'} 
              onPress={() => setActiveTab('Pest Type')} 
            />
            <TabButton 
              title="Detection Trend" 
              active={activeTab === 'Detection Trend'} 
              onPress={() => setActiveTab('Detection Trend')} 
            />
            <TabButton 
              title="Location" 
              active={activeTab === 'Location'} 
              onPress={() => setActiveTab('Location')} 
            />
          </ScrollView>
        </View>

        <View style={styles.chartContainer}>
          <BarChart data={chartData} />
        </View>

        <View style={styles.recentDetectionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Detections</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detectionItem}>
            <View style={styles.detectionIconContainer}>
              <Rat size={20} color="#8b5cf6" />
            </View>
            <View style={styles.detectionInfo}>
              <Text style={styles.detectionTitle}>Rat detected</Text>
              <Text style={styles.detectionTime}>Today, 8:45 PM</Text>
            </View>
            <View style={styles.detectionLocation}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.detectionLocationText}>Kitchen</Text>
            </View>
          </View>

          <View style={styles.detectionItem}>
            <View style={styles.detectionIconContainer}>
              <Rat size={20} color="#8b5cf6" />
            </View>
            <View style={styles.detectionInfo}>
              <Text style={styles.detectionTitle}>Rat detected</Text>
              <Text style={styles.detectionTime}>Today, 8:12 AM</Text>
            </View>
            <View style={styles.detectionLocation}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.detectionLocationText}>Basement</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  latestDetection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  latestDetectionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScroll: {
    flexDirection: 'row',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentDetectionsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4ade80',
  },
  detectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detectionInfo: {
    flex: 1,
  },
  detectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  detectionTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  detectionLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detectionLocationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
});