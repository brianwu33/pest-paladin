import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color?: string;
};

export default function StatCard({ icon, title, value, color = '#4ade80' }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'flex-start',
    width: '48%',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
});