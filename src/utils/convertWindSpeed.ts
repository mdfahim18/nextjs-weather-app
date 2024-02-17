export default function convertWindSpeed(speedInMeterPerSecond: number) {
  const speedInMeterPerHour = speedInMeterPerSecond * 3.6;
  return `${speedInMeterPerHour.toFixed(0)}km/h`;
}
