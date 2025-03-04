import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

type BarChartProps = {
  data: { time: string; count: number }[];
  maxValue?: number;
};

export default function BarChart({ data, maxValue = 6 }: BarChartProps) {
  // Find the actual max value in the data
  const dataMaxValue = Math.max(...data.map(item => item.count), 1);
  // Use the larger of the provided maxValue or the actual max value
  const chartMaxValue = Math.max(maxValue, dataMaxValue);
  
  return (
    <View style={styles.container}>
      <View style={styles.yAxis}>
        {[...Array(5)].map((_, index) => {
          const value = Math.round((chartMaxValue / 4) * (4 - index));
          return (
            <Text key={index} style={styles.yAxisLabel}>
              {value}
            </Text>
          );
        })}
      </View>
      
      <View style={styles.chartContent}>
        <View style={styles.horizontalLines}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.horizontalLine} />
          ))}
        </View>
        
        <View style={styles.bars}>
          {data.map((item, index) => {
            const barHeight = (item.count / chartMaxValue) * 180; // 180 is the approximate height of the chart area
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { height: Math.max(barHeight, 4) } // Minimum height of 4 for visibility
                    ]}
                  />
                </View>
                <Text style={styles.xAxisLabel}>{item.time}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    flexDirection: 'row',
    paddingBottom: 20,
    paddingRight: 10,
  },
  yAxis: {
    width: 30,
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  yAxisLabel: {
    textAlign: 'right',
    fontSize: 10,
    color: '#9ca3af',
  },
  chartContent: {
    flex: 1,
    height: '100%',
  },
  horizontalLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#f3f4f6',
    width: '100%',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barLabelContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  bar: {
    width: 20,
    backgroundColor: '#4ade80',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 5,
  },
});