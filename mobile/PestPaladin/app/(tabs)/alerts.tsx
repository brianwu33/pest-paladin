import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, BellOff, Clock, Smartphone, Mail, Rat, Bug, Trash2 } from 'lucide-react-native';
import ProfileHeader from '../../components/ProfileHeader';

export default function AlertsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [ratAlertsEnabled, setRatAlertsEnabled] = useState(true);
  const [insectAlertsEnabled, setInsectAlertsEnabled] = useState(true);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Alerts & Notifications</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Bell size={20} color="#4ade80" />
            </View>
            <Text style={styles.cardTitle}>Notification Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>Receive alerts when pests are detected</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#4ade8050' }}
              thumbColor={notificationsEnabled ? '#4ade80' : '#f3f4f6'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingTitleContainer}>
                <Mail size={16} color="#6b7280" />
                <Text style={styles.settingTitle}>Email Alerts</Text>
              </View>
              <Text style={styles.settingDescription}>Receive alerts via email</Text>
            </View>
            <Switch
              value={emailAlertsEnabled}
              onValueChange={setEmailAlertsEnabled}
              trackColor={{ false: '#d1d5db', true: '#4ade8050' }}
              thumbColor={emailAlertsEnabled ? '#4ade80' : '#f3f4f6'}
              disabled={!notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingTitleContainer}>
                <Smartphone size={16} color="#6b7280" />
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Text style={styles.settingDescription}>Receive alerts on your device</Text>
            </View>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#4ade8050' }}
              thumbColor={pushNotificationsEnabled ? '#4ade80' : '#f3f4f6'}
              disabled={!notificationsEnabled}
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Clock size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.cardTitle}>Alert Schedule</Text>
          </View>
          
          <TouchableOpacity style={styles.scheduleItem}>
            <Text style={styles.scheduleTitle}>Quiet Hours</Text>
            <View style={styles.scheduleValue}>
              <Text style={styles.scheduleValueText}>11:00 PM - 7:00 AM</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scheduleItem}>
            <Text style={styles.scheduleTitle}>Alert Frequency</Text>
            <View style={styles.scheduleValue}>
              <Text style={styles.scheduleValueText}>Immediate</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Bug size={20} color="#f59e0b" />
            </View>
            <Text style={styles.cardTitle}>Pest Type Alerts</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingTitleContainer}>
                <Rat size={16} color="#6b7280" />
                <Text style={styles.settingTitle}>Rodents (Rats, Mice)</Text>
              </View>
              <Text style={styles.settingDescription}>Alert when rodents are detected</Text>
            </View>
            <Switch
              value={ratAlertsEnabled}
              onValueChange={setRatAlertsEnabled}
              trackColor={{ false: '#d1d5db', true: '#4ade8050' }}
              thumbColor={ratAlertsEnabled ? '#4ade80' : '#f3f4f6'}
              disabled={!notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingTitleContainer}>
                <Bug size={16} color="#6b7280" />
                <Text style={styles.settingTitle}>Insects</Text>
              </View>
              <Text style={styles.settingDescription}>Alert when insects are detected</Text>
            </View>
            <Switch
              value={insectAlertsEnabled}
              onValueChange={setInsectAlertsEnabled}
              trackColor={{ false: '#d1d5db', true: '#4ade8050' }}
              thumbColor={insectAlertsEnabled ? '#4ade80' : '#f3f4f6'}
              disabled={!notificationsEnabled}
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        
        <View style={styles.alertItem}>
          <View style={styles.alertIconContainer}>
            <Rat size={20} color="#8b5cf6" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Rat detected in Kitchen</Text>
            <Text style={styles.alertTime}>Today, 8:45 PM</Text>
          </View>
          <TouchableOpacity style={styles.alertAction}>
            <Trash2 size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.alertItem}>
          <View style={styles.alertIconContainer}>
            <Rat size={20} color="#8b5cf6" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Rat detected in Basement</Text>
            <Text style={styles.alertTime}>Today, 8:12 AM</Text>
          </View>
          <TouchableOpacity style={styles.alertAction}>
            <Trash2 size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.alertItem}>
          <View style={styles.alertIconContainer}>
            <Bug size={20} color="#f59e0b" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Cockroach detected in Bathroom</Text>
            <Text style={styles.alertTime}>Yesterday, 7:15 PM</Text>
          </View>
          <TouchableOpacity style={styles.alertAction}>
            <Trash2 size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.clearAllButton}>
          <BellOff size={16} color="#ef4444" />
          <Text style={styles.clearAllText}>Clear All Alerts</Text>
        </TouchableOpacity>
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
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  scheduleValue: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scheduleValueText: {
    fontSize: 14,
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  alertAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 8,
  },
});