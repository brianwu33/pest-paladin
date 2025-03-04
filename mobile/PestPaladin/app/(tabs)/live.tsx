import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Maximize2, Volume2, Volume as VolumeMute, Mic, MicOff, Settings } from 'lucide-react-native';

export default function LiveFeedScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Feed</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
          style={styles.cameraFeed}
        />
        
        <View style={styles.liveIndicator}>
          <View style={styles.liveIndicatorDot} />
          <Text style={styles.liveIndicatorText}>LIVE</Text>
        </View>
        
        <View style={styles.cameraControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeMute size={20} color="#ffffff" />
            ) : (
              <Volume2 size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Maximize2 size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? (
              <Mic size={20} color="#ffffff" />
            ) : (
              <MicOff size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cameraSelector}>
        <Text style={styles.selectorTitle}>Camera Locations</Text>
        
        <View style={styles.cameraList}>
          <TouchableOpacity style={[styles.cameraItem, styles.cameraItemActive]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
              style={styles.cameraItemImage}
            />
            <View style={styles.cameraItemOverlay}>
              <Text style={styles.cameraItemText}>Kitchen</Text>
            </View>
            <View style={styles.cameraItemActiveIndicator} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cameraItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
              style={styles.cameraItemImage}
            />
            <View style={styles.cameraItemOverlay}>
              <Text style={styles.cameraItemText}>Basement</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cameraItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
              style={styles.cameraItemImage}
            />
            <View style={styles.cameraItemOverlay}>
              <Text style={styles.cameraItemText}>Living Room</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cameraItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
              style={styles.cameraItemImage}
            />
            <View style={styles.cameraItemOverlay}>
              <Text style={styles.cameraItemText}>Attic</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addCameraButton}>
            <Camera size={24} color="#4ade80" />
            <Text style={styles.addCameraText}>Add Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.activityLog}>
        <View style={styles.activityLogHeader}>
          <Text style={styles.activityLogTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <Text style={styles.activityText}>Movement detected in Kitchen</Text>
          <Text style={styles.activityTime}>2m ago</Text>
        </View>
        
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <Text style={styles.activityText}>Rat detected in Kitchen</Text>
          <Text style={styles.activityTime}>7m ago</Text>
        </View>
      </View>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    marginHorizontal: 16,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
  },
  cameraFeed: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 6,
  },
  liveIndicatorText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cameraSelector: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  cameraList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cameraItem: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  cameraItemActive: {
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  cameraItemImage: {
    width: '100%',
    height: '100%',
  },
  cameraItemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  cameraItemText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  cameraItemActiveIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ade80',
  },
  addCameraButton: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  addCameraText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  activityLog: {
    marginHorizontal: 16,
  },
  activityLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityLogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4ade80',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});