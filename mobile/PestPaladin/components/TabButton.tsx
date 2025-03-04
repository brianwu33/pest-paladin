import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type TabButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

export default function TabButton({ title, active, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        active ? styles.activeButton : null,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          active ? styles.activeButtonText : null,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginRight: 8,
  },
  activeButton: {
    backgroundColor: '#4ade80',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeButtonText: {
    color: '#ffffff',
  },
});